'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InboxIcon, LayoutGridIcon, ListIcon, LockKeyholeIcon } from 'lucide-react';

import FormGenerator from '../../components/FormGenerator/FormGenerator';
import { useHideBottomNav } from '../../components/AppComponents/BottomNav';
import { Divider } from '../../components/ui/divider';
import { useAuth } from '../../lib/auth/AuthProvider';
import { usePendingCount } from '../../lib/hooks/usePendingSubmissions';
import useFormLayout, { LAYOUT_GRID, LAYOUT_LIST } from './useFormLayout';

/**
 * The body shared by the form-based sections (currently نظرسنجی and شکایت).
 * Everyone can see which forms exist; opening one requires an account.
 */
export default function FormsBrowser({ title, description, icon: Icon, forms, loginReason }) {
  const router = useRouter();
  const { isAuthenticated, ready, requireAuth } = useAuth();
  const pendingCount = usePendingCount();
  const { layout, setLayout } = useFormLayout();
  const [activeForm, setActiveForm] = useState(null);

  // FormFlow brings its own fixed bottom action bar.
  useHideBottomNav(!!activeForm);

  const handleSelect = (form) => {
    if (!form) {
      setActiveForm(null);
      return;
    }
    requireAuth(() => setActiveForm(form), loginReason);
  };

  const locked = ready && !isAuthenticated;

  return (
    <div>
      {!activeForm && (
        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-grey-800">{title}</h1>
                <p className="mt-0.5 text-xs leading-relaxed text-grey-500">{description}</p>
              </div>
            </div>

            {/* The offline queue only ever holds forms, so it lives here. */}
            <button
              type="button"
              onClick={() => router.push('/pending')}
              aria-label="صف ارسال"
              className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-stroke-soft text-grey-500 transition-colors hover:border-primary-200 hover:text-primary-600"
            >
              <InboxIcon className="size-4.5" />
              {pendingCount > 0 && (
                <span className="absolute -left-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {locked && (
            <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-100/40 px-3 py-2.5">
              <LockKeyholeIcon className="size-4 shrink-0 text-primary-600" />
              <p className="flex-1 text-xs leading-relaxed text-grey-600">
                برای تکمیل فرم‌ها وارد حساب دانشجویی خود شوید.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <Divider label={`${forms.length} فرم`} className="my-0 flex-1" />

            {/* Signed-in students choose how the tiles are arranged. */}
            {isAuthenticated && (
              <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-stroke-soft p-0.5">
                <LayoutOption
                  active={layout === LAYOUT_LIST}
                  onClick={() => setLayout(LAYOUT_LIST)}
                  label="نمایش فهرستی"
                  icon={ListIcon}
                />
                <LayoutOption
                  active={layout === LAYOUT_GRID}
                  onClick={() => setLayout(LAYOUT_GRID)}
                  label="نمایش شبکه‌ای"
                  icon={LayoutGridIcon}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className={activeForm ? '' : 'px-4 pb-4'}>
        <FormGenerator
          forms={forms}
          activeForm={activeForm}
          onSelectForm={handleSelect}
          layout={isAuthenticated ? layout : LAYOUT_LIST}
          locked={locked}
        />
      </div>
    </div>
  );
}

function LayoutOption({ active, onClick, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex size-7 items-center justify-center rounded-md transition-colors ${
        active ? 'bg-primary-100 text-primary-600' : 'text-grey-400 hover:text-grey-600'
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}
