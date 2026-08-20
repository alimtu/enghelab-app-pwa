'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getNavSections } from '../../lib/navigation/sections';

// Pages with their own bottom action bar (e.g. FormFlow) hide the nav through
// this context instead of z-index fights.
const BottomNavContext = createContext({ hidden: false, setHidden: () => {} });

export function BottomNavProvider({ children }) {
  const [hidden, setHidden] = useState(false);
  const value = useMemo(() => ({ hidden, setHidden }), [hidden]);
  return <BottomNavContext.Provider value={value}>{children}</BottomNavContext.Provider>;
}

export function useHideBottomNav(hidden) {
  const { setHidden } = useContext(BottomNavContext);
  useEffect(() => {
    setHidden(hidden);
    return () => setHidden(false);
  }, [hidden, setHidden]);
}

export default function BottomNav() {
  const { hidden } = useContext(BottomNavContext);
  const pathname = usePathname();
  const router = useRouter();

  // Which sections appear here is decided by the section registry, so a new
  // area of the app can join the navigation without touching this component.
  const items = getNavSections();

  if (hidden) return null;

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center"
    >
      <div className="w-full max-w-[480px] border-t border-stroke-soft bg-surface/95 backdrop-blur-sm safe-bottom">
        <div
          className="grid items-end"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((item) => {
            const active = pathname === item.href;
            const Item = item.nav.slot === 'center' ? CenterItem : SideItem;
            return (
              <Item
                key={item.id}
                item={item}
                active={active}
                onClick={() => router.push(item.href)}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function SideItem({ item, active, onClick }) {
  const { title, icon: Icon } = item;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="group flex flex-col items-center gap-1 pb-2 pt-2.5 outline-none"
    >
      {/* The ring lives on the icon because the button itself suppresses its
          outline; without this, keyboard focus would be invisible here. */}
      <span className="flex size-7 items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-primary-300">
        <Icon
          className={`size-5 transition-colors duration-200 ${
            active ? 'text-primary-600' : 'text-grey-400 group-hover:text-grey-600'
          }`}
          strokeWidth={active ? 2.25 : 2}
        />
      </span>
      <span
        className={`text-[10px] transition-colors duration-200 ${
          active ? 'font-bold text-primary-600' : 'font-medium text-grey-400 group-hover:text-grey-600'
        }`}
      >
        {title}
      </span>
      <span
        className={`h-0.5 w-6 rounded-full transition-colors duration-200 ${
          active ? 'bg-primary-500' : 'bg-transparent'
        }`}
      />
    </button>
  );
}

/**
 * The raised centre slot. It belongs to the app as a whole — the hub every
 * section is reached from — rather than to any one feature, so that adding
 * sections never makes the wrong thing look like the app's purpose.
 */
function CenterItem({ item, active, onClick }) {
  const { title, icon: Icon } = item;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="group flex flex-col items-center gap-1 pb-2 outline-none"
    >
      <span
        className={`-mt-6 flex size-14 items-center justify-center rounded-full ring-4 ring-surface transition-all duration-200 group-active:scale-95 group-focus-visible:ring-primary-300 ${
          active
            ? 'bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30'
            : 'bg-linear-to-br from-primary-400 to-primary-500 shadow-md'
        }`}
      >
        <Icon className="size-6 text-white" strokeWidth={2} />
      </span>
      <span
        className={`text-[10px] transition-colors duration-200 ${
          active ? 'font-bold text-primary-600' : 'font-medium text-grey-500'
        }`}
      >
        {title}
      </span>
    </button>
  );
}
