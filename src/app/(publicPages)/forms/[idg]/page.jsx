'use client';

import { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ArrowRightIcon, ClipboardListIcon } from 'lucide-react';

import AuthGate from '../../../../components/Auth/AuthGate';
import MinimalError from '../../../../components/Error/MinimalError';
import HomePageSkeleton from '../../../../components/Skeleton/HomePageSkeleton';
import FormsBrowser from '../../../../features/forms/FormsBrowser';
import useFormGroups from '../../../../features/forms/useFormGroups';
import useGroupForms from '../../../../features/forms/useGroupForms';

export default function GroupFormsPage({ params }) {
  const { idg } = use(params);

  return (
    <AuthGate
      title="فرم‌ها پس از ورود در دسترس‌اند"
      description="برای مشاهده و تکمیل فرم‌های این دسته وارد حساب دانشجویی خود شوید."
      icon={ClipboardListIcon}
    >
      <GroupForms idg={idg} />
    </AuthGate>
  );
}

function GroupForms({ idg }) {
  const router = useRouter();
  const { forms, isLoading, error, refetch } = useGroupForms(idg);
  // The category list is already cached, so the title costs no extra request.
  const { groups, isSuccess: groupsLoaded } = useFormGroups();
  const group = groups.find((g) => String(g.idg) === String(idg));
  const title = (group?.title || '').trim() || 'فرم‌ها';

  // An id missing from the student's category list is a dead link, not an
  // empty category: hand it to this segment's not-found page. Waits for the
  // list so a slow network never 404s a real category.
  if (groupsLoaded && !group) notFound();

  if (isLoading) return <HomePageSkeleton />;
  if (error) return <MinimalError onRetry={refetch} />;

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push('/forms')}
        className="flex items-center gap-1.5 px-4 pt-4 text-xs text-grey-500 transition-colors hover:text-primary-600"
      >
        <ArrowRightIcon className="size-3.5" />
        دسته‌بندی‌ها
      </button>

      <FormsBrowser
        title={title}
        description={`${forms.length} فرم در این دسته`}
        icon={ClipboardListIcon}
        forms={forms}
        loginReason="برای تکمیل این فرم باید وارد حساب دانشجویی خود شوید."
      />
    </div>
  );
}
