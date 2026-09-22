'use client';

import { useCallback, useEffect } from 'react';
import { useServiceWorker, useInstallPrompt } from '@/lib/hooks/usePWA';
import useConnectivity from '@/lib/hooks/useConnectivity';
import OfflineSheet from './OfflineSheet';
import InstallPrompt from './InstallPrompt';
import UpdateBanner from './UpdateBanner';

export default function PWAProvider({ children }) {
  const { updateAvailable, applyUpdate } = useServiceWorker();
  const { online, recheck } = useConnectivity();
  const { canInstall, install } = useInstallPrompt();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
      });
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
    }
  }, []);

  const handleInstall = useCallback(async () => {
    await install();
  }, [install]);

  return (
    <>
      {children}

      {/* Blocks the app while offline: forms are submitted live, so there is
          nothing useful to do without a connection. */}
      <OfflineSheet open={!online} onRecheck={recheck} />

      {online && updateAvailable && <UpdateBanner onUpdate={applyUpdate} />}

      {online && canInstall && !updateAvailable && <InstallPrompt onInstall={handleInstall} />}
    </>
  );
}
