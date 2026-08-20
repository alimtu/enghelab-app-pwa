'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowRightIcon, MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import SegmentedControl from '../../../components/Settings/SegmentedControl';
import SettingRow, { SettingGroup } from '../../../components/Settings/SettingRow';
import useDisplaySettings from '../../../lib/hooks/useDisplaySettings';
import {
  CONTRAST_OPTIONS,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  MOTION_OPTIONS,
  STROKE_OPTIONS,
  PRIMARY_OPTIONS,
} from '../../../lib/display-settings';

const THEME_OPTIONS = [
  { value: 'light', label: 'روشن' },
  { value: 'dark', label: 'تیره' },
  { value: 'system', label: 'هماهنگ با سیستم' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, update, reset, ready } = useDisplaySettings();
  const { theme, setTheme } = useTheme();

  // The server cannot know the stored theme, so the radios render their real
  // state only after mount — same guard ThemeToggle already uses.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pct = Math.round(settings.fontScale * 100);
  const atMin = settings.fontScale <= FONT_SCALE_MIN + 0.001;
  const atMax = settings.fontScale >= FONT_SCALE_MAX - 0.001;

  const stepFont = (dir) =>
    update({ fontScale: settings.fontScale + dir * FONT_SCALE_STEP });

  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="بازگشت"
          className="-mr-1 rounded-md p-1 text-grey-400 transition-colors hover:bg-grey-50 hover:text-grey-700"
        >
          <ArrowRightIcon className="size-5" />
        </button>
        <h1 className="text-sm font-bold text-grey-800">تنظیمات نمایش</h1>
      </div>

      <p className="text-xs leading-relaxed text-grey-500">
        این تنظیمات فقط روی همین دستگاه ذخیره می‌شود و بلافاصله اعمال می‌گردد.
      </p>

      {/* Live preview: the point of every control here is legibility, so the
          effect has to be visible without leaving the page. */}
      {/* <section
        aria-label="پیش‌نمایش"
        className="rounded-2xl border border-stroke bg-surface p-4"
      >
        <h2 className="mb-2 text-xs font-bold text-grey-500">پیش‌نمایش</h2>
        <p className="text-sm text-grey-800">
          دانشجوی گرامی، برای تکمیل فرم ثبت‌نام لطفاً اطلاعات خواسته‌شده را با دقت وارد کنید.
        </p>
        <p className="mt-1.5 text-xs text-grey-500">
          توضیح تکمیلی: پس از ثبت، امکان ویرایش تا پایان مهلت وجود دارد.
        </p>
      </section> */}

      <SettingGroup title="رنگ و روشنایی">
        <SettingRow title="پوستهٔ برنامه" hint="روشن، تیره یا هماهنگ با تنظیمات دستگاه">
          <SegmentedControl
            ariaLabel="پوستهٔ برنامه"
            value={mounted ? theme || 'system' : 'system'}
            onValueChange={setTheme}
            options={THEME_OPTIONS}
            disabled={!mounted}
          />
        </SettingRow>

        <SettingRow title="کنتراست" hint="پررنگ‌تر کردن نوشته‌های کم‌رنگ و کادرها">
          <SegmentedControl
            ariaLabel="کنتراست"
            value={settings.contrast}
            onValueChange={(v) => update({ contrast: v })}
            options={CONTRAST_OPTIONS}
            disabled={!ready}
          />
        </SettingRow>

        <SettingRow
          title="شدت رنگ اصلی"
          hint="پررنگی رنگ سازمانی در دکمه‌ها و عنوان‌ها"
        >
          <SegmentedControl
            ariaLabel="شدت رنگ اصلی"
            value={settings.primary}
            onValueChange={(v) => update({ primary: v })}
            options={PRIMARY_OPTIONS}
            disabled={!ready}
          />
        </SettingRow>

        <SettingRow
          title="شدت تیرگی خطوط"
          hint="تیرگی کادرها، خط‌های جداکننده و حاشیهٔ فیلدها"
        >
          <SegmentedControl
            ariaLabel="شدت تیرگی خطوط"
            value={settings.stroke}
            onValueChange={(v) => update({ stroke: v })}
            options={STROKE_OPTIONS}
            disabled={!ready}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="خوانایی متن">
        <SettingRow title="اندازهٔ متن" hint="از ۹۰ تا ۱۲۰ درصد">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stepFont(-1)}
              disabled={!ready || atMin}
              aria-label="کوچک‌تر کردن متن"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-stroke text-grey-700 transition-colors hover:bg-grey-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <MinusIcon className="size-4" />
            </button>

            <input
              type="range"
              min={FONT_SCALE_MIN}
              max={FONT_SCALE_MAX}
              step={FONT_SCALE_STEP}
              value={settings.fontScale}
              disabled={!ready}
              onChange={(e) => update({ fontScale: Number(e.target.value) })}
              aria-label="اندازهٔ متن"
              aria-valuetext={`${pct} درصد`}
              className="h-11 flex-1 accent-primary-500"
            />

            <button
              type="button"
              onClick={() => stepFont(1)}
              disabled={!ready || atMax}
              aria-label="بزرگ‌تر کردن متن"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-stroke text-grey-700 transition-colors hover:bg-grey-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <PlusIcon className="size-4" />
            </button>

            <span className="w-12 shrink-0 text-center text-xs tabular-nums text-grey-600">
              {pct}٪
            </span>
          </div>
        </SettingRow>

        <SettingRow title="فاصلهٔ خطوط" hint="فاصلهٔ بیشتر، خواندن متن‌های بلند را آسان‌تر می‌کند">
          <SegmentedControl
            ariaLabel="فاصلهٔ خطوط"
            value={settings.lhScale}
            onValueChange={(v) => update({ lhScale: Number(v) })}
            options={LINE_HEIGHT_OPTIONS}
            disabled={!ready}
          />
        </SettingRow>

        <SettingRow title="ضخامت قلم" hint="برای دیده‌شدن بهتر در نور زیاد">
          <SegmentedControl
            ariaLabel="ضخامت قلم"
            value={settings.fontWeight}
            onValueChange={(v) => update({ fontWeight: Number(v) })}
            options={FONT_WEIGHT_OPTIONS}
            disabled={!ready}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="حرکت">
        <SettingRow title="کاهش انیمیشن‌ها" hint="حذف جلوه‌های حرکتی و اسکرول نرم">
          <SegmentedControl
            ariaLabel="کاهش انیمیشن‌ها"
            value={settings.motion}
            onValueChange={(v) => update({ motion: v })}
            options={MOTION_OPTIONS}
            disabled={!ready}
          />
        </SettingRow>
      </SettingGroup>

      <button
        type="button"
        onClick={reset}
        disabled={!ready}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-stroke text-sm text-grey-600 transition-colors hover:bg-grey-50 hover:text-grey-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <RotateCcwIcon className="size-4" />
        بازگرداندن به حالت پیش‌فرض
      </button>
    </div>
  );
}
