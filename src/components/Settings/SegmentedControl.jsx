'use client';

import { RadioGroup } from 'radix-ui';
import { cn } from '../../lib/utils';

/**
 * Segmented picker built on Radix RadioGroup, so it is a real radiogroup with
 * real radios: arrow-key roving focus and "2 of 3" announcements come for free.
 * A row of plain buttons with role="radiogroup" would announce an empty group.
 */
export default function SegmentedControl({
  value,
  onValueChange,
  options,
  ariaLabel,
  disabled = false,
}) {
  return (
    <RadioGroup.Root
      dir="rtl"
      value={String(value)}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      disabled={disabled}
      loop
      className={cn(
        'grid gap-1 rounded-xl bg-grey-25 p-1',
        disabled && 'opacity-50'
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => (
        <RadioGroup.Item
          key={o.value}
          value={String(o.value)}
          // 44px min target: the existing header icons and the old
          // FontSizeControl's 32px buttons both miss WCAG 2.5.8.
          className={cn(
            'min-h-11 rounded-lg px-2 text-xs font-medium transition-colors cursor-pointer',
            'text-grey-600 hover:text-grey-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
            'data-[state=checked]:bg-surface data-[state=checked]:text-primary-600',
            'data-[state=checked]:ring-1 data-[state=checked]:ring-grey-200',
            'data-[state=checked]:shadow-xs data-[state=checked]:font-bold'
          )}
        >
          {o.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
