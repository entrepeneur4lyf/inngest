'use client';

import { useState } from 'react';
import { RangePicker } from '@inngest/components/DatePicker';
import type { RangeChangeProps } from '@inngest/components/DatePicker/RangePicker.jsx';
import EntityFilter from '@inngest/components/Filter/EntityFilter';
import { Pill } from '@inngest/components/Pill';
import {
  useBatchedSearchParams,
  useBooleanSearchParam,
  useSearchParam,
  useStringArraySearchParam,
} from '@inngest/components/hooks/useSearchParam';
import {
  durationToString,
  parseDuration,
  subtractDuration,
  toDate,
  type DurationType,
} from '@inngest/components/utils/date';
import { RiArrowDownSFill, RiArrowRightSFill } from '@remixicon/react';
import { useQuery } from 'urql';

import { GetBillingPlanDocument } from '@/gql/graphql';
import { FailedFunctions } from './FailedFunctions';
import { FunctionStatus } from './FunctionStatus';

type EntityType = {
  id: string;
  name: string;
};

export const DEFAULT_DURATION = { hours: 24 };

const getFrom = (start?: Date, duration?: DurationType | '') =>
  start || subtractDuration(new Date(), duration ? duration : DEFAULT_DURATION);

const getDefaultRange = (start?: Date, end?: Date, duration?: DurationType | '') =>
  start && end
    ? {
        type: 'absolute' as const,
        start: start,
        end: end,
      }
    : {
        type: 'relative' as const,
        duration: duration ? duration : DEFAULT_DURATION,
      };

export const Dashboard = ({
  apps = [],
  functions = [],
}: {
  apps?: EntityType[];
  functions?: EntityType[];
}) => {
  const [selectedApps, setApps, removeApps] = useStringArraySearchParam('apps');
  const [selectedFns, setFns, removeFns] = useStringArraySearchParam('fns');
  const [start] = useSearchParam('start');
  const [end] = useSearchParam('end');
  const [duration] = useSearchParam('duration');
  const [autoRefresh] = useBooleanSearchParam('autoRefresh');
  const batchUpdate = useBatchedSearchParams();

  const parsedDuration = duration && parseDuration(duration);
  const parsedStart = toDate(start);
  const parsedEnd = toDate(end);

  const [overviewOpen, setOverviewOpen] = useState(true);

  const [{ data: planData }] = useQuery({
    query: GetBillingPlanDocument,
  });

  const logRetention = Number(planData?.account.plan?.features.log_retention);
  const upgradeCutoff = subtractDuration(new Date(), { days: logRetention || 7 });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-canvasBase flex h-16 w-full flex-row items-center justify-between px-3 py-5">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <EntityFilter
            type="app"
            onFilterChange={(apps) => (apps.length ? setApps(apps) : removeApps())}
            selectedEntities={selectedApps || []}
            entities={apps}
            className="h-8"
          />
          <EntityFilter
            type="function"
            onFilterChange={(fns) => (fns.length ? setFns(fns) : removeFns())}
            selectedEntities={selectedFns || []}
            entities={functions}
            className="h-8"
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-x-2">
          <Pill appearance="outlined" kind="warning">
            <div className="text-nowrap">15m delay</div>
          </Pill>
          <RangePicker
            className="w-full"
            upgradeCutoff={upgradeCutoff}
            defaultValue={getDefaultRange(parsedStart, parsedEnd, parsedDuration)}
            onChange={(range: RangeChangeProps) => {
              batchUpdate({
                duration: range.type === 'relative' ? durationToString(range.duration) : null,
                start: range.type === 'absolute' ? range.start.toISOString() : null,
                end: range.type === 'absolute' ? range.end.toISOString() : null,
              });
            }}
          />
        </div>
      </div>
      <div className="px-6">
        <div className="bg-canvasSubtle item-start flex h-full w-full flex-col items-start">
          <div className="leading-non text-subtle my-4 flex w-full flex-row items-center justify-start gap-x-2 text-xs uppercase">
            {overviewOpen ? (
              <RiArrowDownSFill className="cursor-pointer" onClick={() => setOverviewOpen(false)} />
            ) : (
              <RiArrowRightSFill className="cursor-pointer" onClick={() => setOverviewOpen(true)} />
            )}
            <div>Overview</div>

            <hr className="border-subtle w-full" />
          </div>
          {overviewOpen && (
            <div className="relative flex w-full flex-row items-center justify-start gap-2 overflow-hidden">
              <FunctionStatus
                from={getFrom(parsedStart, parsedDuration)}
                until={parsedEnd}
                selectedApps={selectedApps}
                selectedFns={selectedFns}
                autoRefresh={autoRefresh}
              />
              <FailedFunctions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
