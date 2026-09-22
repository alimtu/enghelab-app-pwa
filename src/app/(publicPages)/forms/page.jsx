'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpenIcon } from 'lucide-react';

import AuthGate from '../../../components/Auth/AuthGate';
import MinimalError from '../../../components/Error/MinimalError';
import GroupGridSkeleton from '../../../features/forms/GroupGridSkeleton';
import useFormGroups from '../../../features/forms/useFormGroups';
import { getSection } from '../../../lib/navigation/sections';

export default function FormsPage() {
  const section = getSection('forms');

  return (
    <AuthGate
      title="فرم‌ها پس از ورود در دسترس‌اند"
      description="فهرست دسته‌بندی فرم‌ها به حساب دانشجویی شما وابسته است."
      icon={section?.icon}
    >
      <FormGroups />
    </AuthGate>
  );
}

function FormGroups() {
  const router = useRouter();
  const { groups, isLoading, error, refetch } = useFormGroups();

  if (isLoading) return <GroupGridSkeleton />;
  if (error) return <MinimalError onRetry={refetch} />;

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm text-grey-400">دسته‌بندی‌ای برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-base font-bold text-grey-800">دسته‌بندی فرم‌ها</h1>
        <p className="mt-0.5 text-xs leading-relaxed text-grey-500">
          دسته مورد نظر را انتخاب کنید تا فرم‌های آن نمایش داده شود.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {groups.map((group) => (
          <GroupCard
            key={group.idg}
            group={group}
            onClick={() => router.push(`/forms/${group.idg}`)}
          />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, onClick }) {
  // Titles arrive from the API with stray leading spaces.
  const title = (group.title || '').trim();
  // Several categories point at an image the backend cannot serve — it answers
  // 200 with a tiny HTML error body — so a broken image must degrade to the
  // icon rather than leaving an empty tile.
  const [imageOk, setImageOk] = useState(true);
  const showImage = !!group.img && imageOk;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stroke-soft bg-surface text-right transition-all hover:border-primary-200 active:scale-[0.98]"
    >
      <div className="relative flex h-24 w-full items-center justify-center overflow-hidden bg-primary-100/50">
        {showImage ? (
          // Category art is arbitrary remote media, so a plain <img> avoids
          // configuring next/image for every future category host.
          <img
            src={group.img}
            alt=""
            loading="lazy"
            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageOk(false)}
          />
        ) : (
          <FolderOpenIcon className="size-7 text-primary-500" strokeWidth={1.5} />
        )}
      </div>

      <div className="w-full p-3">
        <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-grey-800">
          {title}
        </p>
      </div>
    </button>
  );
}
