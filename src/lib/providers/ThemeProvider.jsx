'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Puts `.dark` on <html>, which is what the `@custom-variant dark` rule in
 * globals.css keys off. next-themes injects a blocking script before paint, so
 * <html> must carry suppressHydrationWarning (see src/app/layout.jsx).
 */
export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="enghelab-app-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
