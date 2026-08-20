'use client';

import { GraduationCap, X } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '../ui/drawer';
import LoginForm from './LoginForm';
import { useAuth } from '../../lib/auth/AuthProvider';

/**
 * The single login surface for the whole app. Mounted once in the layout and
 * opened from anywhere via `useAuth().openLogin()` / `requireAuth()`.
 */
export default function LoginSheet() {
  const { loginOpen, closeLogin, loginReason } = useAuth();

  return (
    <Drawer open={loginOpen} onOpenChange={(open) => !open && closeLogin()} autoFocus>
      {/* The drawer primitive sets its bottom-direction radius and max height
          through data-variant selectors, so overrides have to match that
          specificity to win. */}
      <DrawerContent
        dir="rtl"
        className="mx-auto w-full max-w-[480px] border-stroke-soft bg-surface data-[vaul-drawer-direction=bottom]:max-h-[92vh] data-[vaul-drawer-direction=bottom]:rounded-t-4xl"
      >
        {/* `.safe-bottom` is unlayered CSS and would beat a Tailwind pb-* utility,
            so the safe-area inset is folded into one padding value instead. */}
        <div className="overflow-y-auto px-6 pt-2 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
          <div className="relative flex flex-col items-center gap-3 pb-6 pt-2 text-center">
            <DrawerClose
              aria-label="بستن"
              className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full text-grey-400 transition-colors hover:bg-grey-50 hover:text-grey-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
            >
              <X className="size-4.5" />
            </DrawerClose>

            <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary-600 to-primary-500 text-white">
              <GraduationCap className="size-7" strokeWidth={1.75} />
            </div>
            <div className="space-y-1">
              <DrawerTitle className="text-lg font-bold text-grey-800">
                ورود به حساب کاربری
              </DrawerTitle>
              <DrawerDescription className="text-xs leading-relaxed text-grey-500">
                {loginReason || 'برای ادامه، با حساب کاربری خود وارد شوید.'}
              </DrawerDescription>
            </div>
          </div>

          <LoginForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
