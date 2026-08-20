'use client';

import { ChevronLeftIcon, ClipboardListIcon, LockKeyholeIcon } from 'lucide-react';
import FormFlow from './FormFlow';
import { LAYOUT_GRID } from '../../features/forms/useFormLayout';

export default function FormGenerator({
  forms,
  activeForm,
  onSelectForm,
  layout = 'list',
  locked = false,
}) {
  if (!forms || forms.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-grey-400">فرمی برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  if (activeForm) {
    return <FormFlow form={activeForm} onBack={() => onSelectForm(null)} />;
  }

  const isGrid = layout === LAYOUT_GRID;

  return (
    <div className={isGrid ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
      {forms.map((form) => {
        const stepCount = form.steps?.length || 0;

        return (
          <button
            key={form.formId}
            type="button"
            onClick={() => onSelectForm(form)}
            className={`group relative flex w-full rounded-xl border border-stroke-soft bg-surface text-right transition-all hover:border-primary-200 active:scale-[0.98] ${
              isGrid ? 'flex-col gap-2 p-3' : 'items-center gap-3 p-4'
            }`}
          >
            <div
              className={`flex shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 ${
                isGrid ? 'size-9' : 'size-10'
              }`}
            >
              <ClipboardListIcon className={isGrid ? 'size-4.5' : 'size-5'} />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`font-semibold text-grey-800 ${
                  isGrid ? 'line-clamp-2 text-xs leading-relaxed' : 'truncate text-sm'
                }`}
              >
                {form.title}
              </p>
              {!isGrid && form.description && (
                <p className="mt-0.5 truncate text-xs text-grey-500">{form.description}</p>
              )}
              <p className="mt-0.5 text-xs text-grey-400">{stepCount} مرحله</p>
            </div>

            {locked ? (
              <span
                title="برای تکمیل این فرم وارد شوید"
                className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 ${
                  isGrid ? 'absolute left-2 top-2' : ''
                }`}
              >
                <LockKeyholeIcon className="size-3.5" />
              </span>
            ) : (
              !isGrid && <ChevronLeftIcon className="size-4 shrink-0 text-grey-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}
