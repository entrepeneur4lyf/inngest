import { Badge } from '@inngest/components/Badge';

type Props = {
  icon: React.ReactNode;
  badge?: string;
  title?: string;
  metadata?: {
    label: string;
    value: string;
  };
};

export function TimelineNodeHeader({ icon, badge, title, metadata }: Props) {
  return (
    <div className="text-sm">
      <div className="text-light mr-2 flex flex-1 items-start gap-2 leading-8">
        <div className="flex h-8 items-center gap-2">
          {icon}
          {badge && (
            <Badge kind="solid" className="bg-canvasBase text-muted">
              {badge}
            </Badge>
          )}
        </div>
        <p className="align-top leading-8">{title}</p>
      </div>
      <dl className="text-muted ml-8 leading-8">
        <dt className="inline break-all pr-1">{metadata?.label}</dt>
        <dd className="inline break-all">{metadata?.value}</dd>
      </dl>
    </div>
  );
}
