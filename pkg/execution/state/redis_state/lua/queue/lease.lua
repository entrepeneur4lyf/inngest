--[[

Output:
  0: Successfully leased item
  1: Queue item not found
  2: Queue item already leased

  3: First partition concurrnecy limit hit
  4: Second partition concurrnecy limit hit
  5: Third partition concurrnecy limit hit

  6: Account concurrency limit hit

  7: Rate limited via throttling;  no capacity.

]]

local keyQueueMap            = KEYS[1]
local keyPartitionA          = KEYS[2]           -- queue:sorted:$workflowID - zset
local keyPartitionB          = KEYS[3]           -- e.g. sorted:c|t:$workflowID - zset
local keyPartitionC          = KEYS[4]          -- e.g. sorted:c|t:$workflowID - zset

-- We push our queue item ID into each concurrency queue
local keyConcurrencyA  = KEYS[5] -- Account concurrency level
local keyConcurrencyB  = KEYS[6] -- When leasing an item we need to place the lease into this key.
local keyConcurrencyC  = KEYS[7] -- Optional for eg. for concurrency amongst steps
-- We push pointers to partition concurrency items to the partition concurrency item
local concurrencyPointer      = KEYS[8]
local keyGlobalPointer        = KEYS[9]
local keyGlobalAccountPointer = KEYS[10] -- accounts:sorted - zset
local keyAccountPartitions    = KEYS[11] -- accounts:$accountId:partition:sorted - zset
local throttleKey             = KEYS[12] -- key used for throttling function run starts.
local keyAcctConcurrency      = KEYS[13]

local queueID      = ARGV[1]
local newLeaseKey  = ARGV[2]
local currentTime  = tonumber(ARGV[3]) -- in ms
local partitionIdA = ARGV[4]
local partitionIdB = ARGV[5]
local partitionIdC = ARGV[6]
-- We check concurrency limits when leasing queue items.
local concurrencyA    = tonumber(ARGV[7])
local concurrencyB    = tonumber(ARGV[8])
local concurrencyC    = tonumber(ARGV[9])
-- And we always check against account concurrency limits
local concurrencyAcct = tonumber(ARGV[10])
local accountId       = ARGV[11]

-- Use our custom Go preprocessor to inject the file from ./includes/
-- $include(decode_ulid_time.lua)
-- $include(check_concurrency.lua)
-- $include(get_queue_item.lua)
-- $include(set_item_peek_time.lua)
-- $include(update_pointer_score.lua)
-- $include(gcra.lua)
-- $include(ends_with.lua)
-- $include(update_account_queues.lua)

-- first, get the queue item.  we must do this and bail early if the queue item
-- was not found.
local item = get_queue_item(keyQueueMap, queueID)
if item == nil then
    return 1
end

-- Grab the current time from the new lease key.
local nextTime = decode_ulid_time(newLeaseKey)
-- check if the item is leased.
if item.leaseID ~= nil and item.leaseID ~= cjson.null and decode_ulid_time(item.leaseID) > currentTime then
    -- This is already leased;  don't let this requester lease the item.
    return 2
end

-- Track the earliest time this job was attempted in the queue.
item = set_item_peek_time(keyQueueMap, queueID, item, currentTime)

-- Track throttling/rate limiting IF the queue item has throttling info set.  This allows
-- us to target specific queue items with rate limiting individually.
--
-- We handle this before concurrency as it's typically not used, and it's faster to handle than concurrency,
-- with o(1) operations vs o(log(n)).
if item.data ~= nil and item.data.throttle ~= nil then
	local throttleResult = gcra(throttleKey, currentTime, item.data.throttle.p * 1000, item.data.throttle.l, item.data.throttle.b)
	if throttleResult == false then
		return 7
	end
end

-- Check the concurrency limits for the account and custom key;  partition keys are checked when
-- leasing the partition and do not need to be checked again (only one worker can run a partition at
-- once, and the capacity is kept in memory after leasing a partition)
if concurrencyA > 0 then
    if check_concurrency(currentTime, keyConcurrencyA, concurrencyA) <= 0 then
        return 3
    end
end
if concurrencyB > 0 then
    if check_concurrency(currentTime, keyConcurrencyB, concurrencyB) <= 0 then
        return 4
    end
end
if concurrencyC > 0 then
    if check_concurrency(currentTime, keyConcurrencyC, concurrencyC) <= 0 then
        return 5
    end
end
if concurrencyAcct > 0 then
    if check_concurrency(currentTime, keyAcctConcurrency, concurrencyAcct) <= 0 then
        return 6
    end
end

-- Update the item's lease key.
item.leaseID = newLeaseKey
redis.call("HSET", keyQueueMap, queueID, cjson.encode(item))

local function handleLease(keyPartition, keyConcurrency, partitionID)
	-- Remove the item from our sorted index, as this is no longer on the queue; it's in-progress
	-- and stored in functionConcurrencyKey.
	redis.call("ZREM", keyPartition, item.id)

	-- Update the fn's score in the global pointer queue to the next job, if available.
	local earliestScore = get_fn_partition_score(keyPartition)

	-- TODO If score is 0 (there is no further item in the partition queue), remove the partition pointer
	-- to prevent executors from spinning on guaranteed-empty partitions until the last in-progress item is done
	-- and the partition is gc'd.

	-- NOTE: The global partition ID isn't the actual partition zset key for backwards compatibility.
	-- Instead, they are the partition IDs, which is either the partition ZSET (for new concurrency
	-- key partitions) OR the function ID (for default partitions).
	-- 
	-- The first version of the queue used function UUIDs as queue names, and the global pointer
	-- expected just the function UUIDs instead of a fully defined redis key.
	update_pointer_score_to(partitionID, keyGlobalPointer, earliestScore)

	-- Update account partitions and account pointers with new score of next item
	update_account_queues(keyGlobalAccountPointer, keyAccountPartitions, partitionID, accountId, earliestScore)

	-- For every queue that we lease from, ensure that it exists in the scavenger pointer queue
	-- so that expired leases can be re-processed.  We want to take the earliest time from the
	-- concurrenqy queue such that we get a previously lost job if possible.

	local inProgressScores = redis.call("ZRANGE", keyConcurrency, "-inf", "+inf", "BYSCORE", "LIMIT", 0, 1, "WITHSCORES")
	if inProgressScores ~= false then
		local earliestLease = tonumber(inProgressScores[2])
		-- Add the earliest time to the pointer queue for in-progress, allowing us to scavenge
		-- lost jobs easily.
		-- Note: Previously, we stored the queue name in the zset, so we have to add an extra
		-- check to the scavenger logic to handle partition uuids for old queue items
		redis.call("ZADD", concurrencyPointer, earliestLease, keyConcurrency)
	end
end


-- Always add this to acct level concurrency queues
redis.call("ZADD", keyAcctConcurrency, nextTime, item.id)

-- NOTE: We check if concurrency > 0 here because this disables concurrency.  AccountID
-- and custom concurrency items may not be set, but the keys need to be set for clustered
-- mode.
if exists_without_ending(keyConcurrencyA, ":-") == true and concurrencyA > 0 then
	redis.call("ZADD", keyConcurrencyA, nextTime, item.id)
	handleLease(keyPartitionA, keyConcurrencyA, partitionIdA)
end
if exists_without_ending(keyConcurrencyB, ":-") == true and concurrencyB > 0 then
	redis.call("ZADD", keyConcurrencyB, nextTime, item.id)
	handleLease(keyPartitionB, keyConcurrencyB, partitionIdB)
end
if exists_without_ending(keyConcurrencyC, ":-") == true and concurrencyC > 0 then
	redis.call("ZADD", keyConcurrencyC, nextTime, item.id)
	handleLease(keyPartitionC, keyConcurrencyC, partitionIdC)
end

return 0
