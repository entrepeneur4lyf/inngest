import { cn } from '@inngest/components/utils/classNames';
import { RiSearchLine } from '@remixicon/react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  debouncedSearch: () => void;
}

export default function SearchInput({
  value,
  onChange,
  debouncedSearch,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('bg-canvasBase text-subtle relative flex items-center pl-6 ', className)}>
      <input
        type="text"
        className="text-subtle placeholder-subtle w-96 bg-transparent py-1 pl-4"
        placeholder={props?.placeholder ?? 'Search...'}
        value={value ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
          debouncedSearch();
        }}
        {...props}
      />
      <RiSearchLine className="text-subtle absolute left-6 h-3 w-3" />
    </div>
  );
}
