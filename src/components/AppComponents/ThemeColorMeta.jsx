'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

// Browser chrome / iOS status bar colour. Static <meta> can only follow the OS
// via media queries, which would disagree with an explicit in-app choice.
const COLORS = {
  light: '#002051',
  dark: '#000b22',
};

export default function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const color = COLORS[resolvedTheme] ?? COLORS.light;

    let tag = document.querySelector('meta[name="theme-color"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'theme-color');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', color);

    const statusBar = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (statusBar) {
      statusBar.setAttribute(
        'content',
        resolvedTheme === 'dark' ? 'black-translucent' : 'default'
      );
    }
  }, [resolvedTheme]);

  return null;
}
