package metrics

import "context"

func GaugeQueueItemLatencyEWMA(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "queue_item_latency_ewma",
		Description: "The moving average of the queue item latency",
		Tags:        opts.Tags,
	})
}

func GaugeWorkerQueueCapacity(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "queue_capacity_total",
		Description: "Capacity of current worker",
		Tags:        opts.Tags,
	})
}

func GaugeGlobalPartitionSize(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "global_partition_size",
		Description: "Number of total partitions in the global queue",
		Tags:        opts.Tags,
		Callback:    opts.Callback,
	})
}

func GaugePartitionSize(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "partition_size",
		Description: "Number of items in a particular partition",
		Tags:        opts.Tags,
	})
}

func GaugeQueueGuaranteedCapacityCount(ctx context.Context, value int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, value, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "queue_guaranteed_capacity_count",
		Description: "Number of accounts with guaranteed capacity in the queue",
		Tags:        opts.Tags,
	})
}

func GaugeQueueAccountGuaranteedCapacityCount(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "queue_account_guaranteed_capacity_count",
		Description: "Account guaranteed capacity",
		Tags:        opts.Tags,
	})
}

func GaugeQueueGuaranteedCapacityLeaseCount(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "queue_guaranteed_capacity_lease_count",
		Description: "Guaranteed capacity current lease count",
		Tags:        opts.Tags,
	})
}

func GaugeQueueGuaranteedCapacityAccountPartitionAvailableCount(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "queue_guaranteed_capacity_account_partition_available_count",
		Description: "The number of partitions available for account with guaranteed capacity",
		Tags:        opts.Tags,
	})
}

func GaugeSpanBatchProcessorBufferSize(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "span_batch_processor_buffer_size",
		Description: "The number of items in buffer point in time",
		Tags:        opts.Tags,
	})
}

func GaugeSpanBatchProcessorBufferKeys(ctx context.Context, val int64, opts GaugeOpt) {
	RecordGaugeMetric(ctx, val, GaugeOpt{
		PkgName:     opts.PkgName,
		MetricName:  "span_batch_processor_buffer_keys",
		Description: "The number of keys used in buffer point in time",
		Tags:        opts.Tags,
	})
}
