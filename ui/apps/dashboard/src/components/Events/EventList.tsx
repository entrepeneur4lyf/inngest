'use client';

import { useState } from 'react';
import { Button } from '@inngest/components/Button';
import { Link } from '@inngest/components/Link';
import { HorizontalPillList, Pill, PillContent } from '@inngest/components/Pill';
import { cn } from '@inngest/components/utils/classNames';

import MiniStackedBarChart from '@/components/Charts/MiniStackedBarChart';
import { useEnvironment } from '@/components/Environments/environment-context';
import LoadingIcon from '@/icons/LoadingIcon';
import { useEventTypes } from '@/queries';
import { pathCreator } from '@/utils/urls';
import EventListNotFound from './EventListNotFound';

export const EventList = () => {
  const [pages, setPages] = useState([1]);

  function appendPage() {
    setPages((prevPages) => {
      const lastPage = prevPages[prevPages.length - 1] ?? 0;
      return [...prevPages, lastPage + 1];
    });
  }

  return (
    <main className="bg-canvasBase min-h-0 flex-1">
      <table className="border-subtle relative w-full border-b">
        <thead className="shadow-subtle sticky top-0 z-10 shadow-[0_1px_0]">
          <tr className="h-12">
            {['Event Name', 'Functions', 'Volume (24hr)'].map((heading) => (
              <th
                key={heading}
                scope="col"
                className={cn('text-muted whitespace-nowrap px-4 text-left text-sm font-semibold')}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-subtle h-full divide-y px-4 py-3">
          {pages.map((page) => (
            <EventTypesListPaginationPage
              key={page}
              isLastLoadedPage={page === pages[pages.length - 1]}
              page={page}
              onLoadMore={appendPage}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
};

type EventListPaginationPageProps = {
  isLastLoadedPage: boolean;
  page: number;
  onLoadMore: () => void;
};

function EventTypesListPaginationPage({
  isLastLoadedPage,
  page,
  onLoadMore,
}: EventListPaginationPageProps) {
  const env = useEnvironment();
  const [{ data, fetching: isFetchingEvents }] = useEventTypes({
    page,
  });

  const events = data?.workspace.events.data ?? [];
  const totalPages = data?.workspace.events.page.totalPages ?? 1;
  const hasNextPage = page < totalPages;
  const isFirstPage = page === 1;

  if (isFetchingEvents) {
    return (
      <tr>
        <td colSpan={3} className="h-56">
          <div className="relative flex items-center justify-center">
            <LoadingIcon />
          </div>
        </td>
      </tr>
    );
  }

  if (isFirstPage && events.length === 0) {
    return (
      <tr>
        <td colSpan={3}>
          <EventListNotFound />
        </td>
      </tr>
    );
  }

  return (
    <>
      {events.map((event) => {
        const dailyVolume = event.dailyVolume.total;

        // Creates an array of objects containing the volume for each usage slot (1 hour)
        const dailyVolumeSlots = event.dailyVolume.data.map((volumeSlot) => ({
          startCount: volumeSlot.count,
        }));

        return (
          <tr className="hover:bg-canvasSubtle/50" key={event.name}>
            <td className="w-96 whitespace-nowrap">
              <div className="flex items-center gap-2.5 pl-2">
                <Link
                  href={pathCreator.eventType({ envSlug: env.slug, eventName: event.name })}
                  arrowOnHover
                  className="w-full px-2 py-3 text-sm font-medium"
                >
                  {event.name}
                </Link>
              </div>
            </td>
            <td className="space-x-2 whitespace-nowrap px-2">
              <HorizontalPillList
                alwaysVisibleCount={2}
                pills={event.functions.map((function_) => (
                  <Pill
                    appearance="outlined"
                    href={pathCreator.function({
                      envSlug: env.slug,
                      functionSlug: function_.slug,
                    })}
                    key={function_.name}
                  >
                    <PillContent type="FUNCTION">{function_.name}</PillContent>
                  </Pill>
                ))}
              />
            </td>
            <td className="w-60 py-1 pl-2 pr-6">
              <div className="flex w-56 items-center justify-end gap-2">
                <div className="text-subtle flex items-center gap-1 align-middle">
                  <span className="text-subtle overflow-hidden whitespace-nowrap text-sm">
                    {dailyVolume.toLocaleString(undefined, {
                      notation: 'compact',
                      compactDisplay: 'short',
                    })}
                  </span>
                </div>
                <MiniStackedBarChart className="shrink-0" data={dailyVolumeSlots} />
              </div>
            </td>
          </tr>
        );
      })}

      {isLastLoadedPage && hasNextPage && (
        <tr>
          <td colSpan={3} className="py-2.5 text-center">
            <Button appearance="outlined" kind="secondary" onClick={onLoadMore} label="Load More" />
          </td>
        </tr>
      )}
    </>
  );
}
