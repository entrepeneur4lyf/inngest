import { cn } from './utils/classNames';

type Props = {
  className?: string;
  value: string;
};

export function InlineCode({ className, value }: Props) {
  return (
    <code
      className={cn(
        'bg-canvasMuted text-basis inline-flex items-center rounded-sm px-1 py-1 font-mono text-xs font-semibold leading-none',
        className
      )}
    >
      {value}
    </code>
  );
}
