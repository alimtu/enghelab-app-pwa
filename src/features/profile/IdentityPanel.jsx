'use client';

import { isBlank } from './profileFields';

/**
 * Who the university thinks you are. It leads the page because everything below
 * it is either a consequence of this identity (locked) or a detail attached to
 * it (editable).
 */
export default function IdentityPanel({ prof }) {
  const fullName = [prof.fname, prof.lname].filter((p) => !isBlank(p)).join(' ').trim();
  const initials =
    [prof.fname?.[0], prof.lname?.[0]].filter(Boolean).join('') || '؟';

  return (
    <div className="overflow-hidden rounded-2xl bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 p-4 text-white">
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-base font-bold ring-1 ring-white/25 backdrop-blur-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight">
            {fullName || 'دانشجوی گرامی'}
          </p>
          {!isBlank(prof.aid) && (
            <p dir="ltr" className="mt-0.5 text-right text-xs text-white/70">
              {prof.aid}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
