'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'forms_layout';

export const LAYOUT_LIST = 'list';
export const LAYOUT_GRID = 'grid';

/**
 * How the form tiles are arranged — a single column or two per row. The choice
 * is the student's, so it persists across visits and across both form sections.
 */
export default function useFormLayout() {
  const [layout, setLayoutState] = useState(LAYOUT_LIST);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === LAYOUT_GRID || saved === LAYOUT_LIST) setLayoutState(saved);
    setReady(true);
  }, []);

  const setLayout = useCallback((next) => {
    setLayoutState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { layout, setLayout, ready };
}
