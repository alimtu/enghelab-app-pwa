'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react';

const ORDER = ['light', 'dark', 'system'];

const LABELS = {
  light: 'روشن',
  dark: 'تیره',
  system: 'سیستم',
};

const ICONS = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server has no way to know the stored theme, so the icon can't be
  // rendered until after hydration or React reports a mismatch.
  useEffect(() => setMounted(true), []);

  const current = ORDER.includes(theme) ? theme : 'system';
  const Icon = ICONS[current];
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  if (!mounted) {
    // Same box as the real control so the header doesn't shift on hydration.
    return <span className={`size-5 shrink-0 ${className}`} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`نمای ${LABELS[current]} — تغییر به ${LABELS[next]}`}
      aria-label={`تغییر پوسته، اکنون ${LABELS[current]}`}
      className={`flex items-center text-grey-500 hover:text-grey-700 transition-colors cursor-pointer ${className}`}
    >
      <Icon className="size-5" />
    </button>
  );
}
