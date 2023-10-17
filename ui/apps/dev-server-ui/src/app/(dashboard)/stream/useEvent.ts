import { useMemo } from 'react';
import type { Event } from '@inngest/components/types/event';
import {
  baseFetchFailed,
  baseFetchLoading,
  baseFetchSkipped,
  baseFetchSucceeded,
  type FetchResult,
} from '@inngest/components/types/fetch';
import type { FunctionRun } from '@inngest/components/types/functionRun';

import { FunctionRunStatus, useGetEventQuery } from '@/store/generated';

type Data = Event & { functionRuns: Pick<FunctionRun, 'id' | 'name' | 'output' | 'status'>[] };

export function useEvent(eventID: string | null): FetchResult<Data, { skippable: true }> {
  const skip = !eventID;
  const query = useGetEventQuery({ id: eventID ?? '' }, { pollingInterval: 1000, skip });

  // In addition to memoizing, this hook will also transform the API data into
  // the shape our shared UI expects.
  const data = useMemo((): Data | undefined => {
    const { event } = query.data ?? {};

    if (!event) {
      return undefined;
    }

    const functionRuns: Data['functionRuns'] = (event.functionRuns ?? []).map((run) => {
      return {
        id: run.id,
        name: run.name ?? 'Unknown',
        output: run.output ?? null,
        status: run.status ?? FunctionRunStatus.Running,
      };
    });

    return {
      ...event,
      createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
      functionRuns,
      payload: event.raw ?? 'null',
      name: event.name ?? 'Unknown',
    };
  }, [query.data?.event]);

  if (query.isLoading) {
    return baseFetchLoading;
  }

  if (skip) {
    return baseFetchSkipped;
  }

  if (query.error) {
    return {
      ...baseFetchFailed,
      error: new Error(query.error.message),
    };
  }

  if (!data) {
    // Should be unreachable.
    return {
      ...baseFetchFailed,
      error: new Error('finished loading but missing data'),
    };
  }

  return {
    ...baseFetchSucceeded,
    data,
  };
}
