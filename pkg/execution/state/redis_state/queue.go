package redis_state

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"
	"sync"
	"time"
	"unsafe"

	"golang.org/x/sync/semaphore"

	"github.com/VividCortex/ewma"
	"github.com/cespare/xxhash/v2"
	"github.com/google/uuid"
	"github.com/hashicorp/go-multierror"
	"github.com/inngest/inngest/pkg/backoff"
	"github.com/inngest/inngest/pkg/consts"
	"github.com/inngest/inngest/pkg/enums"
	osqueue "github.com/inngest/inngest/pkg/execution/queue"
	"github.com/inngest/inngest/pkg/execution/state"
	"github.com/inngest/inngest/pkg/logger"
	"github.com/inngest/inngest/pkg/telemetry"
	"github.com/inngest/inngest/pkg/util"
	"github.com/oklog/ulid/v2"
	"github.com/redis/rueidis"
	"github.com/rs/zerolog"
	"gonum.org/v1/gonum/stat/sampleuv"
	"lukechampine.com/frand"
)

var (
	PartitionSelectionMax int64 = 100
	PartitionPeekMax      int64 = PartitionSelectionMax * 3
	AccountPeekMax        int64 = 25
)

const (
	pkgName = "redis_state.state.execution.inngest"

	// PartitionLeaseDuration dictates how long a worker holds the lease for
	// a partition.  This gives the worker a right to scan all queue items
	// for that partition to schedule the execution of jobs.
	//
	// Right now, this must be short enough to reduce contention but long enough
	// to account for the latency of peeking QueuePeekMax jobs from Redis.
	PartitionLeaseDuration = 4 * time.Second
	// PartitionRequeueExtension is the length of time that we extend a partition's
	// vesting time when requeueing by default.
	PartitionRequeueExtension = 30 * time.Second

	// PartitionConcurrencyLimitRequeueExtension is the length of time that a partition
	// is requeued if there is no global or partition(function) capacity because of
	// concurrency limits.
	//
	// This is short, as there are still functions that are due to run (ie vesting < now),
	// but long enough to reduce thrash.
	//
	// This means that jobs not started because of concurrency limits incur up to this amount
	// of additional latency.
	PartitionConcurrencyLimitRequeueExtension = 2 * time.Second
	PartitionLookahead                        = time.Second

	// default values
	QueuePeekMin            int64 = 300
	QueuePeekMax            int64 = 5000
	QueuePeekCurrMultiplier int64 = 4 // threshold 25%
	QueuePeekEWMALen        int   = 10
	QueueLeaseDuration            = 20 * time.Second
	ConfigLeaseDuration           = 10 * time.Second
	ConfigLeaseMax                = 20 * time.Second

	PriorityMax     uint = 0
	PriorityDefault uint = 5
	PriorityMin     uint = 9

	// FunctionStartScoreBufferTime is the grace period used to compare function start
	// times to edge enqueue times.
	FunctionStartScoreBufferTime = 10 * time.Second

	defaultNumWorkers     = 100
	defaultPollTick       = 10 * time.Millisecond
	defaultIdempotencyTTL = 12 * time.Hour
	defaultConcurrency    = 1000 // TODO: add function to override.

	NoConcurrencyLimit = -1
)

var (
	ErrQueueItemExists               = fmt.Errorf("queue item already exists")
	ErrQueueItemNotFound             = fmt.Errorf("queue item not found")
	ErrQueueItemAlreadyLeased        = fmt.Errorf("queue item already leased")
	ErrQueueItemLeaseMismatch        = fmt.Errorf("item lease does not match")
	ErrQueueItemNotLeased            = fmt.Errorf("queue item is not leased")
	ErrQueuePeekMaxExceedsLimits     = fmt.Errorf("peek exceeded the maximum limit of %d", QueuePeekMax)
	ErrPriorityTooLow                = fmt.Errorf("priority is too low")
	ErrPriorityTooHigh               = fmt.Errorf("priority is too high")
	ErrWeightedSampleRead            = fmt.Errorf("error reading from weighted sample")
	ErrPartitionNotFound             = fmt.Errorf("partition not found")
	ErrPartitionAlreadyLeased        = fmt.Errorf("partition already leased")
	ErrPartitionPeekMaxExceedsLimits = fmt.Errorf("peek exceeded the maximum limit of %d", PartitionPeekMax)
	ErrAccountPeekMaxExceedsLimits   = fmt.Errorf("account peek exceeded the maximum limit of %d", AccountPeekMax)
	ErrPartitionGarbageCollected     = fmt.Errorf("partition garbage collected")
	ErrPartitionPaused               = fmt.Errorf("partition is paused")
	ErrConfigAlreadyLeased           = fmt.Errorf("config scanner already leased")
	ErrConfigLeaseExceedsLimits      = fmt.Errorf("config lease duration exceeds the maximum of %d seconds", int(ConfigLeaseMax.Seconds()))
	ErrPartitionConcurrencyLimit     = fmt.Errorf("At partition concurrency limit")
	ErrAccountConcurrencyLimit       = fmt.Errorf("At account concurrency limit")

	// ErrConcurrencyLimitCustomKeyN represents a concurrency limit being hit for *some*, but *not all*
	// jobs in a queue, via custom concurrency keys which are evaluated to a specific string.

	ErrConcurrencyLimitCustomKey0 = fmt.Errorf("At concurrency limit 0")
	ErrConcurrencyLimitCustomKey1 = fmt.Errorf("At concurrency limit 1")

	// internal shard errors
	errShardNotFound     = fmt.Errorf("shard not found")
	errShardIndexLeased  = fmt.Errorf("shard index is already leased")
	errShardIndexInvalid = fmt.Errorf("shard lease index is too high (a lease just expired)")
)

var (
	rnd *frandRNG

	// now is a reference to time.Now and exists for overriding within
	// specific tests, allowing us to eg. test rate limiting with ease.
	getNow = time.Now
)

func init() {
	// For weighted shuffles generate a new rand.
	rnd = &frandRNG{RNG: frand.New(), lock: &sync.Mutex{}}
}

type QueueManager interface {
	osqueue.JobQueueReader
	osqueue.Queue

	Dequeue(ctx context.Context, p QueuePartition, i QueueItem) error
	Requeue(ctx context.Context, p QueuePartition, i QueueItem, at time.Time) error
	RequeueByJobID(ctx context.Context, partitionName string, jobID string, at time.Time) error
}

// PriorityFinder returns the priority for a given queue partition.
type PriorityFinder func(ctx context.Context, part QueuePartition) uint

// ShardFinder returns the given shard for a workspace ID, or nil if we should
// not shard for the workspace.  We use a workspace ID because each individual
// job AND partition/function lease requires this to be called.
//
// NOTE: This is called frequently:  for every enqueue, lease, partition lease, and so on.
// Expect this to be called tens of thousands of times per second.
type ShardFinder func(ctx context.Context, queueName string, workspaceID *uuid.UUID) *QueueShard

type QueueOpt func(q *queue)

func WithName(name string) func(q *queue) {
	return func(q *queue) {
		q.name = name
	}
}

func WithQueueLifecycles(l ...QueueLifecycleListener) QueueOpt {
	return func(q *queue) {
		q.lifecycles = l
	}
}

func WithPriorityFinder(pf PriorityFinder) QueueOpt {
	return func(q *queue) {
		q.pf = pf
	}
}

func WithShardFinder(sf ShardFinder) QueueOpt {
	return func(q *queue) {
		q.sf = sf
	}
}

func WithIdempotencyTTL(t time.Duration) QueueOpt {
	return func(q *queue) {
		q.idempotencyTTL = t
	}
}

// WithIdempotencyTTLFunc returns custom idempotecy durations given a QueueItem.
// This allows customization of the idempotency TTL based off of specific jobs.
func WithIdempotencyTTLFunc(f func(context.Context, QueueItem) time.Duration) QueueOpt {
	return func(q *queue) {
		q.idempotencyTTLFunc = f
	}
}

func WithNumWorkers(n int32) QueueOpt {
	return func(q *queue) {
		q.numWorkers = n
	}
}

func WithPeekSizeRange(min int64, max int64) QueueOpt {
	return func(q *queue) {
		q.peekMin = min
		q.peekMax = max
	}
}

func WithPeekConcurrencyMultiplier(m int64) QueueOpt {
	return func(q *queue) {
		q.peekCurrMultiplier = m
	}
}

func WithPeekEWMALength(l int) QueueOpt {
	return func(q *queue) {
		q.peekEWMALen = l
	}
}

// WithPollTick specifies the interval at which the queue will poll the backing store
// for available partitions.
func WithPollTick(t time.Duration) QueueOpt {
	return func(q *queue) {
		q.pollTick = t
	}
}

func WithQueueItemIndexer(i QueueItemIndexer) QueueOpt {
	return func(q *queue) {
		q.itemIndexer = i
	}
}

// WithAsyncInstrumentation registers all the async instrumentation that needs to happen on
// each instrumentation cycle
// These are mostly gauges for point in time metrics
func WithAsyncInstrumentation() QueueOpt {
	ctx := context.Background()

	return func(q *queue) {
		telemetry.GaugeWorkerQueueCapacity(ctx, telemetry.GaugeOpt{
			PkgName:  pkgName,
			Callback: func(ctx context.Context) (int64, error) { return int64(q.numWorkers), nil },
		})

		telemetry.GaugeGlobalQueuePartitionCount(ctx, telemetry.GaugeOpt{
			PkgName: pkgName,
			Callback: func(ctx context.Context) (int64, error) {
				dur := time.Hour * 24 * 365
				return q.partitionSize(ctx, q.u.kg.GlobalPartitionIndex(), getNow().Add(dur))
			},
		})

		telemetry.GaugeGlobalQueuePartitionAvailable(ctx, telemetry.GaugeOpt{
			PkgName: pkgName,
			Callback: func(ctx context.Context) (int64, error) {
				return q.partitionSize(ctx, q.u.kg.GlobalPartitionIndex(), getNow().Add(PartitionLookahead))
			},
		})

		// Shard instrumentations
		shards, err := q.getShards(ctx)
		if err != nil {
			q.logger.Error().Err(err).Msg("error retrieving shards")
		}

		telemetry.GaugeQueueShardCount(ctx, int64(len(shards)), telemetry.GaugeOpt{PkgName: pkgName})
		for _, shard := range shards {
			tags := map[string]any{"shard_name": shard.Name}

			telemetry.GaugeQueueShardGuaranteedCapacityCount(ctx, telemetry.GaugeOpt{
				PkgName:  pkgName,
				Tags:     tags,
				Callback: func(ctx context.Context) (int64, error) { return int64(shard.GuaranteedCapacity), nil },
			})
			telemetry.GaugeQueueShardLeaseCount(ctx, telemetry.GaugeOpt{
				PkgName:  pkgName,
				Tags:     tags,
				Callback: func(ctx context.Context) (int64, error) { return int64(len(shard.Leases)), nil },
			})
			telemetry.GaugeQueueShardPartitionAvailableCount(ctx, telemetry.GaugeOpt{
				PkgName: pkgName,
				Tags:    tags,
				Callback: func(ctx context.Context) (int64, error) {
					return q.partitionSize(ctx, q.u.kg.ShardPartitionIndex(shard.Name), getNow().Add(PartitionLookahead))
				},
			})
		}
	}
}

// WithDenyQueueNames specifies that the worker cannot select jobs from queue partitions
// within the given list of names.  This means that the worker will never work on jobs
// in the specified queues.
//
// NOTE: If this is set and this worker claims the sequential lease, there is no guarantee
// on latency or fairness in the denied queue partitions.
func WithDenyQueueNames(queues ...string) func(q *queue) {
	return func(q *queue) {
		q.denyQueues = queues
		q.denyQueueMap = make(map[string]*struct{})
		q.denyQueuePrefixes = make(map[string]*struct{})
		for _, i := range queues {
			q.denyQueueMap[i] = &struct{}{}
			// If WithDenyQueueNames includes "user:*", trim the asterisc and use
			// this as a prefix match.
			if strings.HasSuffix(i, "*") {
				q.denyQueuePrefixes[strings.TrimSuffix(i, "*")] = &struct{}{}
			}
		}
	}
}

// WithAllowQueueNames specifies that the worker can only select jobs from queue partitions
// within the given list of names.  This means that the worker will never work on jobs in
// other queues.
func WithAllowQueueNames(queues ...string) func(q *queue) {
	return func(q *queue) {
		q.allowQueues = queues
		q.allowQueueMap = make(map[string]*struct{})
		q.allowQueuePrefixes = make(map[string]*struct{})
		for _, i := range queues {
			q.allowQueueMap[i] = &struct{}{}
			// If WithAllowQueueNames includes "user:*", trim the asterisc and use
			// this as a prefix match.
			if strings.HasSuffix(i, "*") {
				q.allowQueuePrefixes[strings.TrimSuffix(i, "*")] = &struct{}{}
			}
		}
	}
}

// WithKindToQueueMapping maps queue.Item.Kind strings to queue names.  For example,
// when pushing a queue.Item with a kind of PayloadEdge, this job can be mapped to
// a specific queue name here.
//
// The mapping must be provided in terms of item kind to queue name.  If the item
// kind doesn't exist in the mapping the job's queue name will be left nil.  This
// means that the item will be placed in the workflow ID's queue.
func WithKindToQueueMapping(mapping map[string]string) func(q *queue) {
	// XXX: Refactor osqueue.Item and this package to resolve these interfaces
	// and clean up this function.
	return func(q *queue) {
		q.queueKindMapping = mapping
	}
}

func WithLogger(l *zerolog.Logger) func(q *queue) {
	return func(q *queue) {
		q.logger = l
	}
}

// WithCustomConcurrencyKeyGenerator assigns a function that returns concurrency keys
// for a given queue item, eg. a step in a function.
func WithCustomConcurrencyKeyGenerator(f QueueItemConcurrencyKeyGenerator) func(q *queue) {
	return func(q *queue) {
		q.customConcurrencyGen = f
	}
}

// WithConcurrencyLimitGetter assigns a function that returns concurrency limits
// for a given partition.
func WithConcurrencyLimitGetter(f ConcurrencyLimitGetter) func(q *queue) {
	return func(q *queue) {
		q.concurrencyLimitGetter = f
	}
}

func WithBackoffFunc(f backoff.BackoffFunc) func(q *queue) {
	return func(q *queue) {
		q.backoffFunc = f
	}
}

// QueueItemConcurrencyKeyGenerator returns concurrenc keys given a queue item to limits.
//
// Each queue item can have its own concurrency keys.  For example, you can define
// concurrency limits for steps within a function.  This ensures that there will never be
// more than N concurrent items running at once.
type QueueItemConcurrencyKeyGenerator func(ctx context.Context, i QueueItem) []state.CustomConcurrency

// ConcurrencyLimitGetter returns the fn, account, and custom limits for a given partition.
type ConcurrencyLimitGetter func(ctx context.Context, p QueuePartition) (fn, acct, custom int)

func NewQueue(u *QueueClient, opts ...QueueOpt) *queue {
	q := &queue{
		u: u,
		pf: func(_ context.Context, _ QueuePartition) uint {
			return PriorityDefault
		},
		numWorkers:         defaultNumWorkers,
		wg:                 &sync.WaitGroup{},
		seqLeaseLock:       &sync.RWMutex{},
		scavengerLeaseLock: &sync.RWMutex{},
		pollTick:           defaultPollTick,
		idempotencyTTL:     defaultIdempotencyTTL,
		queueKindMapping:   make(map[string]string),
		logger:             logger.From(context.Background()),
		concurrencyLimitGetter: func(ctx context.Context, p QueuePartition) (fn, account, custom int) {
			def := defaultConcurrency
			if p.ConcurrencyLimit >= 0 {
				def = p.ConcurrencyLimit
			}
			// Use the defaults.
			fn, account, custom = def, def, def

			if p.FunctionID == nil {
				// There's no fn ID, so return -1 indicating that there are no account
				// concurrency limits for this partition.
				fn = NoConcurrencyLimit
			}
			if p.AccountID == nil {
				// There's no account ID, so return -1 indicating that there are no account
				// concurrency limits for this partition.
				account = NoConcurrencyLimit
			}
			if p.ConcurrencyKey == "" {
				custom = NoConcurrencyLimit
			}
			return fn, account, -1
		},
		customConcurrencyGen: func(ctx context.Context, item QueueItem) []state.CustomConcurrency {
			// Use whatever's in the queue item by default
			return item.Data.GetConcurrencyKeys()
		},
		itemIndexer:    QueueItemIndexerFunc,
		backoffFunc:    backoff.DefaultBackoff,
		shardLeases:    []leasedShard{},
		shardLeaseLock: &sync.Mutex{},
	}

	for _, opt := range opts {
		opt(q)
	}

	q.sem = &trackingSemaphore{Weighted: semaphore.NewWeighted(int64(q.numWorkers))}
	q.workers = make(chan processItem, q.numWorkers)

	return q
}

type queue struct {
	// name is the identifiable name for this worker, for logging.
	name string

	// redis stores the redis connection to use.
	u  *QueueClient
	pf PriorityFinder
	sf ShardFinder

	lifecycles []QueueLifecycleListener

	concurrencyLimitGetter ConcurrencyLimitGetter
	customConcurrencyGen   QueueItemConcurrencyKeyGenerator

	// idempotencyTTL is the default or static idempotency duration apply to jobs,
	// if idempotencyTTLFunc is not defined.
	idempotencyTTL time.Duration
	// idempotencyTTLFunc returns an time.Duration representing how long job IDs
	// remain idempotent.
	idempotencyTTLFunc func(context.Context, QueueItem) time.Duration
	// pollTick is the interval between each scan for jobs.
	pollTick time.Duration
	// quit is a channel that any method can send on to trigger termination
	// of the Run loop.  This typically accepts an error, but a nil error
	// will still quit the runner.
	quit chan error
	// wg stores a waitgroup for all in-progress jobs
	wg *sync.WaitGroup
	// numWorkers stores the number of workers available to concurrently process jobs.
	numWorkers int32
	// peek min & max sets the range for partitions to peek for items
	peekMin int64
	peekMax int64
	// peekCurrMultiplier is a multiplier used for calculating the dynamic peek size
	// based on the EWMA values
	peekCurrMultiplier int64
	// peekEWMALen is the size of the list to hold the most recent values
	peekEWMALen int
	// workers is a buffered channel which allows scanners to send queue items
	// to workers to be processed
	workers chan processItem
	// sem stores a semaphore controlling the number of jobs currently
	// being processed.  This lets us check whether there's capacity in the queue
	// prior to leasing items.
	sem *trackingSemaphore
	// queueKindMapping stores a map of job kind => queue names
	queueKindMapping map[string]string
	logger           *zerolog.Logger

	// itemIndexer returns indexes for a given queue item.
	itemIndexer QueueItemIndexer

	// denyQueues provides a denylist ensuring that the queue will never claim
	// this partition, meaning that no jobs from this queue will run on this worker.
	denyQueues        []string
	denyQueueMap      map[string]*struct{}
	denyQueuePrefixes map[string]*struct{}

	// allowQueues provides an allowlist, ensuring that the queue only peeks the specified
	// partitions.  jobs from other partitions will never be scanned or processed.
	allowQueues   []string
	allowQueueMap map[string]*struct{}
	// allowQueuePrefixes are memoized prefixes that can be allowed.
	allowQueuePrefixes map[string]*struct{}

	// seqLeaseID stores the lease ID if this queue is the sequential processor.
	// all runners attempt to claim this lease automatically.
	seqLeaseID *ulid.ULID
	// seqLeaseLock ensures that there are no data races writing to
	// or reading from seqLeaseID in parallel.
	seqLeaseLock *sync.RWMutex

	// scavengerLeaseID stores the lease ID if this queue is the scavenger processor.
	// all runners attempt to claim this lease automatically.
	scavengerLeaseID *ulid.ULID
	// scavengerLeaseLock ensures that there are no data races writing to
	// or reading from scavengerLeaseID in parallel.
	scavengerLeaseLock *sync.RWMutex

	// shardLeases represents shards that are leased by the current queue worker.
	shardLeases    []leasedShard
	shardLeaseLock *sync.Mutex

	runMode queueRunMode

	// backoffFunc is the backoff function to use when retrying operations.
	backoffFunc backoff.BackoffFunc
}

type queueRunMode struct {
	// sequential determines whether Run() instance acquires sequential lease and processes items sequentially if lease is granted
	sequential bool

	// scavenger determines whether scavenger lease is acquired and scavenger is processed if lease is granted
	scavenger bool

	// partitionRatio sets the integer ratio (between 1-100) of partitions to process
	partitionRatio int

	// accountRatio sets the integer ratio (between 1-100) of accounts to process
	accountRatio int
}

// processItem references the queue partition and queue item to be processed by a worker.
// both items need to be passed to a worker as both items are needed to generate concurrency
// keys to extend leases and dequeue.
type processItem struct {
	P QueuePartition
	I QueueItem
	S *QueueShard
}

// QueueShard represents a sub-partition for a group of functions.  Shards maintain their
// own partition queues for the functions within the shard.  Note that functions also
// exist within the global partition queue.
type QueueShard struct {
	// Shard name, eg. the company name for isolated execution
	Name string `json:"n"`
	// Priority represents the priority for this shard.
	Priority uint `json:"p"`
	// GuaranteedCapacity represents the minimum number of workers that must
	// always scan this shard.  If zero, there is no guaranteed capacity for
	// the shard.
	GuaranteedCapacity uint `json:"gc"`
	// Leases stores the lease IDs from the workers which are currently leasing the
	// shard.  The workers currently leasing the shard are almost guaranteed to use
	// the shard's partition queue as their source of work.
	Leases []ulid.ULID `json:"leases"`
}

// leasedShard represents a shard leased by a queue.
type leasedShard struct {
	Shard QueueShard
	Lease ulid.ULID
}

// Partition returns the partition name for use when managing the pointer queue to
// individual queues within the shard
func (q QueueShard) Partition() string {
	return q.Name
}

// FnMetadata is stored within the queue for retrieving
type FnMetadata struct {
	// NOTE: This is not encoded via JSON as we should always have the function
	// ID prior to doing a lookup, or should be able to retrieve the function ID
	// via the key.
	FnID uuid.UUID `json:"fnID"`

	// Paused represents whether the fn is paused.  This allows us to prevent leases
	// to a given partition if the partition belongs to a fn.
	Paused bool `json:"off"`
}

// QueuePartition represents an individual queue for a workflow.  It stores the
// time of the earliest job within the workflow.
type QueuePartition struct {
	// ID represents the key used within the global Partition hash and global pointer set
	// which represents this QueuePartition.  This is the function ID for enums.PartitionTypeDefault,
	// or the entire key returned from the key generator for other types.
	ID string `json:"id,omitempty"`
	// PartitionType is the int-value of the enums.PartitionType for this
	// partition.  By default, partitions are function-scoped without any
	// custom keys.
	PartitionType int `json:"pt,omitempty"`
	// ConcurrencyScope is the int-value representation of the enums.ConcurrencyScope,
	// if this is a concurrency-scoped partition.
	ConcurrencyScope int `json:"cs,omitempty"`
	// FunctionID represents the function ID that this partition manages.
	// NOTE:  If this partition represents many fns (eg. acct or env), this may be nil
	FunctionID *uuid.UUID `json:"wid,omitempty"`
	// AccountID represents the account ID for the partition
	AccountID *uuid.UUID `json:"aID,omitempty"`
	// EnvID represents the environment ID for the partition, either from the
	// function ID or the environment scope itself.
	EnvID *uuid.UUID `json:"wsID,omitempty"`
	// LeaseID represents a lease on this partition.  If the LeaseID is not nil,
	// this partition can be claimed by a shared-nothing worker to work on the
	// queue items within this partition.
	//
	// A lease is shortly held (eg seconds).  It should last long enough for
	// workers to claim QueueItems only.
	LeaseID *ulid.ULID `json:"leaseID,omitempty"`
	// Last represents the time that this partition was last leased, as a millisecond
	// unix epoch.  In essence, we need this to track how frequently we're leasing and
	// attempting to run items in the partition's queue.
	// Without this, we cannot track sojourn latency.
	Last int64 `json:"last"`
	// ForcedAtMS records the time that the partition is forced to, in milliseconds, if
	// the partition has been forced into the future via concurrency issues. This means
	// that it was requeued due to concurrency issues and should not be brought forward
	// when a new step is enqueued, if now < ForcedAtMS.
	ForceAtMS int64 `json:"forceAtMS"`

	//
	// Concurrency
	//

	// ConcurrencyLimit represents the max concurrency for the queue partition.  This allows
	// us to optimize the queue by checking for the max when leasing partitions
	// directly.
	ConcurrencyLimit int `json:"l,omitempty"`
	// ConcurrencyKey represents the hashed custom key for the queue partition, if this is
	// for a custom key.
	ConcurrencyKey string `json:"ck,omitempty"`
	// LimitOwner represents the function ID that set the max concurrency limit for
	// this function.  This allows us to lower the max if the owner/enqueueing function
	// ID matches - otherwise, once set, the max can never lower.
	LimitOnwer *uuid.UUID `json:"lID,omitempty"`

	// TODO: Throttling;  embed max limit/period/etc?
}

// zsetKey represents the key used to store the zset for this partition's items
// for default partitions, this is different to the ID (for backwards compatibility, it's just
// the fn ID without prefixes)
func (q QueuePartition) zsetKey(kg QueueKeyGenerator) string {
	if q.PartitionType == 0 && q.FunctionID != nil {
		// return the top-level function queue.
		return kg.PartitionQueueSet(enums.PartitionTypeDefault, q.FunctionID.String(), "")
	}
	if q.ID == "" {
		// return a blank queue key.  This is used for nil queue partitions.
		return kg.PartitionQueueSet(enums.PartitionTypeDefault, "-", "")
	}
	return q.ID
}

// fnConcurrencyKey returns the concurrency key for a function scope limit, on the
// entire function (not custom keys)
func (q QueuePartition) fnConcurrencyKey(kg QueueKeyGenerator) string {
	if q.FunctionID == nil {
		return kg.Concurrency("p", "-")
	}
	return kg.Concurrency("p", q.FunctionID.String())
}

// acctConcurrencyKey returns the concurrency key for the account limit, on the
// entire account (not custom keys)
func (q QueuePartition) acctConcurrencyKey(kg QueueKeyGenerator) string {
	if q.AccountID == nil {
		return kg.Concurrency("account", "-")
	}
	return kg.Concurrency("account", q.AccountID.String())
}

func (q QueuePartition) Queue() string {
	// TODO: Check this
	return q.ID
}

func (q QueuePartition) MarshalBinary() ([]byte, error) {
	return json.Marshal(q)
}

// QueueItem represents an individually queued work scheduled for some time in the
// future.
type QueueItem struct {
	// ID represents a unique identifier for the queue item.  This can be any
	// unique string and will be hashed.  Using the same ID provides idempotency
	// guarantees within the queue's IdempotencyTTL.
	ID string `json:"id"`
	// EarliestPeekTime stores the earliest time that the job was peeked as a
	// millisecond epoch timestamp.
	//
	// This lets us easily track sojourn latency.
	EarliestPeekTime int64 `json:"pt,omitempty"`
	// AtMS represents the score for the queue item - usually, the current time
	// that this QueueItem needs to be executed at, as a millisecond epoch.
	//
	// Note that due to priority factors and function FIFO manipulation, if we're
	// scheduling a job to run at `Now()` AtMS may be a time in the past to bump
	// the item in the queue.
	//
	// This is necessary for rescoring partitions and checking latencies.
	AtMS int64 `json:"at"`

	// WallTimeMS represents the actual wall time in which the job should run, used to
	// check latencies.  This is NOT used for scoring or ordering and is for internal
	// accounting only.
	//
	// This is set when enqueueing or requeueing a job.
	WallTimeMS int64 `json:"wt"`

	// FunctionID is the workflow ID that this job belongs to.
	FunctionID uuid.UUID `json:"wfID"`
	// WorkspaceID is the workspace that this job belongs to.
	WorkspaceID uuid.UUID `json:"wsID"`
	// LeaseID is a ULID which embeds a timestamp denoting when the lease expires.
	LeaseID *ulid.ULID `json:"leaseID,omitempty"`
	// Data represents the enqueued data, eg. the edge to process or the pause
	// to resume.
	Data osqueue.Item `json:"data"`
	// QueueName allows placing this job into a specific queue name.  If the QueueName
	// is nil, the FunctionID will be used as the queue name.  This allows us to
	// automatically create partitioned queues for each function within Inngest.
	//
	// This should almost always be nil.
	QueueName *string `json:"queueID,omitempty"`
	// IdempotencyPerioud allows customizing the idempotency period for this queue
	// item.  For example, after a debounce queue has been consumed we want to remove
	// the idempotency key immediately;  the same debounce key should become available
	// for another debounced function run.
	IdempotencyPeriod *time.Duration `json:"ip,omitempty"`
}

func (q *QueueItem) SetID(ctx context.Context, str string) {
	q.ID = HashID(ctx, str)
}

// Score returns the score (time that the item should run) for the queue item.
//
// NOTE: In order to prioritize finishing older function runs with a busy function
// queue, we sometimes use the function run's "started at" time to enqueue edges which
// run steps.  This lets us push older function steps to the beginning of the queue,
// ensuring they run before other newer function runs.
//
// We can ONLY do this for the first attempt, and we can ONLY do this for edges that
// are not sleeps (eg. immediate runs)
func (q QueueItem) Score() int64 {
	// If this is not a start/simple edge/edge error, we can ignore this.
	if (q.Data.Kind != osqueue.KindStart &&
		q.Data.Kind != osqueue.KindEdge &&
		q.Data.Kind != osqueue.KindEdgeError) || q.Data.Attempt > 0 {
		return q.AtMS
	}

	// If this is > 2 seconds in the future, don't mess with the time.
	// This prevents any accidental fudging of future run times, even if the
	// kind is edge (which should never exist... but, better to be safe).
	if q.AtMS > getNow().Add(consts.FutureAtLimit).UnixMilli() {
		return q.AtMS
	}

	// Only fudge the numbers if the run is older than the buffer time.
	startAt := int64(q.Data.Identifier.RunID.Time())
	if q.AtMS-startAt > FunctionStartScoreBufferTime.Milliseconds() {
		// Remove the PriorityFactor from the time to push higher priority work
		// earlier.
		return startAt - q.Data.GetPriorityFactor()
	}

	return startAt - q.Data.GetPriorityFactor()
}

func (q QueueItem) MarshalBinary() ([]byte, error) {
	return json.Marshal(q)
}

// Queue returns the queue name for this queue item.  This is the
// workflow ID of the QueueItem unless the QueueName is specifically
// set.
func (q QueueItem) Queue() string {
	if q.QueueName == nil {
		return q.FunctionID.String()
	}
	return *q.QueueName
}

// IsLeased checks if the QueueItem is currently already leased or not
// based on the time passed in.
func (q QueueItem) IsLeased(time time.Time) bool {
	return q.LeaseID != nil && ulid.Time(q.LeaseID.Time()).After(time)
}

// ItemPartitions returns up 3 item partitions for a given queue item.
func (q *queue) ItemPartitions(ctx context.Context, i QueueItem) []QueuePartition {
	var (
		partitions []QueuePartition
		ckeys      = i.Data.GetConcurrencyKeys()
	)

	// Check if we have custom concurrency keys for the given function.  If so,
	// we're going to create new partitions for each of the custom keys.  This allows
	// us to create queues of queues for each concurrency key.
	//
	// See the 'key queues' spec for more information (internally).
	if q.customConcurrencyGen != nil {
		ckeys = q.customConcurrencyGen(ctx, i)
	}

	// Right now queue items *always* add into a partition for the overall function ID.
	// In the future this will change.
	if len(ckeys) == 0 {
		partitions = append(partitions, QueuePartition{
			ID:         i.FunctionID.String(),
			FunctionID: &i.FunctionID,
			AccountID:  &i.Data.Identifier.AccountID,
		})
	} else {
		for _, key := range ckeys {
			scope, id, checksum, _ := key.ParseKey()

			partition := QueuePartition{
				ID:               q.u.kg.PartitionQueueSet(enums.PartitionTypeConcurrencyKey, id.String(), checksum),
				PartitionType:    int(enums.PartitionTypeConcurrencyKey),
				ConcurrencyScope: int(scope),
				FunctionID:       &i.FunctionID,
				AccountID:        &i.Data.Identifier.AccountID,
			}

			switch scope {
			case enums.ConcurrencyScopeFn:
				partition.FunctionID = &i.FunctionID
			case enums.ConcurrencyScopeEnv:
				partition.EnvID = &i.WorkspaceID
			case enums.ConcurrencyScopeAccount:
				// AccountID comes from the concurrency key in this case
				partition.AccountID = &id
			}

			partitions = append(partitions, partition)
		}
	}

	// TODO: check for throttle keys

	for i := len(partitions) - 1; i < 3; i++ {
		// Pad to 3 partitions, and add empty partitions to the item.
		// We MUST ignore empty partitions when managing queues.
		partitions = append(partitions, QueuePartition{})
	}

	return partitions
}

func (q *queue) RunJobs(ctx context.Context, workspaceID, workflowID uuid.UUID, runID ulid.ULID, limit, offset int64) ([]osqueue.JobResponse, error) {
	if limit > 10 || limit <= 0 {
		limit = 10
	}

	cmd := q.u.unshardedRc.B().Zscan().Key(q.u.kg.RunIndex(runID)).Cursor(uint64(offset)).Count(limit).Build()
	jobIDs, err := q.u.unshardedRc.Do(ctx, cmd).AsScanEntry()
	if err != nil {
		return nil, fmt.Errorf("error reading index: %w", err)
	}

	if len(jobIDs.Elements) == 0 {
		return []osqueue.JobResponse{}, nil
	}

	// Get all job items.
	jsonItems, err := q.u.unshardedRc.Do(ctx, q.u.unshardedRc.B().Hmget().Key(q.u.kg.QueueItem()).Field(jobIDs.Elements...).Build()).AsStrSlice()
	if err != nil {
		return nil, fmt.Errorf("error reading jobs: %w", err)
	}

	resp := []osqueue.JobResponse{}
	for _, str := range jsonItems {
		if len(str) == 0 {
			continue
		}
		qi := &QueueItem{}

		if err := json.Unmarshal([]byte(str), qi); err != nil {
			return nil, fmt.Errorf("error unmarshalling queue item: %w", err)
		}
		if qi.Data.Identifier.WorkspaceID != workspaceID {
			continue
		}
		cmd := q.u.unshardedRc.B().Zrank().Key(q.u.kg.FnQueueSet(workflowID.String())).Member(qi.ID).Build()
		pos, err := q.u.unshardedRc.Do(ctx, cmd).AsInt64()
		if !rueidis.IsRedisNil(err) && err != nil {
			return nil, fmt.Errorf("error reading queue position: %w", err)
		}
		resp = append(resp, osqueue.JobResponse{
			At:       time.UnixMilli(qi.AtMS),
			Position: pos,
			Kind:     qi.Data.Kind,
			Attempt:  qi.Data.Attempt,
		})
	}

	return resp, nil
}

func (q *queue) OutstandingJobCount(ctx context.Context, workspaceID, workflowID uuid.UUID, runID ulid.ULID) (int, error) {
	cmd := q.u.unshardedRc.B().Zcard().Key(q.u.kg.RunIndex(runID)).Build()
	count, err := q.u.unshardedRc.Do(ctx, cmd).AsInt64()
	if err != nil {
		return 0, fmt.Errorf("error counting index cardinality: %w", err)
	}
	return int(count), nil
}

func (q *queue) StatusCount(ctx context.Context, workflowID uuid.UUID, status string) (int64, error) {
	key := q.u.kg.Status(status, workflowID)
	cmd := q.u.unshardedRc.B().Zcount().Key(key).Min("-inf").Max("+inf").Build()
	count, err := q.u.unshardedRc.Do(ctx, cmd).AsInt64()
	if err != nil {
		return 0, fmt.Errorf("error inspecting function queue status: %w", err)
	}
	return count, nil
}

func (q *queue) RunningCount(ctx context.Context, workflowID uuid.UUID) (int64, error) {
	// Load the partition for a given queue.  This allows us to generate the concurrency
	// key properly via the given function.
	//
	// TODO: Remove the ability to change keys based off of initialized inputs.  It's more trouble than
	// it's worth, and ends up meaning we have more queries to write (such as this) in order to load
	// relevant data.
	cmd := q.u.unshardedRc.B().Hget().Key(q.u.kg.PartitionItem()).Field(workflowID.String()).Build()
	enc, err := q.u.unshardedRc.Do(ctx, cmd).AsBytes()
	if rueidis.IsRedisNil(err) {
		return 0, nil
	}
	if err != nil {
		return 0, fmt.Errorf("error fetching partition: %w", err)
	}
	item := &QueuePartition{}
	if err = json.Unmarshal(enc, item); err != nil {
		return 0, fmt.Errorf("error reading partition item: %w", err)
	}

	// Fetch the concurrency via the partition concurrency name.
	key := q.u.kg.Concurrency("p", workflowID.String())
	cmd = q.u.unshardedRc.B().Zcard().Key(key).Build()
	count, err := q.u.unshardedRc.Do(ctx, cmd).AsInt64()
	if err != nil {
		return 0, fmt.Errorf("error inspecting running job count: %w", err)
	}
	return count, nil
}

// SetFunctionPaused sets the "Paused" flag (represented in JSON as "off") for the given
// function ID's queue partition.
func (q *queue) SetFunctionPaused(ctx context.Context, fnID uuid.UUID, paused bool) error {
	pausedArg := "0"
	if paused {
		pausedArg = "1"
	}

	// This is written to the store if fn metadata doesn't exist.
	defaultFnMetadata := FnMetadata{
		FnID:   fnID,
		Paused: true,
	}

	keys := []string{q.u.kg.FnMetadata(fnID)}
	args, err := StrSlice([]any{
		pausedArg,
		defaultFnMetadata,
	})
	if err != nil {
		return err
	}

	status, err := scripts["queue/fnSetPaused"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error updating paused state: %w", err)
	}
	switch status {
	case 0:
		return nil
	default:
		return fmt.Errorf("unknown response updating paused state: %d", status)
	}
}

// EnqueueItem enqueues a QueueItem.  It creates a QueuePartition for the workspace
// if a partition does not exist.
//
// The QueueItem's ID can be a zero UUID;  if the ID is a zero value a new ID
// will be created for the queue item.
//
// The queue score must be added in milliseconds to process sub-second items in order.
func (q *queue) EnqueueItem(ctx context.Context, i QueueItem, at time.Time) (QueueItem, error) {
	if len(i.ID) == 0 {
		i.SetID(ctx, ulid.MustNew(ulid.Now(), rnd).String())
	} else {
		i.ID = HashID(ctx, i.ID)
	}

	// XXX: If the length of ID >= max, error.

	if i.WallTimeMS == 0 {
		i.WallTimeMS = at.UnixMilli()
	}

	if at.Before(getNow()) {
		// Normalize to now to minimize latency.
		i.WallTimeMS = getNow().UnixMilli()
	}

	// Add the At timestamp, if not included.
	if i.AtMS == 0 {
		i.AtMS = at.UnixMilli()
	}

	if i.Data.JobID == nil {
		i.Data.JobID = &i.ID
	}

	partitionTime := at
	if at.Before(getNow()) {
		// We don't want to enqueue partitions (pointers to fns) before now.
		// Doing so allows users to stay at the front of the queue for
		// leases.
		partitionTime = getNow()
	}

	var (
		shard     *QueueShard
		shardName string
	)
	if q.sf != nil {
		shard = q.sf(ctx, i.Queue(), &i.WorkspaceID)
		if shard != nil {
			shardName = shard.Name
			shard.Leases = []ulid.ULID{}
		}
	}

	parts := q.ItemPartitions(ctx, i)

	keys := []string{
		q.u.kg.QueueItem(),                                        // Queue item
		q.u.kg.PartitionItem(),                                    // Partition item, map
		q.u.kg.GlobalPartitionIndex(),                             // Global partition queue
		q.u.kg.GlobalAccountIndex(),                               // Global account queue
		q.u.kg.AccountPartitionIndex(i.Data.Identifier.AccountID), // Account partition queue
		q.u.kg.ShardPartitionIndex(shardName),                     // Shard queue
		q.u.kg.Shards(),
		q.u.kg.Idempotency(i.ID),
		q.u.kg.FnMetadata(i.FunctionID),

		// Add all 3 partition sets
		parts[0].zsetKey(q.u.kg),
		parts[1].zsetKey(q.u.kg),
		parts[2].zsetKey(q.u.kg),
	}
	// Append indexes
	for _, idx := range q.itemIndexer(ctx, i, q.u.kg) {
		if idx != "" {
			keys = append(keys, idx)
		}
	}

	args, err := StrSlice([]any{
		i,
		i.ID,
		at.UnixMilli(),
		partitionTime.Unix(),
		shard,
		shardName,
		getNow().UnixMilli(),
		FnMetadata{
			// enqueue.lua only writes function metadata if it doesn't already exist.
			// if it doesn't exist, and we're enqueuing something, this implies the fn is not currently paused.
			FnID:   i.FunctionID,
			Paused: false,
		},
		parts[0],
		parts[1],
		parts[2],

		parts[0].ID,
		parts[1].ID,
		parts[2].ID,

		i.Data.Identifier.AccountID,
	})

	if err != nil {
		return i, err
	}
	status, err := scripts["queue/enqueue"].Exec(
		ctx,
		q.u.Client(),
		keys,
		args,
	).AsInt64()
	if err != nil {
		return i, fmt.Errorf("error enqueueing item: %w", err)
	}
	switch status {
	case 0:
		return i, nil
	case 1:
		return i, ErrQueueItemExists
	default:
		return i, fmt.Errorf("unknown response enqueueing item: %v (%T)", status, status)
	}
}

// Peek takes n items from a queue, up until QueuePeekMax.  For peeking workflow/
// function jobs the queue name must be the ID of the workflow;  each workflow has
// its own queue of jobs using its ID as the queue name.
//
// If limit is -1, this will return the first unleased item - representing the next available item in the
// queue.
func (q *queue) Peek(ctx context.Context, queueName string, until time.Time, limit int64) ([]*QueueItem, error) {
	// Check whether limit is -1, peeking next available time
	isPeekNext := limit == -1

	if limit > QueuePeekMax {
		// Lua's max unpack() length is 8000; don't allow users to peek more than
		// 1k at a time regardless.
		return nil, ErrQueuePeekMaxExceedsLimits
	}
	if limit <= 0 {
		limit = QueuePeekMax
	}
	if isPeekNext {
		limit = 1
	}

	args, err := StrSlice([]any{
		until.UnixMilli(),
		limit,
	})
	if err != nil {
		return nil, err
	}
	res, err := scripts["queue/peek"].Exec(
		ctx,
		q.u.unshardedRc,
		[]string{
			q.u.kg.FnQueueSet(queueName),
			q.u.kg.QueueItem(),
		},
		args,
	).ToAny()
	if err != nil {
		return nil, fmt.Errorf("error peeking queue items: %w", err)
	}
	items, ok := res.([]any)
	if !ok {
		return nil, nil
	}
	if len(items) == 0 {
		return nil, nil
	}

	if isPeekNext {
		i, err := q.decodeQueueItemFromPeek(items[0].(string), getNow())
		if err != nil {
			return nil, err
		}
		return []*QueueItem{i}, nil
	}

	now := getNow()
	return util.ParallelDecode(items, func(val any) (*QueueItem, error) {
		str, _ := val.(string)
		return q.decodeQueueItemFromPeek(str, now)
	})
}

func (q *queue) decodeQueueItemFromPeek(str string, now time.Time) (*QueueItem, error) {
	qi := &QueueItem{}
	if err := json.Unmarshal(unsafe.Slice(unsafe.StringData(str), len(str)), qi); err != nil {
		return nil, fmt.Errorf("error unmarshalling peeked queue item: %w", err)
	}
	if qi.IsLeased(now) {
		// Leased item, don't return.
		return nil, nil
	}
	// The nested osqueue.Item never has an ID set;  always re-set it
	qi.Data.JobID = &qi.ID
	return qi, nil
}

// RequeueByJobID requeues a job for a specific time given a partition name and job ID.
//
// If the queue item referenced by the job ID is not outstanding (ie. it has a lease, is in
// progress, or doesn't exist) this returns an error.
func (q *queue) RequeueByJobID(ctx context.Context, partitionName string, jobID string, at time.Time) error {
	jobID = HashID(ctx, jobID)

	// Find the queue item so that we can fetch the shard info.
	qi := &QueueItem{}
	if err := q.u.unshardedRc.Do(ctx, q.u.unshardedRc.B().Hget().Key(q.u.kg.QueueItem()).Field(jobID).Build()).DecodeJSON(qi); err != nil {
		return err
	}

	var shardName string
	if q.sf != nil {
		if shard := q.sf(ctx, qi.Queue(), &qi.WorkspaceID); shard != nil {
			shardName = shard.Name
		}
	}

	keys := []string{
		q.u.kg.FnQueueSet(partitionName),
		q.u.kg.QueueItem(),
		q.u.kg.GlobalPartitionIndex(),                              // Global partition queue
		q.u.kg.GlobalAccountIndex(),                                // Global account queue
		q.u.kg.AccountPartitionIndex(qi.Data.Identifier.AccountID), // Account partition queue
		q.u.kg.ShardPartitionIndex(shardName),                      // Shard partition queue
		q.u.kg.PartitionItem(),                                     // Partition hash
	}
	status, err := scripts["queue/requeueByID"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		[]string{
			jobID,
			strconv.Itoa(int(at.UnixMilli())),
			partitionName,
			strconv.Itoa(int(getNow().UnixMilli())),
			qi.Data.Identifier.AccountID.String(),
		},
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error requeueing item: %w", err)
	}
	switch status {
	case 0:
		return nil
	case -1:
		return ErrQueueItemNotFound
	case -2:
		return ErrQueueItemAlreadyLeased
	default:
		return fmt.Errorf("unknown requeue by id response: %d", status)
	}

}

// Lease temporarily dequeues an item from the queue by obtaining a lease, preventing
// other workers from working on this queue item at the same time.
//
// Obtaining a lease updates the vesting time for the queue item until now() +
// lease duration. This returns the newly acquired lease ID on success.
func (q *queue) Lease(ctx context.Context, p QueuePartition, item QueueItem, duration time.Duration, now time.Time, denies *leaseDenies) (*ulid.ULID, error) {
	if item.Data.Throttle != nil && denies != nil && denies.denyThrottle(item.Data.Throttle.Key) {
		return nil, ErrQueueItemThrottled
	}
	// Check to see if this key has already been denied in the lease iteration.
	// If so, fail early.
	if denies != nil && denies.denyConcurrency(item.FunctionID.String()) {
		// Note that we do not need to wrap the key as the key is already present.
		return nil, ErrPartitionConcurrencyLimit
	}
	if denies != nil && denies.denyConcurrency(item.Data.Identifier.AccountID.String()) {
		return nil, ErrAccountConcurrencyLimit
	}

	var (
		ac, pc int // account, partiiton concurrency max

		customKeys   = make([]string, 2)
		customLimits = make([]int, 2)
	)

	// Required.
	//
	// This should be found by calling function.ConcurrencyLimit() to return
	// the lowest concurrency limit available.  It limits the capacity of all
	// runs for the given function.
	//
	// NOTE: Each function can have up to 2 custom concurrency keys with different
	//       limits specified.  This means that a queue item may be in two separate
	//       partitions;  we cannot rely on JUST the partition's custom limit and must
	//       fetch the custom concurrnecy info from the queue item directly.
	//       Because
	ac, pc, _ = q.concurrencyLimitGetter(ctx, p)
	// Get the custom concurrency key, if available.
	for i, item := range q.customConcurrencyGen(ctx, item) {
		if i >= 2 {
			// We only support two concurrency keys right now.
			break
		}

		// Check to see if this key has already been denied in the lease iteration.
		// If so, fail early.
		if denies != nil && denies.denyConcurrency(item.Key) {
			if i == 0 {
				return nil, ErrConcurrencyLimitCustomKey0
			}
			return nil, ErrConcurrencyLimitCustomKey1
		}

		customKeys[i] = item.Key
		customLimits[i] = item.Limit
	}

	leaseID, err := ulid.New(ulid.Timestamp(getNow().Add(duration).UTC()), rnd)
	if err != nil {
		return nil, fmt.Errorf("error generating id: %w", err)
	}

	var shardName string
	if q.sf != nil {
		if shard := q.sf(ctx, item.Queue(), &item.WorkspaceID); shard != nil {
			shardName = shard.Name
		}
	}

	keys := []string{
		q.u.kg.QueueItem(),
		q.u.kg.FnQueueSet(item.Queue()),
		q.u.kg.PartitionMeta(item.Queue()),
		q.u.kg.Concurrency("account", item.Data.Identifier.AccountID.String()),
		q.u.kg.Concurrency("p", item.FunctionID.String()),
		q.u.kg.Concurrency("custom", customKeys[0]),
		q.u.kg.Concurrency("custom", customKeys[1]),
		q.u.kg.ConcurrencyIndex(),
		q.u.kg.GlobalPartitionIndex(),
		q.u.kg.GlobalAccountIndex(),
		q.u.kg.AccountPartitionIndex(item.Data.Identifier.AccountID),
		q.u.kg.ShardPartitionIndex(shardName),
		q.u.kg.ThrottleKey(item.Data.Throttle),
	}
	args, err := StrSlice([]any{
		item.ID,
		leaseID.String(),
		now.UnixMilli(),
		ac,
		pc,
		customLimits[0],
		customLimits[1],
		p.Queue(),
		item.Data.Identifier.AccountID,
	})
	if err != nil {
		return nil, err
	}
	status, err := scripts["queue/lease"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).ToInt64()
	if err != nil {
		return nil, fmt.Errorf("error leasing queue item: %w", err)
	}
	switch status {
	case 0:
		return &leaseID, nil
	case 1:
		return nil, ErrQueueItemNotFound
	case 2:
		return nil, ErrQueueItemAlreadyLeased
	case 3:
		// fn limit relevant to all runs in the fn
		return nil, newKeyError(ErrPartitionConcurrencyLimit, item.FunctionID.String())
	case 4:
		return nil, newKeyError(ErrAccountConcurrencyLimit, item.Data.Identifier.AccountID.String())
	case 5:
		return nil, newKeyError(ErrConcurrencyLimitCustomKey0, customKeys[0])
	case 6:
		return nil, newKeyError(ErrConcurrencyLimitCustomKey1, customKeys[1])
	case 7:
		return nil, newKeyError(ErrQueueItemThrottled, item.Data.Throttle.Key)
	default:
		return nil, fmt.Errorf("unknown response leasing item: %d", status)
	}
}

// ExtendLease extens the lease for a given queue item, given the queue item is currently
// leased with the given ID.  This returns a new lease ID if the lease is successfully ended.
//
// The existing lease ID must be passed in so that we can guarantee that the worker
// renewing the lease still owns the lease.
//
// Renewing a lease updates the vesting time for the queue item until now() +
// lease duration. This returns the newly acquired lease ID on success.
func (q *queue) ExtendLease(ctx context.Context, p QueuePartition, i QueueItem, leaseID ulid.ULID, duration time.Duration) (*ulid.ULID, error) {
	var (
		customKeys = make([]string, 2)
	)
	if q.customConcurrencyGen != nil {
		// Get the custom concurrency key, if available.
		for n, item := range q.customConcurrencyGen(ctx, i) {
			if n >= 2 {
				// We only support two concurrency keys right now.
				break
			}
			customKeys[n] = item.Key
		}
	}

	newLeaseID, err := ulid.New(ulid.Timestamp(getNow().Add(duration).UTC()), rnd)
	if err != nil {
		return nil, fmt.Errorf("error generating id: %w", err)
	}

	keys := []string{
		q.u.kg.QueueItem(),
		q.u.kg.FnQueueSet(i.Queue()),
		q.u.kg.GlobalPartitionIndex(),
		q.u.kg.AccountPartitionIndex(i.Data.Identifier.AccountID),
		q.u.kg.Concurrency("account", i.Data.Identifier.AccountID.String()),
		q.u.kg.Concurrency("p", i.FunctionID.String()),
		q.u.kg.Concurrency("custom", customKeys[0]),
		q.u.kg.Concurrency("custom", customKeys[1]),
	}

	args, err := StrSlice([]any{
		i.ID,
		leaseID.String(),
		newLeaseID.String(),
		p.Queue(),
	})
	if err != nil {
		return nil, err
	}
	status, err := scripts["queue/extendLease"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return nil, fmt.Errorf("error extending lease: %w", err)
	}
	switch status {
	case 0:
		return &newLeaseID, nil
	case 1:
		return nil, ErrQueueItemNotFound
	case 2:
		return nil, ErrQueueItemNotLeased
	case 3:
		return nil, ErrQueueItemLeaseMismatch
	default:
		return nil, fmt.Errorf("unknown response extending lease: %d", status)
	}
}

// Dequeue removes an item from the queue entirely.
func (q *queue) Dequeue(ctx context.Context, p QueuePartition, i QueueItem) error {
	var (
		customKeys = make([]string, 2)
	)
	if q.customConcurrencyGen != nil {
		// Get the custom concurrency key, if available.
		for n, item := range q.customConcurrencyGen(ctx, i) {
			if n >= 2 {
				// We only support two concurrency keys right now.
				break
			}
			customKeys[n] = item.Key
		}
	}

	qn := i.Queue()
	keys := []string{
		q.u.kg.QueueItem(),
		q.u.kg.FnQueueSet(qn),
		q.u.kg.PartitionMeta(qn),
		q.u.kg.Idempotency(i.ID),
		q.u.kg.Concurrency("account", i.Data.Identifier.AccountID.String()),
		q.u.kg.Concurrency("p", i.FunctionID.String()),
		q.u.kg.Concurrency("custom", customKeys[0]),
		q.u.kg.Concurrency("custom", customKeys[1]),
		q.u.kg.ConcurrencyIndex(),
	}
	// Append indexes
	for _, idx := range q.itemIndexer(ctx, i, q.u.kg) {
		if idx != "" {
			keys = append(keys, idx)
		}
	}

	idempotency := q.idempotencyTTL
	if q.idempotencyTTLFunc != nil {
		idempotency = q.idempotencyTTLFunc(ctx, i)
	}

	args, err := StrSlice([]any{
		i.ID,
		int(idempotency.Seconds()),
		p.Queue(),
	})
	if err != nil {
		return err
	}
	status, err := scripts["queue/dequeue"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error dequeueing item: %w", err)
	}
	switch status {
	case 0:
		return nil
	case 1:
		return ErrQueueItemNotFound
	default:
		return fmt.Errorf("unknown response dequeueing item: %d", status)
	}
}

// Requeue requeues an item in the future.
func (q *queue) Requeue(ctx context.Context, p QueuePartition, i QueueItem, at time.Time) error {
	var (
		customKeys = make([]string, 2)
	)

	if q.customConcurrencyGen != nil {
		// Get the custom concurrency key, if available.
		for n, item := range q.customConcurrencyGen(ctx, i) {
			if n >= 2 {
				// We only support two concurrency keys right now.
				break
			}
			customKeys[n] = item.Key
		}
	}

	// Unset any lease ID as this is requeued.
	i.LeaseID = nil
	// Update the At timestamp.
	// NOTE: This does no priority factorization or FIFO for function ordering,
	// eg. adjusting AtMS based off of function run time.
	i.AtMS = at.UnixMilli()
	// Update the wall time that this should run at.
	i.WallTimeMS = at.UnixMilli()

	var shardName string
	if q.sf != nil {
		if shard := q.sf(ctx, i.Queue(), &i.WorkspaceID); shard != nil {
			shardName = shard.Name
		}
	}

	keys := []string{
		q.u.kg.QueueItem(),
		q.u.kg.FnQueueSet(i.Queue()),
		q.u.kg.PartitionMeta(i.Queue()),
		q.u.kg.GlobalPartitionIndex(),
		q.u.kg.GlobalAccountIndex(),
		q.u.kg.AccountPartitionIndex(i.Data.Identifier.AccountID),
		q.u.kg.Concurrency("account", i.Data.Identifier.AccountID.String()),
		q.u.kg.Concurrency("p", i.FunctionID.String()),
		q.u.kg.Concurrency("custom", customKeys[0]),
		q.u.kg.Concurrency("custom", customKeys[1]),
		q.u.kg.ConcurrencyIndex(),
		q.u.kg.ShardPartitionIndex(shardName),
	}
	// Append indexes
	for _, idx := range q.itemIndexer(ctx, i, q.u.kg) {
		if idx != "" {
			keys = append(keys, idx)
		}
	}

	args, err := StrSlice([]any{
		i,
		i.ID,
		at.UnixMilli(),
		i.Queue(),
		p,
		i.Data.Identifier.AccountID,
	})
	if err != nil {
		return err
	}
	status, err := scripts["queue/requeue"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error requeueing item: %w", err)
	}
	switch status {
	case 0:
		return nil
	case 1:
		// This should only ever happen if a run is cancelled and all queue items
		// are deleted before requeueing.
		return ErrQueueItemNotFound
	default:
		return fmt.Errorf("unknown response requeueing item: %v (%T)", status, status)
	}
}

// PartitionLease leases a partition for a given workflow ID.  It returns the new lease ID.
//
// NOTE: This does not check the queue/partition name against allow or denylists;  it assumes
// that the worker always wants to lease the given queue.  Filtering must be done when peeking
// when running a worker.
func (q *queue) PartitionLease(ctx context.Context, p *QueuePartition, duration time.Duration) (*ulid.ULID, int, error) {
	fnConcurrency, acctConcurrency, customConcurrency := q.concurrencyLimitGetter(ctx, *p)

	// XXX: Check for function throttling prior to leasing;  if it's throttled we can requeue
	// the pointer and back off.  A question here is enqueuing new items onto the partition
	// will reset the pointer update, leading to thrash.
	now := getNow()
	leaseExpires := now.Add(duration).UTC().Truncate(time.Millisecond)
	leaseID, err := ulid.New(ulid.Timestamp(leaseExpires), rnd)
	if err != nil {
		return nil, 0, fmt.Errorf("error generating id: %w", err)
	}

	fnMetaKey := uuid.Nil
	if p.FunctionID != nil {
		fnMetaKey = *p.FunctionID
	}

	_ = customConcurrency

	keys := []string{
		q.u.kg.PartitionItem(),
		q.u.kg.GlobalPartitionIndex(),
		// TODO Can AccountID ever be nil?
		q.u.kg.AccountPartitionIndex(*p.AccountID),
		p.fnConcurrencyKey(q.u.kg),
		p.acctConcurrencyKey(q.u.kg),
		// TODO: Custom concurrency key (?)
		q.u.kg.FnMetadata(fnMetaKey),
	}

	// TODO: Enable checking of env and custom concurrency keys here.

	args, err := StrSlice([]any{
		p.Queue(),
		leaseID.String(),
		now.UnixMilli(),
		leaseExpires.Unix(),
		fnConcurrency,
		acctConcurrency,
		// customConcurrency,
		now.Add(PartitionConcurrencyLimitRequeueExtension).Unix(),
	})
	if err != nil {
		return nil, 0, err
	}
	result, err := scripts["queue/partitionLease"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsIntSlice()
	if err != nil {
		return nil, 0, fmt.Errorf("error leasing partition: %w", err)
	}
	if len(result) == 0 {
		return nil, 0, fmt.Errorf("unknown partition lease result: %v", result)
	}

	switch result[0] {
	case -1:
		return nil, 0, ErrPartitionConcurrencyLimit
	case -2:
		return nil, 0, ErrPartitionNotFound
	case -3:
		return nil, 0, ErrPartitionAlreadyLeased
	case -4:
		return nil, 0, ErrPartitionPaused
	default:
		limit := fnConcurrency
		if len(result) == 2 {
			limit = int(result[1])
		}

		// Update the partition's last indicator.
		if result[0] > p.Last {
			p.Last = result[0]
		}

		// result is the available concurrency within this partition
		return &leaseID, limit, nil
	}
}

// GlobalPartitionPeek returns up to PartitionSelectionMax partition items from the queue. This
// returns the indexes of partitions.
//
// If sequential is set to true this returns partitions in order from earliest to latest
// available lease times. Otherwise, this shuffles all partitions and picks partitions
// randomly, with higher priority partitions more likely to be selected.  This reduces
// lease contention amongst multiple shared-nothing workers.
func (q *queue) PartitionPeek(ctx context.Context, sequential bool, until time.Time, limit int64) ([]*QueuePartition, error) {
	return q.partitionPeek(ctx, q.u.kg.GlobalPartitionIndex(), sequential, until, limit)
}

func (q *queue) partitionSize(ctx context.Context, partitionKey string, until time.Time) (int64, error) {
	cmd := q.u.Client().B().Zcount().Key(partitionKey).Min("-inf").Max(strconv.Itoa(int(until.Unix()))).Build()
	return q.u.Client().Do(ctx, cmd).AsInt64()
}

func (q *queue) partitionPeek(ctx context.Context, partitionKey string, sequential bool, until time.Time, limit int64) ([]*QueuePartition, error) {
	if limit > PartitionPeekMax {
		return nil, ErrPartitionPeekMaxExceedsLimits
	}
	if limit <= 0 {
		limit = PartitionPeekMax
	}

	// TODO(tony): If this is an allowlist, only peek the given partitions.  Use ZMSCORE
	// to fetch the scores for all allowed partitions, then filter where score <= until.
	// Call an HMGET to get the partitions.
	ms := until.UnixMilli()

	isSequential := 0
	if sequential {
		isSequential = 1
	}

	args, err := StrSlice([]any{
		ms,
		limit,
		isSequential,
	})
	if err != nil {
		return nil, err
	}

	peekRet, err := scripts["queue/partitionPeek"].Exec(
		ctx,
		q.u.Client(),
		[]string{
			partitionKey,
			q.u.kg.PartitionItem(),
		},
		args,
	).ToAny()
	// NOTE: We use ToAny to force return a []any, allowing us to update the slice value with
	// a JSON-decoded item without allocations
	if err != nil {
		return nil, fmt.Errorf("error peeking partition items: %w", err)
	}
	encoded, ok := peekRet.([]any)
	if !ok {
		return nil, fmt.Errorf("unknown return type from partitionPeek: %T", peekRet)
	}

	weights := []float64{}
	items := make([]*QueuePartition, len(encoded))
	fnIDs := make(map[uuid.UUID]bool)
	fnIDsMu := sync.Mutex{}

	// Use parallel decoding as per Peek
	partitions, err := util.ParallelDecode(encoded, func(val any) (*QueuePartition, error) {
		str, _ := val.(string)
		item := &QueuePartition{}
		if err = json.Unmarshal(unsafe.Slice(unsafe.StringData(str), len(str)), item); err != nil {
			return nil, fmt.Errorf("error reading partition item: %w", err)
		}
		// Track the fn ID for partitions seen.  This allows us to do fast lookups of paused functions
		// to prevent peeking/working on these items as an optimization.
		if item.FunctionID != nil {
			fnIDsMu.Lock()
			fnIDs[*item.FunctionID] = false // default not paused
			fnIDsMu.Unlock()
		}
		return item, nil

	})

	// mget all fn metas
	if len(fnIDs) > 0 {
		keys := make([]string, len(fnIDs))
		n := 0
		for k := range fnIDs {
			keys[n] = q.u.kg.FnMetadata(k)
			n++
		}
		vals, err := q.u.unshardedRc.Do(ctx, q.u.unshardedRc.B().Mget().Key(keys...).Build()).ToAny()
		if err == nil {
			// If this is an error, just ignore the error and continue.  The executor should gracefully handle
			// accidental attempts at paused functions, as we cannot do this optimization for account or env-level
			// partitions.
			vals, _ := vals.([]any)
			_, _ = util.ParallelDecode(vals, func(i any) (any, error) {
				str, _ := i.(string)
				fnMeta := &FnMetadata{}
				if err := json.Unmarshal(unsafe.Slice(unsafe.StringData(str), len(str)), fnMeta); err == nil {
					fnIDsMu.Lock()
					fnIDs[fnMeta.FnID] = fnMeta.Paused
					fnIDsMu.Unlock()
				}
				return nil, nil
			})
		}
	}

	ignored := 0
	for n, item := range partitions {
		// check pause
		if item.FunctionID != nil {
			if paused := fnIDs[*item.FunctionID]; paused {
				ignored++
				continue
			}
		}

		// NOTE: The queue does two conflicting things:  we peek ahead of now() to fetch partitions
		// shortly available, and we also requeue partitions if there are concurrency conflicts.
		//
		// We want to ignore any partitions requeued because of conflicts, as this will cause needless
		// churn every peek MS.
		if item.ForceAtMS > ms {
			ignored++
			continue
		}

		// If we have an allowlist, only accept this partition if its in the allowlist.
		if len(q.allowQueues) > 0 && !checkList(item.Queue(), q.allowQueueMap, q.allowQueuePrefixes) {
			// This is not in the allowlist specified, so do not allow this partition to be used.
			ignored++
			continue
		}

		// Ignore any denied queues if they're explicitly in the denylist.  Because
		// we allocate the len(encoded) amount, we also want to track the number of
		// ignored queues to use the correct index when setting our items;  this ensures
		// that we don't access items with an index and get nil pointers.
		if len(q.denyQueues) > 0 && checkList(item.Queue(), q.denyQueueMap, q.denyQueuePrefixes) {
			// This is in the denylist explicitly set, so continue
			ignored++
			continue
		}

		items[n-ignored] = item
		partPriority := q.pf(ctx, *item)
		weights = append(weights, float64(10-partPriority))
	}

	// Remove any ignored items from the slice.
	items = items[0 : len(items)-ignored]

	// Some scanners run sequentially, ensuring we always work on the functions with
	// the oldest run at times in order, no matter the priority.
	if sequential {
		n := int(math.Min(float64(len(items)), float64(PartitionSelectionMax)))
		return items[0:n], nil
	}

	// We want to weighted shuffle the resulting array random.  This means that many
	// shared nothing scanners can query for outstanding partitions and receive a
	// randomized order favouring higher-priority queue items.  This reduces the chances
	// of contention when leasing.
	w := sampleuv.NewWeighted(weights, rnd)
	result := make([]*QueuePartition, len(items))
	for n := range result {
		idx, ok := w.Take()
		if !ok {
			return nil, ErrWeightedSampleRead
		}
		result[n] = items[idx]
	}

	return result, nil
}

func (q *queue) accountPeek(ctx context.Context, sequential bool, until time.Time, limit int64) ([]uuid.UUID, error) {
	if limit > AccountPeekMax {
		return nil, ErrAccountPeekMaxExceedsLimits
	}
	if limit <= 0 {
		limit = AccountPeekMax
	}

	ms := until.UnixMilli()

	isSequential := 0
	if sequential {
		isSequential = 1
	}

	args, err := StrSlice([]any{
		ms,
		limit,
		isSequential,
	})
	if err != nil {
		return nil, err
	}

	peekRet, err := scripts["queue/accountPeek"].Exec(
		ctx,
		q.u.unshardedRc,
		[]string{
			q.u.kg.GlobalAccountIndex(),
		},
		args,
	).AsStrSlice()

	items := make([]uuid.UUID, len(peekRet))

	for i, s := range peekRet {
		parsed, err := uuid.Parse(s)
		if err != nil {
			return nil, fmt.Errorf("could not parse account id from global account queue: %w", err)
		}

		items[i] = parsed
	}

	weights := make([]float64, len(items))
	for i := range items {
		// TODO Do we need account-specific weights? Then we need to store
		// a data structure like QueuePartition for accounts (QueueAccount?)
		accountPriority := PriorityDefault
		weights[i] = float64(10 - accountPriority)
	}

	// Some scanners run sequentially, ensuring we always work on the functions with
	// the oldest run at times in order, no matter the priority.
	if sequential {
		n := int(math.Min(float64(len(items)), float64(PartitionSelectionMax)))
		return items[0:n], nil
	}

	// We want to weighted shuffle the resulting array random.  This means that many
	// shared nothing scanners can query for outstanding partitions and receive a
	// randomized order favouring higher-priority queue items.  This reduces the chances
	// of contention when leasing.
	w := sampleuv.NewWeighted(weights, rnd)
	result := make([]uuid.UUID, len(items))
	for n := range result {
		idx, ok := w.Take()
		if !ok {
			return nil, ErrWeightedSampleRead
		}
		result[n] = items[idx]
	}

	return result, nil
}

func checkList(check string, exact, prefixes map[string]*struct{}) bool {
	for k := range exact {
		if check == k {
			return true
		}
	}
	for k := range prefixes {
		if strings.HasPrefix(check, k) {
			return true
		}
	}
	return false
}

// PartitionRequeue requeues a parition with a new score, ensuring that the partition will be
// read at (or very close to) the given time.
//
// This is used after peeking and passing all queue items onto workers; we then take the next
// unleased available time for the queue item and requeue the partition.
//
// forceAt is used to enforce the given queue time.  This is used when partitions are at a
// concurrency limit;  we don't want to scan the partition next time, so we force the partition
// to be at a specific time instead of taking the earliest available queue item time
func (q *queue) PartitionRequeue(ctx context.Context, p *QueuePartition, at time.Time, forceAt bool) error {
	var shardName string
	if q.sf != nil {
		if shard := q.sf(ctx, p.Queue(), p.EnvID); shard != nil {
			shardName = shard.Name
		}
	}

	keys := []string{
		q.u.kg.PartitionItem(),
		q.u.kg.GlobalPartitionIndex(),
		// TODO Is the account ID always set?
		q.u.kg.AccountPartitionIndex(*p.AccountID),
		q.u.kg.ShardPartitionIndex(shardName),
		q.u.kg.PartitionMeta(p.Queue()),
		q.u.kg.FnQueueSet(p.Queue()),
		q.u.kg.QueueItem(),
		p.fnConcurrencyKey(q.u.kg),
	}
	force := 0
	if forceAt {
		force = 1
	}
	args, err := StrSlice([]any{
		p.Queue(),
		at.UnixMilli(),
		force,
		*p.AccountID,
	})
	if err != nil {
		return err
	}
	status, err := scripts["queue/partitionRequeue"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error requeueing partition: %w", err)
	}
	switch status {
	case 0:
		return nil
	case 1:
		return ErrPartitionNotFound
	case 2:
		return ErrPartitionGarbageCollected
	default:
		return fmt.Errorf("unknown response requeueing item: %d", status)
	}
}

// PartitionDequeue removes a partition pointer from the queue.  This is used when peeking and
// receiving zero items to run.
func (q *queue) PartitionDequeue(ctx context.Context, queueName string, at time.Time) error {
	panic("unimplemented: requeueing partitions handles this.")
}

// PartitionReprioritize reprioritizes a workflow's QueueItems within the queue.
func (q *queue) PartitionReprioritize(ctx context.Context, queueName string, priority uint) error {
	if priority > PriorityMin {
		return ErrPriorityTooLow
	}
	if priority < PriorityMax {
		return ErrPriorityTooHigh
	}

	args, err := StrSlice([]any{
		queueName,
		priority,
	})
	if err != nil {
		return err
	}

	keys := []string{q.u.kg.PartitionItem()}
	status, err := scripts["queue/partitionReprioritize"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error enqueueing item: %w", err)
	}
	switch status {
	case 0:
		return nil
	case 1:
		return ErrPartitionNotFound
	default:
		return fmt.Errorf("unknown response reprioritizing partition: %d", status)
	}
}

func (q *queue) InProgress(ctx context.Context, prefix string, concurrencyKey string) (int64, error) {
	s := getNow().UnixMilli()
	cmd := q.u.unshardedRc.B().Zcount().
		Key(q.u.kg.Concurrency(prefix, concurrencyKey)).
		Min(fmt.Sprintf("%d", s)).
		Max("+inf").
		Build()
	return q.u.unshardedRc.Do(ctx, cmd).AsInt64()
}

// Scavenge attempts to find jobs that may have been lost due to killed workers.  Workers are shared
// nothing, and each item in a queue has a lease.  If a worker dies, it will not finish the job and
// cannot renew the item's lease.
//
// We scan all partition concurrency queues - queues of leases - to find leases that have expired.
func (q *queue) Scavenge(ctx context.Context) (int, error) {
	// Find all items that have an expired lease - eg. where the min time for a lease is between
	// (0-now] in unix milliseconds.
	now := fmt.Sprintf("%d", getNow().UnixMilli())

	cmd := q.u.unshardedRc.B().Zrange().
		Key(q.u.kg.ConcurrencyIndex()).
		Min("-inf").
		Max(now).
		Byscore().
		Limit(0, 100).
		Build()

	pKeys, err := q.u.unshardedRc.Do(ctx, cmd).AsStrSlice()
	if err != nil {
		return 0, fmt.Errorf("error scavenging for lost items: %w", err)
	}

	counter := 0

	// Each of the items is a concurrency queue with lost items.
	var resultErr error
	for _, partition := range pKeys {
		// Fetch the partition.  This uses the concurrency:p: prefix,
		// so remove the prefix from the item.
		partitionJSON, err := q.u.unshardedRc.Do(ctx, q.u.unshardedRc.B().Hget().Key(q.u.kg.PartitionItem()).Field(partition).Build()).AsBytes()
		if err == rueidis.Nil {
			continue
		}
		if err != nil {
			resultErr = multierror.Append(resultErr, fmt.Errorf("error finding partition '%s' during scavenge: %w", partition, err))
			continue
		}

		cmd := q.u.unshardedRc.B().Zrange().
			Key(q.u.kg.Concurrency("p", partition)).
			Min("-inf").
			Max(now).
			Byscore().
			Limit(0, 100).
			Build()
		itemIDs, err := q.u.unshardedRc.Do(ctx, cmd).AsStrSlice()
		if err != nil && err != rueidis.Nil {
			resultErr = multierror.Append(resultErr, fmt.Errorf("error querying partition concurrency queue '%s' during scavenge: %w", partition, err))
			continue
		}
		if len(itemIDs) == 0 {
			continue
		}

		p := QueuePartition{}
		if err := json.Unmarshal([]byte(partitionJSON), &p); err != nil {
			resultErr = multierror.Append(resultErr, fmt.Errorf("error unmarshalling partition '%s': %w", partitionJSON, err))
			continue
		}

		// Fetch the queue item, then requeue.
		cmd = q.u.unshardedRc.B().Hmget().Key(q.u.kg.QueueItem()).Field(itemIDs...).Build()
		jobs, err := q.u.unshardedRc.Do(ctx, cmd).AsStrSlice()
		if err != nil && err != rueidis.Nil {
			resultErr = multierror.Append(resultErr, fmt.Errorf("error fetching jobs for concurrency queue '%s' during scavenge: %w", partition, err))
			continue
		}
		for _, item := range jobs {
			qi := QueueItem{}
			if err := json.Unmarshal([]byte(item), &qi); err != nil {
				resultErr = multierror.Append(resultErr, fmt.Errorf("error unmarshalling job '%s': %w", item, err))
				continue
			}
			if err := q.Requeue(ctx, p, qi, getNow()); err != nil {
				resultErr = multierror.Append(resultErr, fmt.Errorf("error requeueing job '%s': %w", item, err))
				continue
			}
			counter++
		}
	}

	return counter, resultErr
}

// ConfigLease allows a worker to lease config keys for sequential or scavenger processing.
// Leasing this key works similar to leasing partitions or queue items:
//
//   - If the key isn't leased, a new lease is accepted.
//   - If the lease is expired, a new lease is accepted.
//   - If the key is leased, you must pass in the existing lease ID to renew the lease.  Mismatches do not
//     grant a lease.
//
// This returns the new lease ID on success.
//
// If the sequential key is leased, this allows a worker to peek partitions sequentially.
func (q *queue) ConfigLease(ctx context.Context, key string, duration time.Duration, existingLeaseID ...*ulid.ULID) (*ulid.ULID, error) {
	if duration > ConfigLeaseMax {
		return nil, ErrConfigLeaseExceedsLimits
	}

	now := getNow()
	newLeaseID, err := ulid.New(ulid.Timestamp(now.Add(duration)), rnd)
	if err != nil {
		return nil, err
	}

	var existing string
	if len(existingLeaseID) > 0 && existingLeaseID[0] != nil {
		existing = existingLeaseID[0].String()
	}

	args, err := StrSlice([]any{
		now.UnixMilli(),
		newLeaseID.String(),
		existing,
	})
	if err != nil {
		return nil, err
	}

	status, err := scripts["queue/configLease"].Exec(
		ctx,
		q.u.unshardedRc,
		[]string{key},
		args,
	).AsInt64()
	if err != nil {
		return nil, fmt.Errorf("error claiming config lease: %w", err)
	}
	switch status {
	case 0:
		return &newLeaseID, nil
	case 1:
		return nil, ErrConfigAlreadyLeased
	default:
		return nil, fmt.Errorf("unknown response claiming config lease: %d", status)
	}
}

func (q *queue) getShards(ctx context.Context) (map[string]*QueueShard, error) {
	m, err := q.u.unshardedRc.Do(ctx, q.u.unshardedRc.B().Hgetall().Key(q.u.kg.Shards()).Build()).AsMap()
	if rueidis.IsRedisNil(err) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error fetching shards: %w", err)
	}
	shards := map[string]*QueueShard{}
	for k, v := range m {
		shard := &QueueShard{}
		if err := v.DecodeJSON(shard); err != nil {
			return nil, fmt.Errorf("error decoding shards: %w", err)
		}
		shards[k] = shard
	}
	return shards, nil
}

// leaseShard leases a shard for the given duration.  Shards can have more than one lease at a time;
// you must provide an index to claim a lease. THe index This prevents multiple workers
// from claiming the same lease index;  if workers A and B see a shard with 0 leases and both attempt
// to claim lease "0", only one will succeed.
func (q *queue) leaseShard(ctx context.Context, shard *QueueShard, duration time.Duration, n int) (*ulid.ULID, error) {
	now := getNow()
	leaseID, err := ulid.New(uint64(now.Add(duration).UnixMilli()), rand.Reader)
	if err != nil {
		return nil, err
	}

	keys := []string{q.u.kg.Shards()}
	args, err := StrSlice([]any{
		now.UnixMilli(),
		shard.Name,
		leaseID,
		n,
	})
	if err != nil {
		return nil, err
	}

	status, err := scripts["queue/shardLease"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return nil, fmt.Errorf("error leasing item: %w", err)
	}
	switch status {
	case int64(-1):
		return nil, errShardNotFound
	case int64(-2):
		return nil, errShardIndexLeased
	case int64(-3):
		return nil, errShardIndexInvalid
	case int64(0):
		return &leaseID, nil
	default:
		return nil, fmt.Errorf("unknown lease return value: %T(%v)", status, status)
	}
}

func (q *queue) renewShardLease(ctx context.Context, shard *QueueShard, duration time.Duration, leaseID ulid.ULID) (*ulid.ULID, error) {
	now := getNow()
	newLeaseID, err := ulid.New(uint64(now.Add(duration).UnixMilli()), rand.Reader)
	if err != nil {
		return nil, err
	}

	keys := []string{q.u.kg.Shards()}
	args, err := StrSlice([]any{
		now.UnixMilli(),
		shard.Name,
		leaseID,
		newLeaseID,
	})
	if err != nil {
		return nil, err
	}

	status, err := scripts["queue/renewShardLease"].Exec(
		ctx,
		q.u.unshardedRc,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return nil, fmt.Errorf("error leasing item: %w", err)
	}
	switch status {
	case int64(-1):
		return nil, fmt.Errorf("shard not found")
	case int64(-2):
		return nil, fmt.Errorf("lease not found")
	case int64(0):
		return &newLeaseID, nil
	default:
		return nil, fmt.Errorf("unknown lease renew return value: %T(%v)", status, status)
	}
}

//nolint:all
func (q *queue) getShardLeases() []leasedShard {
	q.shardLeaseLock.Lock()
	existingLeases := make([]leasedShard, len(q.shardLeases))
	for n, i := range q.shardLeases {
		existingLeases[n] = i
	}
	q.shardLeaseLock.Unlock()
	return existingLeases
}

// peekEWMA returns the calculated EWMA value from the list
func (q *queue) peekEWMA(ctx context.Context, fnID uuid.UUID) (int64, error) {
	// retrieves the list from redis
	cmd := q.u.Client().B().Lrange().Key(q.u.KeyGenerator().ConcurrencyFnEWMA(fnID)).Start(0).Stop(-1).Build()
	strlist, err := q.u.Client().Do(ctx, cmd).AsStrSlice()
	if err != nil {
		return 0, fmt.Errorf("error reading function concurrency EWMA values: %w", err)
	}

	// return early
	if len(strlist) == 0 {
		return 0, nil
	}

	// convert to float for
	vals := make([]float64, len(strlist))
	for i, s := range strlist {
		v, _ := strconv.ParseFloat(s, 64)
		vals[i] = v
	}

	// create a simple EWMA, add all the numbers in it and get the final value
	// NOTE: we don't need variable since we don't want to maintain this in memory
	mavg := ewma.NewMovingAverage()
	for _, v := range vals {
		mavg.Add(v)
	}

	// round up to the nearest integer
	return int64(math.Round(mavg.Value())), nil
}

// setPeekEWMA add the new value to the existing list.
// if the length of the list exceeds the predetermined size, pop out the first item
func (q *queue) setPeekEWMA(ctx context.Context, fnID *uuid.UUID, val int64) error {
	if fnID == nil {
		return nil
	}

	listSize := q.peekEWMALen
	if listSize == 0 {
		listSize = QueuePeekEWMALen
	}

	keys := []string{
		q.u.kg.ConcurrencyFnEWMA(*fnID),
	}
	args, err := StrSlice([]any{
		val,
		listSize,
	})
	if err != nil {
		return err
	}

	_, err = scripts["queue/setPeekEWMA"].Exec(
		ctx,
		q.u.Client(),
		keys,
		args,
	).AsInt64()
	if err != nil {
		return fmt.Errorf("error updating function concurrency EWMA: %w", err)
	}

	return nil
}

//nolint:all
func (q *queue) readFnMetadata(ctx context.Context, fnID uuid.UUID) (*FnMetadata, error) {
	cmd := q.u.unshardedRc.B().Get().Key(q.u.kg.FnMetadata(fnID)).Build()
	retv := FnMetadata{}
	err := q.u.unshardedRc.Do(ctx, cmd).DecodeJSON(&retv)
	if err != nil {
		return nil, fmt.Errorf("error reading function metadata: %w", err)
	}
	return &retv, nil
}

func HashID(_ context.Context, id string) string {
	ui := xxhash.Sum64String(id)
	return strconv.FormatUint(ui, 36)
}

// frandRNG is a fast crypto-secure prng which uses a mutex to guard
// parallel reads.  It also implements the x/exp/rand.Source interface
// by adding a Seed() method which does nothing.
type frandRNG struct {
	*frand.RNG
	lock *sync.Mutex
}

func (f *frandRNG) Read(b []byte) (int, error) {
	f.lock.Lock()
	defer f.lock.Unlock()
	return f.RNG.Read(b)
}

func (f *frandRNG) Uint64() uint64 {
	return f.Uint64n(math.MaxUint64)
}

func (f *frandRNG) Uint64n(n uint64) uint64 {
	// sampled.Take calls Uint64n, which must be guarded by a lock in order
	// to be thread-safe.
	f.lock.Lock()
	defer f.lock.Unlock()
	return f.RNG.Uint64n(n)
}

func (f *frandRNG) Float64() float64 {
	// sampled.Take also calls Float64, which must be guarded by a lock in order
	// to be thread-safe.
	f.lock.Lock()
	defer f.lock.Unlock()
	return f.RNG.Float64()
}

func (f *frandRNG) Seed(seed uint64) {
	// Do nothing.
}

func newLeaseDenyList() *leaseDenies {
	return &leaseDenies{
		lock:        &sync.RWMutex{},
		concurrency: map[string]struct{}{},
		throttle:    map[string]struct{}{},
	}
}

// leaseDenies stores a mapping of keys that must not be leased.
//
// When iterating over a list of peeked queue items, each queue item may have the same
// or different concurrency keys.  As soon as one of these concurrency keys reaches its
// limit, any next queue items with the same keys must _never_ be considered for leasing.
//
// This has two benefits:  we prevent wasted work, and we prevent out of order work.
type leaseDenies struct {
	lock *sync.RWMutex

	concurrency map[string]struct{}
	throttle    map[string]struct{}
}

func (l *leaseDenies) addThrottled(err error) {
	var key keyError
	if !errors.As(err, &key) {
		return
	}
	l.lock.Lock()
	l.throttle[key.key] = struct{}{}
	l.lock.Unlock()
}

func (l *leaseDenies) addConcurrency(err error) {
	var key keyError
	if !errors.As(err, &key) {
		return
	}
	l.lock.Lock()
	l.concurrency[key.key] = struct{}{}
	l.lock.Unlock()
}

func (l *leaseDenies) denyConcurrency(key string) bool {
	l.lock.RLock()
	_, ok := l.concurrency[key]
	l.lock.RUnlock()
	return ok
}

func (l *leaseDenies) denyThrottle(key string) bool {
	l.lock.RLock()
	_, ok := l.throttle[key]
	l.lock.RUnlock()
	return ok
}
