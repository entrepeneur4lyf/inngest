import { Button } from '@inngest/components/Button';
import { RiCheckLine, RiFileCopy2Line } from '@remixicon/react';

import type { ButtonAppearance, ButtonSize } from '../Button/Button';

type ButtonCopyProps = {
  code?: string;
  iconOnly?: boolean;
  isCopying: boolean;
  handleCopyClick: (code: string) => void;
  size?: ButtonSize;
  appearance?: ButtonAppearance;
};

export function CopyButton({
  size,
  code,
  iconOnly,
  isCopying,
  handleCopyClick,
  appearance = 'solid',
}: ButtonCopyProps) {
  const icon = isCopying ? <RiCheckLine /> : <RiFileCopy2Line />;
  const label = isCopying ? 'Copied!' : 'Copy';

  return (
    <Button
      disabled={!code}
      size={size}
      kind={isCopying ? 'secondary' : 'primary'}
      onClick={code ? () => handleCopyClick(code) : undefined}
      label={iconOnly ? undefined : label}
      appearance={iconOnly ? 'ghost' : appearance}
      icon={iconOnly && icon}
      title="Click to copy"
      aria-label="Copy"
    />
  );
}
