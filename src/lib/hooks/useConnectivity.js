'use client';

import { useCallback, useEffect, useState } from 'react';

import config from '../../config';

// Cheapest public op on the backend; it needs no session.
const PROBE_URL = `${config.api.baseURL}/?name=Icms&file=json&op=m_version`;
const PROBE_TIMEOUT_MS = 8000;

/**
 * Whether the app can actually reach its backend.
 *
 * `navigator.onLine` only reports whether a network interface is up — it stays
 * true on a captive portal or when the server is unreachable — so the retry
 * button performs a real request instead of trusting the flag.
 */
export default function useConnectivity() {
  // Starts optimistic so the server render and the first client render agree.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  const recheck = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOnline(false);
      return false;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    try {
      // `no-store` keeps a cached copy from masking a dead connection.
      await fetch(`${PROBE_URL}&_=${Date.now()}`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      setOnline(true);
      return true;
    } catch {
      setOnline(false);
      return false;
    } finally {
      clearTimeout(timer);
    }
  }, []);

  return { online, recheck };
}
