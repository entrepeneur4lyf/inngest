--[[

Output:
  0: Successfully dequeued item
  1: Queue item not found

]]

local keyQueueMap    = KEYS[1]
-- remove items from all outsanding queues it may be in
local keyPartitionA  = KEYS[2]  -- queue:sorted:$workflowID - zset
local keyPartitionB  = KEYS[3]  -- e.g. sorted:c|t:$workflowID - zset
local keyPartitionC  = KEYS[4]  -- e.g. sorted:c|t:$workflowID - zset

local keyConcurrencyA    = KEYS[5] -- Account concurrency level
local keyConcurrencyB    = KEYS[6] -- When leasing an item we need to place the lease into this key.
local keyConcurrencyC    = KEYS[7] -- Optional for eg. for concurrency amongst steps
local keyAcctConcurrency = KEYS[8]       
local keyIdempotency     = KEYS[9]
local concurrencyPointer = KEYS[10]
local keyGlobalPointer   = KEYS[11]
local keyGlobalAccountPointer = KEYS[12]           -- accounts:sorted - zset
local keyAccountPartitions    = KEYS[13]           -- accounts:$accountId:partition:sorted - zset

local keyPartitionMap    = KEYS[14]
local keyItemIndexA      = KEYS[15]   -- custom item index 1
local keyItemIndexB      = KEYS[16]  -- custom item index 2

local queueID        = ARGV[1]
local idempotencyTTL = tonumber(ARGV[2])
local legacyPartitionName  = ARGV[3]
local partitionIdA   = ARGV[4]
local partitionIdB   = ARGV[5]
local partitionIdC   = ARGV[6]
local accountId      = ARGV[7]

-- $include(get_queue_item.lua)
-- $include(get_partition_item.lua)
-- $include(update_pointer_score.lua)
-- $include(ends_with.lua)
-- $include(update_account_queues.lua)

--
-- Fetch this item to see if it was in progress prior to deleting.
local item = get_queue_item(keyQueueMap, queueID)
if item == nil then
	return 1
end

redis.call("HDEL", keyQueueMap, queueID)

-- TODO Are these calls safe? Should we check for present keys?
redis.call("ZREM", keyPartitionA, queueID)
redis.call("ZREM", keyPartitionB, queueID)
redis.call("ZREM", keyPartitionC, queueID)

if idempotencyTTL > 0 then
	redis.call("SETEX", keyIdempotency, idempotencyTTL, "")
end

-- This extends the item in the zset and also ensures that scavenger queues are
-- updated.
local function handleDequeue(keyConcurrency, keyPartitionSet, partitionID)
	redis.call("ZREM", keyConcurrency, item.id)

	-- Get the earliest item in the partition concurrency set.  We may be dequeueing
	-- the only in-progress job and should remove this from the partition concurrency
	-- pointers, if this exists.
	--
	-- This ensures that scavengeres have updated pointer queues without the currently
	-- leased job, if exists.
	local concurrencyScores = redis.call("ZRANGE", keyConcurrency, "-inf", "+inf", "BYSCORE", "LIMIT", 0, 1, "WITHSCORES")
	if concurrencyScores == false then
		redis.call("ZREM", concurrencyPointer, keyConcurrency)
		redis.call("ZREM", concurrencyPointer, legacyPartitionName) -- remove previous item
	else
		local earliestLease = tonumber(concurrencyScores[2])
		if earliestLease == nil then
			redis.call("ZREM", concurrencyPointer, keyConcurrency)
			redis.call("ZREM", concurrencyPointer, legacyPartitionName) -- remove previous item
		else
			-- Ensure that we update the score with the earliest lease
			redis.call("ZADD", concurrencyPointer, earliestLease, keyConcurrency)
			redis.call("ZREM", concurrencyPointer, legacyPartitionName) -- remove previous item
		end
	end

	-- For each partition, we now have an extra available capacity.  Check the partition's
	-- score, and ensure that it's updated in the global pointer index.
	--
	local minScores = redis.call("ZRANGE", keyPartitionSet, "-inf", "+inf", "BYSCORE", "LIMIT", 0, 1, "WITHSCORES")
	if minScores == nil or minScores == false or #minScores == 0 then
		return
	end

	-- If there's nothing int he partition set (no more jobs), end early, as we don't need to
	-- check partition scores.
	local currentScore = redis.call("ZSCORE", keyGlobalPointer, partitionID)
	if currentScore == nil or currentScore == false then
		return
	end

	local earliestScore = tonumber(minScores[2])/1000
	if tonumber(currentScore) > earliestScore then
		-- Update the global index now that there's capacity, even if we've forced, as we now
		-- have capacity.  Note the earliest score is in MS while partitions are stored in S.
		update_pointer_score_to(partitionID, keyGlobalPointer, earliestScore)
		update_account_queues(keyGlobalAccountPointer, keyAccountPartitions, partitionID, accountId, earliestScore)

		-- Clear the ForceAtMS from the pointer.
		local existing = get_partition_item(keyPartitionMap, partitionID)
		existing.forceAtMS = nil
		redis.call("HSET", keyPartitionMap, partitionID, cjson.encode(existing))
	end
end

handleDequeue(keyConcurrencyA, keyPartitionA, partitionIdA)
handleDequeue(keyConcurrencyB, keyPartitionB, partitionIdB)
handleDequeue(keyConcurrencyC, keyPartitionC, partitionIdC)

-- This does not have a scavenger queue, as it's purely an entitlement limitation. See extendLease
-- and Lease for respective ZADD calls.
redis.call("ZREM", keyAcctConcurrency, item.id)

-- Add optional indexes.
if keyItemIndexA ~= "" and keyItemIndexA ~= false and keyItemIndexA ~= nil then
	redis.call("ZREM", keyItemIndexA, queueID)
end
if keyItemIndexB ~= "" and keyItemIndexB ~= false and keyItemIndexB ~= nil then
	redis.call("ZREM", keyItemIndexB, queueID)
end

return 0
