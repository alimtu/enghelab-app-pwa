import ReactQueryProvider from '../lib/providers/ReactQueryProvider';
import SplashScreen from '../components/AppComponents/SplashScreen';
import ThemeProvider from '../lib/providers/ThemeProvider';
import ThemeColorMeta from '../components/AppComponents/ThemeColorMeta';
import LayoutShell from '../components/LayoutShell';
import { AuthProvider } from '../lib/auth/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'اپلیکیشن دانشگاه جامع انقلاب اسلامی',
  description: 'اپلیکیشن دانشگاه جامع انقلاب اسلامی - سامانه جامع خدمات دانشجویی',
  manifest: '/manifest.json',
  applicationName: 'دانشگاه انقلاب',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'دانشگاه انقلاب',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#002051',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so the splash shows without a flash on
            first load and never flashes on repeat loads in the same session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem('app-splash-shown'))document.documentElement.setAttribute('data-splash','1')}catch(e){}`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="دانشگاه انقلاب" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon.png" />
        {/*
          Applies display preferences before first paint. next-themes ships its
          own equivalent for the colour theme; this covers the rest. It must be
          pre-paint rather than a mount effect (the mistake in the old
          FontSizeControl) because an entrance animation a student asked to
          suppress has already played by the time an effect runs.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,K='enghelab-app-display',L='enghelab-app-font-scale',s={};try{s=JSON.parse(localStorage.getItem(K))||{}}catch(e){}if(s.fontScale==null){var g=localStorage.getItem(L);if(g)s.fontScale=parseFloat(g)}var n=function(v,lo,hi,f){v=parseFloat(v);return isFinite(v)?Math.min(hi,Math.max(lo,v)):f};d.style.setProperty('--font-scale',n(s.fontScale,.9,1.2,1));d.style.setProperty('--lh-scale',[1,1.15,1.3].indexOf(+s.lhScale)>-1?+s.lhScale:1);d.style.setProperty('--app-font-weight',+s.fontWeight===500?500:400);if(s.contrast==='high')d.setAttribute('data-contrast','high');if(s.stroke==='bold'||s.stroke==='bolder')d.setAttribute('data-stroke',s.stroke);if(s.primary==='soft'||s.primary==='strong')d.setAttribute('data-primary',s.primary);if(s.motion==='on'||s.motion==='off')d.setAttribute('data-reduce-motion',s.motion);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <SplashScreen />
        <ThemeProvider>
          <ThemeColorMeta />
          <ReactQueryProvider>
            <AuthProvider>
              <LayoutShell>{children}</LayoutShell>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
