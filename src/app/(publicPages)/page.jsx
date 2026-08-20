'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, LogInIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '../../lib/auth/AuthProvider';
import useVersionData from '../../lib/hooks/useVersionData';
import { AREAS, getSectionsByArea } from '../../lib/navigation/sections';
import sampleForms, { getFormsByCategory } from '../../features/forms/sampleForms';

/**
 * The university hub. It lists whatever the section registry contains, grouped
 * by area, so sections that have nothing to do with forms appear here on the
 * same footing as the form-based ones.
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, ready, openLogin } = useAuth();
  const { data: versionData } = useVersionData();

  // How many items each section currently holds. Sections that can't express a
  // count simply don't show one.
  const counts = {
    survey: getFormsByCategory('survey', sampleForms).length,
    complaints: getFormsByCategory('complaint', sampleForms).length,
    gallery: versionData?.images?.length || 0,
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <p className="text-xs text-grey-500">سامانه دانشجویی</p>
        <h1 className="mt-0.5 text-lg font-bold text-grey-800">
          {versionData?.name || 'دانشگاه جامع انقلاب اسلامی'}
        </h1>
      </div>

      {ready && !isAuthenticated && (
        <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-100/40 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-grey-800">وارد حساب دانشجویی شوید</p>
            <p className="mt-0.5 text-xs leading-relaxed text-grey-500">
              برخی بخش‌ها مانند تکمیل فرم‌ها به حساب کاربری نیاز دارند.
            </p>
          </div>
          <Button size="sm" onClick={() => openLogin()} className="shrink-0">
            <LogInIcon className="size-3.5" />
            ورود
          </Button>
        </div>
      )}

      {AREAS.map((area) => {
        const sections = getSectionsByArea(area.id).filter(
          (section) => !section.requiresAuth || isAuthenticated,
        );
        if (sections.length === 0) return null;

        return (
          <section key={area.id} className="space-y-2">
            <h2 className="text-xs font-medium text-grey-500">{area.title}</h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  count={counts[section.id]}
                  onClick={() => router.push(section.href)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SectionCard({ section, count, onClick }) {
  const { title, description, icon: Icon } = section;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-stroke-soft bg-surface p-4 text-right transition-all hover:border-primary-200 active:scale-[0.98]"
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
      {count != null && count > 0 && (
        <span className="shrink-0 rounded-full bg-grey-50 px-2 py-0.5 text-xs font-medium text-grey-500">
          {count}
        </span>
      )}
      <ChevronLeftIcon className="size-4 shrink-0 text-grey-300" />
    </button>
  );
}
