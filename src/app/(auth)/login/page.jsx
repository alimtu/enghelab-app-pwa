'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight } from 'lucide-react';

import LoginForm from '../../../components/Auth/LoginForm';

/**
 * Standalone login route. Inside the app, signing in happens in the login
 * bottom sheet — this page exists for deep links and for the PWA's precached
 * offline entry point.
 */
export default function LoginPage() {
  const router = useRouter();

  return (
    <div dir="rtl" className="relative flex min-h-dvh flex-col overflow-hidden bg-surface">
      <div className="relative overflow-hidden bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 px-6 pb-20 pt-14 text-white">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 opacity-[0.18]"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="65" stroke="white" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="52" stroke="var(--color-secondary-500)" strokeWidth="2" />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mb-6 flex items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white"
          >
            <ArrowRight className="size-4" />
            بازگشت به سامانه
          </button>

          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
            <GraduationCap className="size-7" strokeWidth={1.75} />
          </div>

          <p className="mt-6 text-sm font-medium text-white/80">خوش آمدید</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight">ورود به سامانه</h1>
          <p className="mt-1.5 text-sm text-white/75">سامانه جامع پژوهش و فناوری</p>
        </div>
      </div>

      <div className="relative z-10 -mt-8 flex-1 rounded-t-4xl bg-surface px-6 pb-10 pt-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        {/* LayoutShell redirects signed-in visitors away from /login, so the
            form doesn't navigate on its own. */}
        <LoginForm />
      </div>
    </div>
  );
}
