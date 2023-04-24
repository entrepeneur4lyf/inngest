--[[

Output:
  0: Stored successfully
  1: Run ID already exists

]]

local idempotencyKey = KEYS[1]
local eventKey = KEYS[2]
local workflowKey = KEYS[3]
local metadataKey = KEYS[4]
local stepKey = KEYS[5]
local logKey = KEYS[6]

local event = ARGV[1]
local workflow = ARGV[2]
local metadata = ARGV[3]
local steps = ARGV[4]
local log = ARGV[5]
local logScore = tonumber(ARGV[6])

if redis.call("SETNX", idempotencyKey, "") == 0 then
  -- If this key exists, everything must've been initialised, so we can exit early
  return 1
end

redis.call("SETNX", workflowKey, workflow)

local metadataJson = cjson.decode(metadata)
for k, v in pairs(metadataJson) do
  if k == "ctx" or k == "id" then
	  v = cjson.encode(v)
  end
  redis.call("HSET", metadataKey, k, tostring(v))
end

if steps ~= nil and steps ~= "" then
  local stepsJson = cjson.decode(steps)

  for k, v in pairs(stepsJson) do
    redis.call("HSET", stepKey, k, cjson.encode(v))
  end
end

redis.call("SETNX", eventKey, event)
redis.call("ZADD", logKey, logScore, log)

return 0
