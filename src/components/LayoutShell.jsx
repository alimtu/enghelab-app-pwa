'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { UserCircleIcon, ImageIcon, LogInIcon } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"
import PWAProvider from './PWA/PWAProvider';
import useVersionData from '@/lib/hooks/useVersionData';
import ThemeToggle from './AppComponents/ThemeToggle';
import { SlidersHorizontalIcon } from 'lucide-react';
import BottomNav, { BottomNavProvider } from './AppComponents/BottomNav';
import LoginSheet from './Auth/LoginSheet';
import { useAuth } from '@/lib/auth/AuthProvider';


export default function LayoutShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useVersionData();
  const { isAuthenticated, openLogin, ready: authReady } = useAuth();

  const isLoginPage = pathname === '/login';

  const versionData = data;

  // No route is gated: students browse the whole app signed out, and the
  // sections that need an account ask for one in place.
  useEffect(() => {
    if (isAuthenticated && isLoginPage) router.replace('/');
  }, [isAuthenticated, isLoginPage, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const showChrome = !isLoginPage;

  return (
    <PWAProvider>
      <BottomNavProvider>
      <div className="min-h-screen bg-grey-100 flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[480px] min-h-screen bg-surface shadow-xl relative flex flex-col overflow-x-hidden">
          {!isLoginPage && (
            <header className="fixed top-0 w-full md:max-w-[480px] md:w-[480px] z-40 flex h-14 items-center justify-between border-b border-stroke-soft bg-surface px-4">
              <div className="flex items-center gap-2 min-w-0">
                {versionData?.logo && (
                  <img
                    src={versionData.logo}
                    alt=""
                    className="size-8 shrink-0 rounded object-contain"
                  />
                )}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-primary-600 truncate">
                    {versionData?.name || ''}
                  </span>
                  {versionData?.version && (
                    <span className="text-xs text-grey-500 shrink-0">
                      v{versionData.version}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => router.push('/settings')}
                  aria-label="تنظیمات نمایش"
                  className="flex items-center text-grey-500 hover:text-grey-700 transition-colors"
                >
                  <SlidersHorizontalIcon className="size-5" />
                </button>
                {versionData?.images?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => router.push('/gallery')}
                    className="flex items-center text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    <ImageIcon className="size-5" />
                  </button>
                )}
                {!authReady ? (
                  // Keeps the slot stable until localStorage is read, so a
                  // signed-in student never sees a flash of "ورود".
                  <span className="size-6" aria-hidden="true" />
                ) : isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => router.push('/profile')}
                    aria-label="پروفایل"
                    className="flex items-center text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    <UserCircleIcon className="size-6" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openLogin()}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                  >
                    <LogInIcon className="size-3.5" />
                    ورود
                  </button>
                )}
              </div>
            </header>
          )}
          <Toaster position="top-center" />

          {/* pb-24 clears the bottom bar plus the centre button that rides above it. */}
          <main className={`flex-1 ${showChrome ? 'pt-14 pb-24' : ''}`}>{children}</main>
          {showChrome && <BottomNav />}
          <LoginSheet />
        </div>
      </div>
      </BottomNavProvider>
    </PWAProvider>
  );
}
