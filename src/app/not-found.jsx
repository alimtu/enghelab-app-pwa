'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, HomeIcon, SearchXIcon } from 'lucide-react';

import StatusPage from '../components/Error/StatusPage';
import { Button } from '../components/ui/button';

/**
 * Every unmatched URL, plus any notFound() thrown without a closer boundary.
 * A segment that knows what is missing (e.g. a form category) ships its own
 * not-found.jsx with a more specific message.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <StatusPage
      icon={SearchXIcon}
      code="404"
      title="صفحه‌ای پیدا نشد"
      description="آدرسی که وارد کرده‌اید وجود ندارد یا جابه‌جا شده است."
    >
      <Button asChild className="h-10 px-5">
        <Link href="/">
          <HomeIcon className="size-4" />
          بازگشت به خانه
        </Link>
      </Button>
      <Button variant="outline" className="h-10 px-5" onClick={() => router.back()}>
        <ArrowRightIcon className="size-4" />
        صفحه قبل
      </Button>
    </StatusPage>
  );
}
