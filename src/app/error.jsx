'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon, RefreshCwIcon, TriangleAlertIcon } from 'lucide-react';

import StatusPage from '../components/Error/StatusPage';
import { Button } from '../components/ui/button';

/**
 * Catches a render error anywhere below the root layout. The shell survives,
 * so the student can retry just the broken segment or navigate away.
 *
 * Data-fetch failures never reach here: pages handle those in place with
 * MinimalError. This is for genuine crashes.
 */
export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={TriangleAlertIcon}
      tone="danger"
      title="مشکلی پیش آمد"
      description="در نمایش این صفحه خطایی رخ داد. دوباره تلاش کنید یا به خانه برگردید."
    >
      <Button className="h-10 px-5" onClick={() => reset()}>
        <RefreshCwIcon className="size-4" />
        تلاش مجدد
      </Button>
      <Button asChild variant="outline" className="h-10 px-5">
        <Link href="/">
          <HomeIcon className="size-4" />
          بازگشت به خانه
        </Link>
      </Button>

      {/* Production server errors carry a digest; it is what support can look up. */}
      {error?.digest && (
        <p className="basis-full pt-2 text-[10px] text-grey-400">
          کد پیگیری: <span dir="ltr">{error.digest}</span>
        </p>
      )}
    </StatusPage>
  );
}
