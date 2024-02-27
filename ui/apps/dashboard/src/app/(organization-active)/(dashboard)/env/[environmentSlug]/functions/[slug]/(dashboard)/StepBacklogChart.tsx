'use client';

import colors from 'tailwindcss/colors';
import { useQuery } from 'urql';

import { useEnvironment } from '@/app/(organization-active)/(dashboard)/env/[environmentSlug]/environment-context';
import type { TimeRange } from '@/app/(organization-active)/(dashboard)/env/[environmentSlug]/functions/[slug]/logs/TimeRangeFilter';
import SimpleLineChart from '@/components/Charts/SimpleLineChart';
import { graphql } from '@/gql';

const GetStepBacklogDocument = graphql(`
  query GetStepBacklogMetrics(
    $environmentID: ID!
    $fnSlug: String!
    $startTime: Time!
    $endTime: Time!
  ) {
    environment: workspace(id: $environmentID) {
      function: workflowBySlug(slug: $fnSlug) {
        scheduled: metrics(opts: { name: "steps_scheduled", from: $startTime, to: $endTime }) {
          from
          to
          granularity
          data {
            bucket
            value
          }
        }
        sleeping: metrics(opts: { name: "steps_sleeping", from: $startTime, to: $endTime }) {
          from
          to
          granularity
          data {
            bucket
            value
          }
        }
      }
    }
  }
`);

type StepBacklogChartProps = {
  functionSlug: string;
  timeRange: TimeRange;
};

export default function StepBacklogChart({ functionSlug, timeRange }: StepBacklogChartProps) {
  const environment = useEnvironment();

  const [{ data, error: metricsError, fetching: isFetchingMetrics }] = useQuery({
    query: GetStepBacklogDocument,
    variables: {
      environmentID: environment.id,
      fnSlug: functionSlug,
      startTime: timeRange.start.toISOString(),
      endTime: timeRange.end.toISOString(),
    },
  });

  const scheduled = data?.environment.function?.scheduled.data ?? [];
  const sleeping = data?.environment.function?.sleeping.data ?? [];

  const maxLength = Math.max(scheduled.length, sleeping.length);

  const metrics = Array.from({ length: maxLength }).map((_, idx) => ({
    name: scheduled[idx]?.bucket || sleeping[idx]?.bucket || '',
    values: {
      scheduled: scheduled[idx]?.value ?? 0,
      sleeping: sleeping[idx]?.value ?? 0,
    },
  }));

  return (
    <SimpleLineChart
      title="Step Backlog"
      desc="The backlog status of steps for this function"
      data={metrics}
      legend={[
        { name: 'Scheduled', dataKey: 'scheduled', color: colors.slate['500'] },
        { name: 'Sleeping', dataKey: 'sleeping', color: colors.teal['500'] },
      ]}
      isLoading={isFetchingMetrics}
      error={metricsError}
    />
  );
}
