'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { OptionalLink } from '@inngest/components/Link/OptionalLink';

import { Badge } from '../Badge';
import { Pill } from '../Pill';
import { OptionalTooltip } from '../Tooltip/OptionalTooltip';
import { cn } from '../utils/classNames';

export const MenuItem = ({
  text,
  icon,
  collapsed,
  href,
  prefetch = false,
  comingSoon = false,
  beta = false,
  error = false,
  className,
}: {
  text: string;
  icon: ReactNode;
  collapsed: boolean;
  href?: string;
  prefetch?: boolean;
  comingSoon?: boolean;
  beta?: boolean;
  error?: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  const active = href && pathname.startsWith(href);

  return (
    <OptionalLink href={comingSoon ? '' : href} prefetch={prefetch}>
      <OptionalTooltip tooltip={comingSoon ? 'Coming soon...' : collapsed ? text : ''}>
        <div
          className={cn(
            `my-1 flex h-8 w-full flex-row items-center rounded px-1.5  ${
              comingSoon
                ? 'text-disabled hover:bg-disabled cursor-not-allowed'
                : active
                ? 'bg-secondary-3xSubtle text-info hover:bg-secondary-2xSubtle'
                : 'hover:bg-canvasSubtle text-muted hover:text-basis'
            } `,
            className
          )}
        >
          {icon}
          {!collapsed && <span className="ml-2.5 text-sm leading-tight">{text}</span>}
          {!collapsed && beta && (
            <Pill kind="primary" appearance="solid" className="ml-2.5">
              Beta
            </Pill>
          )}
          {!collapsed && error && (
            <Badge
              kind={'error'}
              className="text-alwaysWhite bg-error ml-2.5 h-5 px-1.5 py-1 text-xs"
            />
          )}
        </div>
      </OptionalTooltip>
    </OptionalLink>
  );
};
