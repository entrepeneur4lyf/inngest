import { useEffect, useState } from 'react';
import type { Route } from 'next';

import type { Result } from '../types/functionRun';
import { cn } from '../utils/classNames';
import { toMaybeDate } from '../utils/date';
import { InlineSpans } from './InlineSpans';
import { TraceHeading } from './TraceHeading';
import { TraceInfo } from './TraceInfo';
import type { Trace } from './types';
import { createSpanWidths } from './utils';

type Props = {
  depth: number;
  getResult: (outputID: string) => Promise<Result>;
  isExpandable?: boolean;
  minTime?: Date;
  maxTime?: Date;
  pathCreator: {
    runPopout: (params: { runID: string }) => Route;
  };
  trace: Trace;
};

export function Trace({
  depth,
  getResult,
  isExpandable = true,
  maxTime,
  minTime,
  pathCreator,
  trace,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    if (isExpanded && !result && trace.outputID) {
      getResult(trace.outputID).then((data) => {
        setResult(data);
      });
    }
  }, [isExpanded, result]);

  if (!minTime) {
    minTime = new Date(trace.queuedAt);
  }

  if (!maxTime) {
    maxTime = new Date(trace.endedAt ?? new Date());
  }

  const widths = createSpanWidths({
    ended: toMaybeDate(trace.endedAt)?.getTime() ?? null,
    max: maxTime.getTime(),
    min: minTime.getTime(),
    queued: new Date(trace.queuedAt).getTime(),
    started: toMaybeDate(trace.startedAt)?.getTime() ?? null,
  });

  let spans = [trace];
  if (!trace.isRoot && trace.childrenSpans && trace.childrenSpans.length > 0) {
    spans = trace.childrenSpans;
  }

  return (
    <div
      className={cn(
        'py-5',
        // We don't want borders or horizontal padding on step attempts
        depth === 0 && 'px-8',
        isExpanded && 'bg-sky-50'
      )}
    >
      <div className="flex">
        <div
          className={cn(
            // Steps and attempts need different widths, since attempts are
            // indented
            depth === 0 && 'w-72',
            depth === 1 && 'w-64'
          )}
        >
          <TraceHeading
            isExpandable={isExpandable}
            isExpanded={isExpanded}
            onClickExpandToggle={() => setIsExpanded((prev) => !prev)}
            trace={trace}
          />
        </div>

        <InlineSpans
          maxTime={maxTime}
          minTime={minTime}
          name={trace.name}
          spans={spans}
          widths={widths}
        />
      </div>

      {isExpanded && (
        <div className="ml-8">
          <TraceInfo
            className="my-4 grow"
            pathCreator={pathCreator}
            trace={trace}
            result={result}
          />

          {trace.childrenSpans?.map((child, i) => {
            return (
              <div className="flex">
                <div className="grow">
                  <Trace
                    depth={depth + 1}
                    getResult={getResult}
                    maxTime={maxTime}
                    minTime={minTime}
                    pathCreator={pathCreator}
                    trace={child}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
