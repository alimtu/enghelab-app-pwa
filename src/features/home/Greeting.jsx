'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '../../lib/auth/AuthProvider';
import useProfile from '../../lib/hooks/useProfile';
import { formatJalali } from '../../lib/utils/jalali';
import { isBlank } from '../profile/profileFields';

const WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

function greetingFor(hour) {
  if (hour < 5) return 'شب بخیر';
  if (hour < 12) return 'صبح بخیر';
  if (hour < 16) return 'ظهر بخیر';
  if (hour < 20) return 'عصر بخیر';
  return 'شب بخیر';
}

/**
 * The hub opens by addressing the student, not by repeating the university's
 * name (that already sits in the header). Signed in, it uses the first name
 * from the profile; signed out, a plain welcome. Either way today's date sits
 * under it, the one thing every student checks.
 *
 * Time and date are read after mount: the page is prerendered, and a greeting
 * computed on the server would not match the student's clock.
 */
export default function Greeting() {
  const { isAuthenticated } = useAuth();
  const { data } = useProfile({ enabled: isAuthenticated });
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const firstName = (data?.prof?.fname || '').trim();
  const hasName = isAuthenticated && !isBlank(firstName);

  let title = 'سلام، خوش آمدید';
  if (now && isAuthenticated) {
    title = hasName ? `${greetingFor(now.getHours())}، ${firstName}` : greetingFor(now.getHours());
  }

  return (
    <div>
      <h1 className="text-xl font-bold leading-snug text-grey-800">{title}</h1>
      <p className="mt-1 min-h-4 text-xs text-grey-500">
        {now && `${WEEKDAYS[now.getDay()]} ${formatJalali(now)}`}
      </p>
    </div>
  );
}
