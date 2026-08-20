'use client';

import { LockKeyhole, LogIn } from 'lucide-react';

import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth/AuthProvider';

/**
 * Wraps a section that needs a signed-in student. Guests get an explanation and
 * a login button that opens the login sheet in place — never a redirect, so
 * they keep their spot in the app.
 */
export default function AuthGate({
  title = 'برای این بخش باید وارد شوید',
  description = 'این بخش به حساب کاربری دانشگاه نیاز دارد.',
  icon: Icon = LockKeyhole,
  children,
}) {
  const { isAuthenticated, ready, openLogin } = useAuth();

  if (!ready) return null;
  if (isAuthenticated) return children;

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-14 text-center">
      <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-500">
        <Icon className="size-7" strokeWidth={1.75} />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-bold text-grey-800">{title}</p>
        <p className="mx-auto max-w-[16rem] text-xs leading-relaxed text-grey-500">
          {description}
        </p>
      </div>

      <Button onClick={() => openLogin(description)} className="h-10 px-6">
        <LogIn className="size-4" />
        ورود به حساب
      </Button>
    </div>
  );
}
