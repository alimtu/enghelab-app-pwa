'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { UserRound, LockKeyhole, Eye, EyeOff, LogIn } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { loginWithPassword } from '../../lib/auth/loginApi';
import { useAuth } from '../../lib/auth/AuthProvider';
import { FORGOT_PASSWORD_URL } from '../../lib/auth/constants';

/** Sign in with the credentials issued by the Feham system. */
export default function PasswordLogin({ onSuccess }) {
  const { signIn } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const canSubmit = useMemo(
    () => user.trim().length > 0 && pass.trim().length > 0,
    [user, pass],
  );

  const login = useMutation({
    mutationFn: loginWithPassword,
    onSuccess: (finger) => {
      signIn(finger);
      toast.success('ورود موفقیت‌آمیز بود.');
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.message || 'نام کاربری یا کلمه عبور نادرست است.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || login.isPending) return;
    login.mutate({ user: user.trim(), pass: pass.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="user">نام کاربری یا کد ملی</Label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 text-grey-400" />
          <Input
            id="user"
            name="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="نام کاربری خود را وارد کنید"
            autoComplete="username"
            autoCapitalize="off"
            autoCorrect="off"
            className="h-11 pr-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pass">کلمه عبور</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 text-grey-400" />
          <Input
            id="pass"
            name="password"
            type={showPass ? 'text' : 'password'}
            normalizeDigits={false}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="کلمه عبور خود را وارد کنید"
            autoComplete="current-password"
            className="h-11 pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? 'پنهان کردن کلمه عبور' : 'نمایش کلمه عبور'}
            className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-grey-400 transition-colors hover:text-grey-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {showPass ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
        <a
          href={FORGOT_PASSWORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-grey-500 transition-colors hover:text-primary-600"
        >
          فراموشی کلمه عبور؟
        </a>
      </div>

      <Button type="submit" className="h-11 w-full text-sm" disabled={!canSubmit || login.isPending}>
        {login.isPending ? (
          'در حال ورود...'
        ) : (
          <>
            <LogIn className="size-4.5" />
            ورود
          </>
        )}
      </Button>
    </form>
  );
}
