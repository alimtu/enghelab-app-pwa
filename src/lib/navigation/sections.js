import {
  HomeIcon,
  ClipboardListIcon,
  MessageSquareWarningIcon,
  ImagesIcon,
  UserRoundIcon,
  ChartColumnIcon,
  InboxIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';

/**
 * The one registry of what this app contains.
 *
 * This is a university app, not a forms app. Forms happen to be the first
 * capability built (نظرسنجی and شکایت), but sections unrelated to forms —
 * news, class schedules, dining, library, transport — are expected to sit
 * beside them as equals. Adding one means adding an object here, not editing
 * the navigation and the dashboard by hand.
 *
 * Fields:
 *   id            stable key
 *   title         label shown in navigation and on the dashboard
 *   description   one line, dashboard only
 *   href          route
 *   icon          lucide icon component
 *   area          groups the section on the dashboard (see AREAS)
 *   kind          'form' marks a section powered by the form engine; anything
 *                 that is not form-based simply omits it
 *   nav           false, or { slot: 'center' | 'side' } to appear in the
 *                 bottom navigation
 *   requiresAuth  the section itself needs an account to be useful
 */

export const AREA_FORMS = 'forms';
export const AREA_CAMPUS = 'campus';
export const AREA_ACCOUNT = 'account';

/** Dashboard groupings, in display order. */
export const AREAS = [
  { id: AREA_FORMS, title: 'فرم‌ها و درخواست‌ها' },
  { id: AREA_CAMPUS, title: 'خدمات دانشگاه' },
  { id: AREA_ACCOUNT, title: 'حساب کاربری' },
];

export const SECTIONS = [
  {
    id: 'home',
    title: 'خانه',
    href: '/',
    icon: HomeIcon,
    area: null,
    nav: { slot: 'center' },
  },

  // ── Form-based sections ────────────────────────────────────────────────
  {
    id: 'survey',
    title: 'نظرسنجی‌ها',
    description: 'دروس، رویدادها و خدمات دانشگاه',
    href: '/survey',
    icon: ClipboardListIcon,
    area: AREA_FORMS,
    kind: 'form',
    nav: { slot: 'side' },
  },
  {
    id: 'complaints',
    title: 'ثبت شکایت',
    description: 'مشکلات آموزشی و رفاهی',
    href: '/complaints',
    icon: MessageSquareWarningIcon,
    area: AREA_FORMS,
    kind: 'form',
    nav: { slot: 'side' },
  },
  {
    id: 'pending',
    title: 'صف ارسال',
    description: 'فرم‌های ذخیره‌شده در انتظار ارسال',
    href: '/pending',
    icon: InboxIcon,
    area: AREA_FORMS,
    kind: 'form',
    // Reached from the form sections themselves, not the dashboard or nav.
    nav: false,
    hidden: true,
  },

  // ── Sections that have nothing to do with forms ────────────────────────
  {
    id: 'gallery',
    title: 'گالری تصاویر',
    description: 'تصاویر و اطلاعیه‌های دانشگاه',
    href: '/gallery',
    icon: ImagesIcon,
    area: AREA_CAMPUS,
    nav: { slot: 'side' },
  },

  // ── Account ────────────────────────────────────────────────────────────
  {
    id: 'profile',
    title: 'پروفایل',
    description: 'اطلاعات دانشجویی شما',
    href: '/profile',
    icon: UserRoundIcon,
    area: AREA_ACCOUNT,
    nav: { slot: 'side' },
    requiresAuth: true,
  },
  {
    id: 'charts',
    title: 'آمار و گزارش‌ها',
    description: 'نمودار فرم‌ها و درخواست‌های شما',
    href: '/charts',
    icon: ChartColumnIcon,
    area: AREA_ACCOUNT,
    nav: false,
    requiresAuth: true,
  },
  {
    id: 'settings',
    title: 'تنظیمات نمایش',
    description: 'اندازه متن و حالت نمایش',
    href: '/settings',
    icon: SlidersHorizontalIcon,
    area: AREA_ACCOUNT,
    nav: false,
  },
];

/**
 * Bottom-navigation entries. The centre-slot section is placed in the middle
 * regardless of where it sits in the registry, so the registry can stay in
 * reading order.
 */
export function getNavSections() {
  const nav = SECTIONS.filter((section) => section.nav);
  const centre = nav.find((section) => section.nav.slot === 'center');
  if (!centre) return nav;

  const sides = nav.filter((section) => section !== centre);
  const middle = Math.floor(sides.length / 2);
  return [...sides.slice(0, middle), centre, ...sides.slice(middle)];
}

/** Dashboard entries for one area. */
export function getSectionsByArea(areaId) {
  return SECTIONS.filter((section) => section.area === areaId && !section.hidden);
}

export function getSection(id) {
  return SECTIONS.find((section) => section.id === id);
}
