'use client';

import { LockKeyholeIcon } from 'lucide-react';

/**
 * A value that cannot change renders as a row, not a disabled input — a greyed
 * out field reads as something temporarily broken, while a row reads as a fact.
 */
export default function LockedRow({ label, value, dir = 'ltr' }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="shrink-0 text-xs text-grey-500">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span dir={dir} className="truncate text-sm font-semibold text-grey-800">
          {value}
        </span>
        <LockKeyholeIcon className="size-3.5 shrink-0 text-grey-400" aria-hidden="true" />
      </span>
    </div>
  );
}
