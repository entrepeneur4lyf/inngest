'use client';

import { IconPrometheus } from '@inngest/components/icons/platforms/Prometheus';

import ConfigSteps from '@/components/PrometheusIntegration/ConfigSteps';
import NotEnabledMessage from '@/components/PrometheusIntegration/NotEnabledMessage';

type Props = {
  metricsExportEnabled: boolean;
  metricsGranularitySeconds: number;
};

export default function PrometheusSetupPage({
  metricsExportEnabled,
  metricsGranularitySeconds,
}: Props) {
  return (
    <div className="mx-auto mt-16 flex w-[800px] flex-col">
      <div className="text-basis mb-7 flex flex-row items-center justify-start text-2xl font-medium">
        <div className="bg-contrast mr-4 flex h-12 w-12 items-center justify-center rounded">
          <IconPrometheus className="text-onContrast" size={20} />
        </div>
        Prometheus
      </div>

      <div className="text-muted mb-6 w-full text-base font-normal">
        This integration allows your Prometheus server to scrape metrics about your Inngest
        deployment.
        {/* TODO: Link to Prometheus scrape endpoint docs, once we've written them */}
        {/*<Link target="_blank" size="medium" href="https://www.inngest.com/docs/deploy/vercel">*/}
        {/*  Read documentation*/}
        {/*</Link>*/}
      </div>

      {metricsExportEnabled ? (
        <ConfigSteps metricsGranularitySeconds={metricsGranularitySeconds} />
      ) : (
        <NotEnabledMessage />
      )}
    </div>
  );
}
