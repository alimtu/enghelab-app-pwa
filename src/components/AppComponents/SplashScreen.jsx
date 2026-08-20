'use client';

import { useEffect, useState } from 'react';

const SHOWN_KEY = 'app-splash-shown';
const SHOW_MS = 2100;
const EXIT_MS = 480;

// Rendered on the server so it paints with the first HTML, but only visible
// when the inline <head> script set data-splash on <html> (once per session).
export default function SplashScreen() {
  const [phase, setPhase] = useState('showing'); // showing → leaving → gone

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute('data-splash') !== '1') {
      setPhase('gone');
      return;
    }
    // Same precedence as the reduce-motion CSS: 'on' forces it, 'off' outranks
    // the OS. The global !important rules have already collapsed the autohide
    // delay and hidden the splash, so don't hold the boot behind timers.
    const override = root.getAttribute('data-reduce-motion');
    const reduce =
      override === 'on' ||
      (override !== 'off' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const showFor = reduce ? 0 : SHOW_MS;
    const exitFor = reduce ? 0 : EXIT_MS;
    const leave = setTimeout(() => setPhase('leaving'), showFor);
    const gone = setTimeout(() => {
      try {
        sessionStorage.setItem(SHOWN_KEY, '1');
      } catch {
        // Private mode: the splash just replays next load.
      }
      document.documentElement.removeAttribute('data-splash');
      setPhase('gone');
    }, showFor + exitFor);
    return () => {
      clearTimeout(leave);
      clearTimeout(gone);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      id="app-splash"
      className={phase === 'leaving' ? 'splash-leaving' : ''}
      aria-hidden="true"
    >
      <div className="splash-core">
        <div className="splash-medallion">
          <span className="splash-ambient">
            <span className="splash-ambient-sq" />
            <span className="splash-ambient-sq splash-ambient-sq--turned" />
          </span>
          <span className="splash-halo" />
          <span className="splash-star-sq" />
          <span className="splash-star-sq splash-star-sq--turned" />
          <img
            src="/Images/Logo/Uni_Logo_Transparent.png"
            alt=""
            className="splash-logo"
            draggable={false}
          />
        </div>
        <p className="splash-title">دانشگاه جامع انقلاب اسلامی</p>
        <p className="splash-sub">سامانه جامع خدمات دانشجویی</p>
      </div>
      <div className="splash-loader">
        <span className="splash-loader-bar" />
      </div>
    </div>
  );
}
