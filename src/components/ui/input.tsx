import * as React from 'react';

import { cn } from '@/lib/utils/index';
import { toEnglishDigits } from '@/lib/utils/digits';

type InputProps = React.ComponentProps<'input'> & {
  /** Fold Persian/Arabic digits to ASCII as the user types. Off for secrets,
   *  whose characters must reach the server exactly as entered. */
  normalizeDigits?: boolean;
};

function Input({ className, type, onChange, normalizeDigits = true, ...props }: InputProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (normalizeDigits) e.target.value = toEnglishDigits(e.target.value);
      onChange?.(e);
    },
    [onChange, normalizeDigits],
  );

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:text-grey-400 flex h-10 w-full min-w-0 rounded-lg border border-stroke bg-surface px-3 py-2 text-sm shadow-xs transition-all outline-none',
        'focus:border-primary-400 focus:ring-1 focus:ring-primary-200',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger-400 aria-invalid:ring-1 aria-invalid:ring-danger-100',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}

export { Input };
