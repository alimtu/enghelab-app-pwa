'use client';

export default function SettingRow({ title, hint, children }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="mb-2">
        <p className="text-sm font-medium text-grey-800">{title}</p>
        {hint && <p className="mt-0.5 text-xs text-grey-500">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingGroup({ title, children }) {
  return (
    <section className="rounded-2xl border border-stroke bg-surface p-4">
      <h2 className="mb-1 text-xs font-bold text-grey-500">{title}</h2>
      <div className="divide-y divide-stroke-soft">{children}</div>
    </section>
  );
}
