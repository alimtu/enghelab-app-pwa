'use client';

import { useState } from 'react';
import { ExternalLink, KeyRound, Smartphone } from 'lucide-react';

import PasswordLogin from './PasswordLogin';
import MobileLogin from './MobileLogin';
import { REGISTER_URL } from '../../lib/auth/constants';

const METHODS = [
  { id: 'password', label: 'نام کاربری', icon: KeyRound },
  { id: 'mobile', label: 'شماره موبایل', icon: Smartphone },
];

/**
 * The credential form itself — no page chrome, so it can live in the login
 * bottom sheet or on the standalone route. Both sign-in methods end the same
 * way: a verified session token handed to AuthProvider.signIn().
 */
export default function LoginForm({ onSuccess }) {
  const [method, setMethod] = useState('password');

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="روش ورود"
        className="flex items-center gap-1 rounded-xl border border-stroke-soft bg-grey-50 p-1"
      >
        {METHODS.map(({ id, label, icon: Icon }) => {
          const active = method === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMethod(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                active
                  ? 'bg-surface text-primary-600 shadow-xs'
                  : 'text-grey-500 hover:text-grey-700'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      {method === 'password' ? (
        <PasswordLogin onSuccess={onSuccess} />
      ) : (
        <MobileLogin onSuccess={onSuccess} />
      )}

      <div>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-stroke-soft" />
          <span className="text-xs text-grey-400">حساب کاربری ندارید؟</span>
          <span className="h-px flex-1 bg-stroke-soft" />
        </div>

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-stroke-soft bg-grey-50 px-4 py-3 text-sm font-medium text-primary-600 transition-colors hover:border-primary-200 hover:bg-primary-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
