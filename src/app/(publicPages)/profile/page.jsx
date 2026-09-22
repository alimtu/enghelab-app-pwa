'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon,
  SaveIcon,
  LogOutIcon,
  UserRoundIcon,
  SlidersHorizontalIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import MinimalError from '../../../components/Error/MinimalError';
import ProfilePageSkeleton from '../../../components/Skeleton/ProfilePageSkeleton';
import AuthGate from '../../../components/Auth/AuthGate';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import IdentityPanel from '../../../features/profile/IdentityPanel';
import LockedRow from '../../../features/profile/LockedRow';
import {
  IDENTITY_FIELDS,
  CONTACT_FIELDS,
  isBlank,
} from '../../../features/profile/profileFields';
import useProfile, { useUpdateProfile } from '../../../lib/hooks/useProfile';
import { useAuth } from '../../../lib/auth/AuthProvider';

export default function ProfilePage() {
  return (
    <AuthGate
      icon={UserRoundIcon}
      title="حساب کاربری شما"
      description="برای دیدن و ویرایش اطلاعات دانشجویی، وارد حساب خود شوید."
    >
      <ProfileContent />
    </AuthGate>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data, isLoading, error, refetch } = useProfile();
  const updateMutation = useUpdateProfile();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const prof = data?.prof;

  // Identity fields already on record are permanent; empty ones may still be
  // filled in once. This split drives the whole layout.
  const { locked, fillable } = useMemo(() => {
    if (!prof) return { locked: [], fillable: [] };
    return {
      locked: IDENTITY_FIELDS.filter((f) => !isBlank(prof[f.key])),
      fillable: IDENTITY_FIELDS.filter((f) => isBlank(prof[f.key])),
    };
  }, [prof]);

  const editable = useMemo(() => [...fillable, ...CONTACT_FIELDS], [fillable]);

  useEffect(() => {
    if (!prof) return;
    const initial = {};
    editable.forEach(({ key }) => {
      initial[key] = isBlank(prof[key]) ? '' : String(prof[key]);
    });
    setForm(initial);
  }, [prof, editable]);

  if (isLoading) return <ProfilePageSkeleton />;
  if (error) return <MinimalError onRetry={refetch} />;
  if (!prof) {
    return <div className="p-8 text-center text-sm text-grey-400">اطلاعات کاربری یافت نشد.</div>;
  }

  const setValue = (field, raw) => {
    const value = field.normalize ? field.normalize(raw) : raw;
    setForm((prev) => ({ ...prev, [field.key]: value }));
    if (errors[field.key]) setErrors((prev) => ({ ...prev, [field.key]: null }));
  };

  const handleSave = () => {
    const updates = {};
    const nextErrors = {};

    editable.forEach((field) => {
      const value = (form[field.key] ?? '').trim();
      const original = isBlank(prof[field.key]) ? '' : String(prof[field.key]);
      if (value === original) return;

      // A one-time field is worth validating hard: it cannot be corrected later.
      if (field.validate && value) {
        const message = field.validate(value);
        if (message) {
          nextErrors[field.key] = message;
          return;
        }
      }
      updates[field.key] = value;
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (Object.keys(updates).length === 0) {
      toast.info('تغییری برای ذخیره وجود ندارد.');
      return;
    }

    updateMutation.mutate(updates, {
      onSuccess: (body) => toast.success(body?.message || 'اطلاعات ذخیره شد.'),
      onError: (err) => toast.error(err?.message || 'ذخیره اطلاعات انجام نشد.'),
    });
  };

  const handleSignOut = () => {
    signOut();
    toast.success('از حساب خود خارج شدید.');
    router.replace('/');
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="بازگشت"
          className="rounded-md text-grey-500 transition-colors hover:text-grey-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <ArrowRightIcon className="size-5" />
        </button>
        <h1 className="text-sm font-bold text-grey-800">حساب کاربری</h1>
      </div>

      <IdentityPanel prof={prof} />

      {locked.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium text-grey-500">اطلاعات هویتی</h2>
          <div className="divide-y divide-stroke-soft rounded-2xl border border-stroke-soft bg-surface">
            {locked.map((field) => (
              <LockedRow
                key={field.key}
                label={field.label}
                value={String(prof[field.key])}
                dir={field.dir}
              />
            ))}
          </div>
          <p className="px-1 text-xs leading-relaxed text-grey-400">
            این اطلاعات ثبت شده‌اند و قابل تغییر نیستند. برای اصلاح آن‌ها با آموزش
            دانشگاه تماس بگیرید.
          </p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xs font-medium text-grey-500">اطلاعات تماس</h2>

        {editable.map((field) => {
          const oneTime = fillable.includes(field);
          const message = errors[field.key];

          return (
            <div key={field.key}>
              <Label htmlFor={field.key} className="text-xs font-normal text-grey-500">
                {field.label}
              </Label>

              {field.multiline ? (
                <Textarea
                  id={field.key}
                  value={form[field.key] || ''}
                  onChange={(e) => setValue(field, e.target.value)}
                  rows={3}
                  className="mt-1"
                  aria-invalid={!!message}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type || 'text'}
                  dir={field.dir || 'rtl'}
                  inputMode={field.inputMode}
                  maxLength={field.maxLength}
                  value={form[field.key] || ''}
                  onChange={(e) => setValue(field, e.target.value)}
                  className="mt-1"
                  aria-invalid={!!message}
                  aria-describedby={message ? `${field.key}-error` : undefined}
                />
              )}

              {oneTime && (
                <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-warning-700">
                  <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
                  پس از ذخیره، این مقدار قابل تغییر نخواهد بود.
                </p>
              )}

              {message && (
                <p id={`${field.key}-error`} className="mt-1.5 text-xs text-danger-500">
                  {message}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <div className="space-y-3">
        <Button className="h-11 w-full" onClick={handleSave} disabled={updateMutation.isPending}>
          <SaveIcon className="size-4" />
          {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>

        {/* Secondary entry point. It can never be the only one: this page is
            behind AuthGate, and display settings must work signed out. */}
        <Button variant="outline" className="h-11 w-full" onClick={() => router.push('/settings')}>
          <SlidersHorizontalIcon className="size-4" />
          تنظیمات نمایش
        </Button>

        <Button
          variant="outline"
          className="h-11 w-full border-danger-100 text-danger-500 hover:bg-danger-50"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-4" />
          خروج از حساب
        </Button>
      </div>
    </div>
  );
}
