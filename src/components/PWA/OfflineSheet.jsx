'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WifiOffIcon, RotateCwIcon } from 'lucide-react';

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '../ui/drawer';
import { Button } from '../ui/button';

/**
 * Shown whenever the device has no usable connection. The app submits forms
 * live — there is no store-and-forward queue — so a student who is offline is
 * told plainly rather than being allowed to fill in work that cannot be sent.
 *
 * It is not dismissible: reconnecting is the way out, and the sheet closes
 * itself the moment a check succeeds.
 */
export default function OfflineSheet({ open, onRecheck }) {
  const queryClient = useQueryClient();
  const [checking, setChecking] = useState(false);

  const retry = useCallback(async () => {
    setChecking(true);
    const online = await onRecheck();
    setChecking(false);
    // Back online: refetch whatever failed while the connection was down.
    if (online) queryClient.invalidateQueries();
  }, [onRecheck, queryClient]);

  // Stop the spinner if the connection returns on its own mid-check.
  useEffect(() => {
    if (open) return;
    setChecking(false);
  }, [open]);

  return (
    <Drawer open={open} dismissible={false} modal>
      <DrawerContent
        dir="rtl"
        className="mx-auto w-full max-w-[480px] border-stroke-soft bg-surface data-[vaul-drawer-direction=bottom]:rounded-t-4xl"
      >
        <div className="px-6 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
          <div className="flex flex-col items-center gap-3 pb-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-500">
              <WifiOffIcon className="size-7" strokeWidth={1.75} />
            </div>
            <div className="space-y-1">
              <DrawerTitle className="text-lg font-bold text-grey-800">
                اتصال اینترنت برقرار نیست
              </DrawerTitle>
              <DrawerDescription className="text-xs leading-relaxed text-grey-500">
                برای استفاده از سامانه به اینترنت نیاز دارید. اتصال خود را بررسی
                کنید و دوباره تلاش کنید.
              </DrawerDescription>
            </div>
          </div>

          <Button onClick={retry} disabled={checking} className="h-11 w-full text-sm">
            {checking ? (
              <>
                <RotateCwIcon className="size-4.5 animate-spin" />
                در حال بررسی اتصال...
              </>
            ) : (
              <>
                <RotateCwIcon className="size-4.5" />
                تلاش مجدد
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
