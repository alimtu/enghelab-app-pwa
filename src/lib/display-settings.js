/**
 * Per-device display preferences («تنظیمات نمایش»).
 *
 * Deliberately NOT synced to the profile API: settings must work signed out,
 * because a low-vision student needs the app readable before they can read the
 * login form. Campus phones are also shared, and one student's text size should
 * not follow another onto the same device.
 *
 * Theme is the one exception and lives on next-themes' own key — fighting the
 * library's storage would break its pre-paint script.
 */

export const DISPLAY_STORAGE_KEY = 'enghelab-app-display';

/** Written by the orphaned FontSizeControl this feature replaces. */
export const LEGACY_FONT_SCALE_KEY = 'enghelab-app-font-scale';

export const FONT_SCALE_MIN = 0.9;
/**
 * Capped at 1.2, not higher: html font-size scales every rem including h-10,
 * size-9 and px-4, while the shell is max-w-[480px] in *pixels* with
 * overflow-x:hidden. Past ~1.3 the overflow is silently clipped — and under
 * dir="rtl" it clips on the edge the reader starts from.
 */
export const FONT_SCALE_MAX = 1.2;
export const FONT_SCALE_STEP = 0.05;

export const LINE_HEIGHT_OPTIONS = [
  { value: 1, label: 'عادی' },
  { value: 1.15, label: 'زیاد' },
  { value: 1.3, label: 'خیلی زیاد' },
];

export const FONT_WEIGHT_OPTIONS = [
  { value: 400, label: 'معمولی' },
  { value: 500, label: 'ضخیم‌تر' },
];

/**
 * «شدت تیرگی خطوط» — how dark borders and dividers are drawn. Walks the stroke
 * tokens up the grey ramp; it does NOT touch fills, so the page backdrop,
 * skeletons and the chart grid stay put.
 */
export const STROKE_OPTIONS = [
  { value: 'normal', label: 'عادی' },
  { value: 'bold', label: 'پررنگ' },
  { value: 'bolder', label: 'خیلی پررنگ' },
];

/**
 * «شدت رنگ اصلی» — how vivid the brand navy is. Implemented as saturation at
 * constant lightness, so every level keeps white button labels and brand text
 * inside AA; varying lightness instead breaks both ends of the dark ramp.
 */
export const PRIMARY_OPTIONS = [
  { value: 'soft', label: 'ملایم' },
  { value: 'normal', label: 'عادی' },
  { value: 'strong', label: 'پررنگ' },
];

export const CONTRAST_OPTIONS = [
  { value: 'normal', label: 'عادی' },
  { value: 'high', label: 'بالا' },
];

export const MOTION_OPTIONS = [
  { value: 'system', label: 'هماهنگ با سیستم' },
  { value: 'on', label: 'کاهش‌یافته' },
  { value: 'off', label: 'عادی' },
];

export const DEFAULT_DISPLAY_SETTINGS = {
  fontScale: 1,
  lhScale: 1,
  fontWeight: 400,
  contrast: 'normal',
  stroke: 'normal',
  primary: 'normal',
  motion: 'system',
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const oneOf = (value, options, fallback) =>
  options.some((o) => o.value === value) ? value : fallback;

/** Coerces anything read from storage into a valid settings object. */
export function normalizeDisplaySettings(raw) {
  const d = DEFAULT_DISPLAY_SETTINGS;
  if (!raw || typeof raw !== 'object') return { ...d };

  const fontScale = Number(raw.fontScale);
  return {
    fontScale: Number.isFinite(fontScale)
      ? clamp(fontScale, FONT_SCALE_MIN, FONT_SCALE_MAX)
      : d.fontScale,
    lhScale: oneOf(Number(raw.lhScale), LINE_HEIGHT_OPTIONS, d.lhScale),
    fontWeight: oneOf(Number(raw.fontWeight), FONT_WEIGHT_OPTIONS, d.fontWeight),
    contrast: oneOf(raw.contrast, CONTRAST_OPTIONS, d.contrast),
    stroke: oneOf(raw.stroke, STROKE_OPTIONS, d.stroke),
    primary: oneOf(raw.primary, PRIMARY_OPTIONS, d.primary),
    motion: oneOf(raw.motion, MOTION_OPTIONS, d.motion),
  };
}

export function readDisplaySettings() {
  if (typeof window === 'undefined') return { ...DEFAULT_DISPLAY_SETTINGS };
  try {
    const stored = window.localStorage.getItem(DISPLAY_STORAGE_KEY);
    if (stored) return normalizeDisplaySettings(JSON.parse(stored));

    // First run after the FontSizeControl era: carry the old scale over.
    const legacy = window.localStorage.getItem(LEGACY_FONT_SCALE_KEY);
    if (legacy) {
      return normalizeDisplaySettings({
        ...DEFAULT_DISPLAY_SETTINGS,
        fontScale: Number(legacy),
      });
    }
  } catch {
    /* private mode or corrupt JSON — fall through to defaults */
  }
  return { ...DEFAULT_DISPLAY_SETTINGS };
}

/**
 * Mirrors the settings onto <html>. Must stay behaviourally identical to the
 * inline pre-paint script in src/app/layout.jsx, or the first frame and the
 * hydrated app will disagree.
 */
export function applyDisplaySettings(settings) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  const s = normalizeDisplaySettings(settings);

  el.style.setProperty('--font-scale', String(s.fontScale));
  el.style.setProperty('--lh-scale', String(s.lhScale));
  el.style.setProperty('--app-font-weight', String(s.fontWeight));

  if (s.contrast === 'high') el.setAttribute('data-contrast', 'high');
  else el.removeAttribute('data-contrast');

  // Absent means عادی, which is what :root already provides.
  if (s.stroke === 'normal') el.removeAttribute('data-stroke');
  else el.setAttribute('data-stroke', s.stroke);

  if (s.primary === 'normal') el.removeAttribute('data-primary');
  else el.setAttribute('data-primary', s.primary);

  // Absent means "follow the OS", which the media query in globals.css handles.
  if (s.motion === 'system') el.removeAttribute('data-reduce-motion');
  else el.setAttribute('data-reduce-motion', s.motion);
}

export function writeDisplaySettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      DISPLAY_STORAGE_KEY,
      JSON.stringify(normalizeDisplaySettings(settings))
    );
    window.localStorage.removeItem(LEGACY_FONT_SCALE_KEY);
  } catch {
    /* storage full or blocked — the in-memory state still applies */
  }
}
