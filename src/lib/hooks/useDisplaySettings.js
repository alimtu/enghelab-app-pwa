'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_DISPLAY_SETTINGS,
  DISPLAY_STORAGE_KEY,
  applyDisplaySettings,
  normalizeDisplaySettings,
  readDisplaySettings,
  writeDisplaySettings,
} from '../display-settings';

/**
 * Reads, applies and persists the display preferences.
 *
 * `ready` stays false until after mount: the server cannot know what is in
 * localStorage, so controls must not render their real state during hydration.
 * The values themselves are already on <html> before first paint via the inline
 * script in src/app/layout.jsx — this hook only mirrors them into React.
 */
export default function useDisplaySettings() {
  const [settings, setSettings] = useState(DEFAULT_DISPLAY_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(readDisplaySettings());
    setReady(true);
  }, []);

  // Two open tabs (or a second PWA window) should not disagree.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== DISPLAY_STORAGE_KEY) return;
      const next = readDisplaySettings();
      setSettings(next);
      applyDisplaySettings(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((patch) => {
    setSettings((prev) => {
      const next = normalizeDisplaySettings({ ...prev, ...patch });
      applyDisplaySettings(next);
      writeDisplaySettings(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = { ...DEFAULT_DISPLAY_SETTINGS };
    applyDisplaySettings(next);
    writeDisplaySettings(next);
    setSettings(next);
  }, []);

  return { settings, update, reset, ready };
}
