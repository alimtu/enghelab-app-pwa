'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, LogInIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import QuickAccess from '../../features/forms/QuickAccess';
import HeroSlider from '../../features/gallery/HeroSlider';
import Greeting from '../../features/home/Greeting';
import { useAuth } from '../../lib/auth/AuthProvider';
import useVersionData from '../../lib/hooks/useVersionData';
import { AREAS, AREA_ACCOUNT, getSectionsByArea } from '../../lib/navigation/sections';

// Sections that bring their own block to the hub (the slider, the quick-access
// row) instead of appearing as a card in their area.
const OWN_BLOCK = new Set(['gallery', 'forms']);

/**
 * The university hub, built for the student who opens it: a greeting, the
 * gallery, the tasks they come back for, then everything else the section
 * registry contains, grouped by area — so sections that have nothing to do
 * with forms appear here on the same footing as the form-based ones.
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, ready, openLogin } = useAuth();
  const { data: versionData, isLoading: versionLoading } = useVersionData();

  return (
    <div className="space-y-6 p-4">
      <Greeting />

      <HeroSlider images={versionData?.images || []} loading={versionLoading} />

      {/* Signed in, the student's tasks; signed out, the step that unlocks them. */}
      {ready && (isAuthenticated ? <QuickAccess /> : <SignInCard onSignIn={() => openLogin()} />)}

      {AREAS.map((area) => {
        const sections = getSectionsByArea(area.id).filter(
          (section) => !OWN_BLOCK.has(section.id) && (!section.requiresAuth || isAuthenticated),
        );
        if (sections.length === 0) return null;

        // Account tools sit side by side as tiles — unless only one is
        // available (signed out), where a lone tile in a grid looks stranded.
        const tiled = area.id === AREA_ACCOUNT && sections.length > 1;

        return (
          <section key={area.id} className="space-y-3">
            <h2 className="text-sm font-semibold text-grey-800">{area.title}</h2>
            {tiled ? (
              <div className="grid grid-cols-3 gap-3">
                {sections.map((section) => (
                  <SectionTile
                    key={section.id}
                    section={section}
                    onClick={() => router.push(section.href)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onClick={() => router.push(section.href)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function SignInCard({ onSignIn }) {
  return (
    <section
      aria-label="ورود به حساب"
      className="rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 p-4 text-white shadow-lg shadow-primary-500/20"
    >
      <p className="text-sm font-bold">ورود به حساب دانشجویی</p>
      <p className="mt-1 text-xs leading-relaxed text-white/80">
        فرم‌ها، پروفایل و گزارش‌های شما پس از ورود در دسترس‌اند.
      </p>
      <Button
        size="sm"
        onClick={onSignIn}
        className="mt-3 bg-white text-primary-600 hover:bg-white/90"
      >
        <LogInIcon className="size-3.5" />
        ورود
      </Button>
    </section>
  );
}

/** Compact square for the account area, where three tools sit side by side. */
function SectionTile({ section, onClick }) {
  const { title, icon: Icon } = section;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl border border-stroke-soft bg-surface px-2 py-3 outline-none transition-all hover:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-300 active:scale-[0.98]"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="line-clamp-2 text-center text-[11px] font-semibold leading-snug text-grey-800">
        {title}
      </span>
    </button>
  );
}

/** Full-width row for every other area, where a description earns its space. */
function SectionCard({ section, onClick }) {
  const { title, description, icon: Icon } = section;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-stroke-soft bg-surface p-4 text-right outline-none transition-all hover:border-primary-200 focus-visible:ring-2 focus-visible:ring-primary-300 active:scale-[0.98]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-grey-800">{title}</p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-grey-500">{description}</p>
        )}
      </div>
      <ChevronLeftIcon className="size-4 shrink-0 text-grey-300" />
    </button>
  );
}
