'use client';

import { RunDetails as RunDetailsView } from '@inngest/components/RunDetailsV2';

import { useEnvironment } from '@/app/(organization-active)/(dashboard)/env/[environmentSlug]/environment-context';
import LoadingIcon from '@/icons/LoadingIcon';
import { useCancelRun } from '@/queries/useCancelRun';
import { useRerun } from '@/queries/useRerun';
import { useRun } from './useRun';

type Props = {
  runID: string;
};

export function RunDetails({ runID }: Props) {
  const env = useEnvironment();
  const cancelRun = useCancelRun({ envID: env.id, runID });
  const rerun = useRerun({ envID: env.id, envSlug: env.slug, runID });

  const res = useRun({ envID: env.id, runID });
  if (res.error) {
    throw res.error;
  }
  if (res.isLoading && !res.data) {
    return <Loading />;
  }
  const { run, trace } = res.data;

  async function getOutput() {
    return null;
  }

  return (
    <div className="overflow-y-auto">
      <RunDetailsView
        app={run.function.app}
        cancelRun={cancelRun}
        fn={run.function}
        getOutput={getOutput}
        rerun={rerun}
        run={{
          id: runID,
          output: null,
          trace,
        }}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <LoadingIcon />
        <div>Loading</div>
      </div>
    </div>
  );
}
