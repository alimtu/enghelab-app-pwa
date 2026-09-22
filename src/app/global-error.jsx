'use client';

import { useEffect } from 'react';

/**
 * Last resort: replaces the root layout when the layout itself (a provider,
 * the shell) throws. Nothing from globals.css is guaranteed to be loaded at
 * that point, so this stays self-contained: inline styles, brand navy by hex.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: 'IRANSansXFaNum, system-ui, sans-serif',
          background: '#f3f4f6',
          color: '#1f2937',
        }}
      >
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>برنامه با مشکل مواجه شد</h1>
          <p style={{ margin: 0, maxWidth: 288, fontSize: 13, lineHeight: 1.8, color: '#6b7280' }}>
            خطایی غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید یا صفحه را از نو بارگذاری کنید.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 8,
              padding: '10px 24px',
              border: 0,
              borderRadius: 8,
              background: '#002051',
              color: '#fff',
              fontFamily: 'inherit',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
