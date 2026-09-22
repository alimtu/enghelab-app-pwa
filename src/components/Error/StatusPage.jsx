/**
 * Full-page state for a route that has nothing else to show: a missing page,
 * a crashed one, a category that does not exist.
 *
 * It renders inside the shell, so the header and bottom bar stay usable and
 * the student can leave without a hard reload. It shares its grammar with
 * AuthGate and MinimalError so the three read as one family.
 *
 * `tone` picks the icon tile: `primary` for "nothing here" states, `danger`
 * for failures. `code` is the small status line above the title (e.g. 404).
 * Action buttons go in `children`.
 */
export default function StatusPage({
  icon: Icon,
  tone = 'primary',
  code,
  title,
  description,
  children,
}) {
  const tile =
    tone === 'danger'
      ? 'bg-danger-50 text-danger-500 ring-1 ring-danger-100'
      : 'bg-primary-100 text-primary-500';

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-8 py-14 text-center">
      <div className={`flex size-16 items-center justify-center rounded-2xl ${tile}`}>
        <Icon className="size-7" strokeWidth={1.75} />
      </div>

      <div className="space-y-1.5">
        {code && <p className="text-xs font-medium text-grey-400">{code}</p>}
        <h1 className="text-sm font-bold text-grey-800">{title}</h1>
        <p className="mx-auto max-w-[18rem] text-xs leading-relaxed text-grey-500">
          {description}
        </p>
      </div>

      {children && (
        <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
      )}
    </div>
  );
}
