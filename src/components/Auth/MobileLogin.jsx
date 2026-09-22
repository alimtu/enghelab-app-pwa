'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Smartphone, ArrowRight, ShieldCheck, RotateCw } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import OtpInput from './OtpInput';
import { requestOtp, verifyOtp } from '../../lib/auth/loginApi';
import { useAuth } from '../../lib/auth/AuthProvider';
import { normalizeIranMobile } from '../../lib/utils/digits';
import {
  MOBILE_PATTERN,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
} from '../../lib/auth/constants';

/**
 * Two-step sign-in by phone: request a code, then enter it. The finger handed
 * back by step one only identifies the attempt, so it lives in state here and
 * is never persisted — only a verified session reaches localStorage.
 */
export default function MobileLogin({ onSuccess }) {
  const { signIn } = useAuth();
  const [mobile, setMobile] = useState('');
  const [pendingFinger, setPendingFinger] = useState(null);
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  const mobileValid = useMemo(() => MOBILE_PATTERN.test(normalizeIranMobile(mobile)), [mobile]);
  const codeStep = !!pendingFinger;

  // Resend cooldown.
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Guards against the auto-submit firing twice for the same entry.
  const submitted = useRef(null);
  // Bumped whenever the student abandons an attempt (edits the number or asks
  // for a new code), so a verify still in flight cannot land on the new one.
  const attempt = useRef(0);
  // The form lives in a dismissible sheet; a request that resolves after it is
  // gone must not silently sign anyone in.
  const alive = useRef(true);
  useEffect(() => {
    // Must be re-armed here, not just initialised: React's strict mode runs the
    // cleanup once before the real mount, which would otherwise leave the guard
    // permanently closed and swallow every response.
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const send = useMutation({
    mutationFn: requestOtp,
    // Without this react-query would PAUSE an offline request and silently
    // replay it on reconnect — an SMS the student is no longer expecting.
    networkMode: 'always',
    onSuccess: (finger) => {
      if (!alive.current) return;
      setPendingFinger(finger);
      setCode('');
      setSecondsLeft(OTP_RESEND_SECONDS);
      toast.success('کد تایید ارسال شد.');
    },
    onError: (err) => {
      if (!alive.current) return;
      toast.error(err?.message || 'ارسال کد تایید ناموفق بود.');
    },
  });

  const verify = useMutation({
    mutationFn: verifyOtp,
    networkMode: 'always',
    onSuccess: (finger, variables) => {
      if (!alive.current || variables.attemptId !== attempt.current) return;
      signIn(finger);
      toast.success('ورود موفقیت‌آمیز بود.');
      onSuccess?.();
    },
    onError: (err, variables) => {
      if (!alive.current || variables.attemptId !== attempt.current) return;
      setCode('');
      // Let the same code be retried — the guard only exists to stop the
      // auto-submit firing twice for one entry.
      submitted.current = null;
      toast.error(err?.message || 'کد وارد شده نادرست است.');
    },
  });

  const submitCode = (value) => {
    if (value.length !== OTP_LENGTH || verify.isPending) return;
    if (submitted.current === value) return;
    submitted.current = value;
    verify.mutate({ finger: pendingFinger, code: value, attemptId: attempt.current });
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!mobileValid || send.isPending) return;
    send.mutate({ mobile: normalizeIranMobile(mobile) });
  };

  if (!codeStep) {
    return (
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <Label htmlFor="mobile">شماره موبایل</Label>
          <div className="relative">
            <Smartphone className="pointer-events-none absolute right-3 top-1/2 size-4.5 -translate-y-1/2 text-grey-400" />
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={mobile}
              onChange={(e) => setMobile(normalizeIranMobile(e.target.value))}
              placeholder="09xxxxxxxxx"
              autoComplete="tel"
              className="h-11 pr-10 text-left"
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-grey-400">
            کد تایید به این شماره پیامک می‌شود.
          </p>
        </div>

        <Button
          type="submit"
          className="h-11 w-full text-sm"
          disabled={!mobileValid || send.isPending}
        >
          {send.isPending ? (
            'در حال ارسال...'
          ) : (
            <>
              <ShieldCheck className="size-4.5" />
              دریافت کد تایید
            </>
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs leading-relaxed text-grey-500">
          کد {OTP_LENGTH} رقمی ارسال‌شده به شماره زیر را وارد کنید
        </p>
        <p dir="ltr" className="mt-1 text-sm font-bold text-grey-800">
          {normalizeIranMobile(mobile)}
        </p>
      </div>

      <OtpInput
        length={OTP_LENGTH}
        value={code}
        onChange={setCode}
        onComplete={submitCode}
        disabled={verify.isPending}
        autoFocus
      />

      <Button
        type="button"
        onClick={() => submitCode(code)}
        className="h-11 w-full text-sm"
        disabled={code.length !== OTP_LENGTH || verify.isPending}
      >
        {verify.isPending ? 'در حال بررسی...' : 'تایید و ورود'}
      </Button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={verify.isPending}
          onClick={() => {
            attempt.current += 1;
            setPendingFinger(null);
            setCode('');
            submitted.current = null;
          }}
          className="flex items-center gap-1 text-xs text-grey-500 transition-colors hover:text-primary-600 disabled:opacity-50"
        >
          <ArrowRight className="size-3.5" />
          ویرایش شماره
        </button>

        {secondsLeft > 0 ? (
          <span className="text-xs text-grey-400">
            ارسال مجدد تا {secondsLeft} ثانیه دیگر
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              attempt.current += 1;
              submitted.current = null;
              setCode('');
              send.mutate({ mobile: normalizeIranMobile(mobile) });
            }}
            disabled={send.isPending || verify.isPending}
            className="flex items-center gap-1 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 disabled:opacity-50"
          >
            <RotateCw className="size-3.5" />
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  );
}
