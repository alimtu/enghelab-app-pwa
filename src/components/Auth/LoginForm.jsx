'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
  ExternalLink,
} from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import http from '../../lib/axios';
import { useAuth } from '../../lib/auth/AuthProvider';
import { LOGIN_OP, REGISTER_URL, FORGOT_PASSWORD_URL } from '../../lib/auth/constants';

/**
 * The credential form itself — no page chrome, so it can live in the login
 * bottom sheet or on a standalone route.
 */
export default function LoginForm({ onSuccess }) {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.trim().length > 0,
    [username, password],
  );

  const loginMutation = useMutation({
    mutationFn: async (credentials) =>
      // Point LOGIN_OP at the real password-login op (see lib/auth/constants)
      // to make this authenticate for real.
      http.get('/', {
        params: { op: LOGIN_OP, ...credentials },
        _returnFullBody: true,
      }),
    onSuccess: (body) => {
      if (body?.success && body?.finger) {
        signIn(body.finger);
        toast.success(body?.message || 'ورود موفقیت‌آمیز بود.');
        onSuccess?.();
      } else {
        toast.error(body?.message || 'نام کاربری یا کلمه عبور نادرست است.');
      }
    },
    onError: (err) => {
      toast.error(err?.message || 'خطا در برقراری ارتباط');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ username: username.trim(), password: password.trim() });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">نام کاربری یا کد ملی</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 text-grey-400" />
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام کاربری خود را وارد کنید"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              className="h-11 pr-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">کلمه عبور</Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 text-grey-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="کلمه عبور خود را وارد کنید"
              autoComplete="current-password"
              className="h-11 pr-10 pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'پنهان کردن کلمه عبور' : 'نمایش کلمه عبور'}
              className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-grey-400 transition-colors hover:text-grey-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
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

        <Button
          type="submit"
          className="h-11 w-full text-sm"
          disabled={!canSubmit || loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            'در حال ورود...'
          ) : (
            <>
              <LogIn className="size-4.5" />
              ورود
            </>
          )}
        </Button>
      </form>

      <div>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-grey-100" />
          <span className="text-xs text-grey-400">حساب کاربری ندارید؟</span>
          <span className="h-px flex-1 bg-grey-100" />
        </div>

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-grey-150 bg-grey-25 px-4 py-3 text-sm font-medium text-primary-600 transition-colors hover:border-primary-200 hover:bg-primary-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
        >
          ثبت‌نام در سامانه فهام
          <ExternalLink className="size-4" />
        </a>
        <p className="mt-2.5 text-center text-xs leading-relaxed text-grey-400">
          برای دریافت حساب کاربری ابتدا در فهام ثبت‌نام کنید، سپس با همان نام کاربری
          و کلمه عبور وارد شوید.
        </p>
      </div>
    </div>
  );
}
