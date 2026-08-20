# enghelab-app

اپلیکیشن دانشگاه جامع انقلاب اسلامی — a Persian, RTL, offline-capable PWA built on Next.js App Router.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack dev) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config in `src/app/globals.css`) |
| Components | shadcn/ui (`new-york`) on Radix primitives — `src/components/ui/` |
| Data | TanStack Query v5 + axios, via a Next route proxy |
| Forms | react-hook-form + Joi, driven by the dynamic `FormGenerator` |
| Dates | Jalali (`date-fns-jalali`, `jalali-plugin-dayjs`, `@react-shamsi/calendar`) |
| Offline | Custom service worker (`public/sw.js`) + `idb-keyval` |
| Font | IRANSansXFaNum (self-hosted, `public/fonts/iransans/`) |

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3001
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

## Environment

Create `.env.local` (not committed). Values consumed by `src/config/index.js`:

| Variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Real backend origin. Read **only** by the proxy route, never by the browser. |
| `MEDIA_BASE_URL` | Media/file origin; falls back to `API_BASE_URL`. |
| `BASE_URL` | Public site origin used for absolute links. |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials for the contact form (`src/app/api/contact/route.js`). |
| `IS_DEBUG` | Enables verbose logging. |

The browser always talks to `/api/proxy`, which terminates the upstream's bad TLS certificate server-side. See the comment in `src/config/index.js`.

## Layout

```
src/
  app/                 App Router routes, layout, globals.css
    (publicPages)/     Public route group — home, gallery, charts, profile
    api/               Route handlers (proxy, contact)
  components/
    ui/                shadcn/ui primitives
    FormGenerator/     Schema-driven dynamic form engine + field types
    PWA/               Install prompt, update banner, offline indicator
    Skeleton/          Per-page loading skeletons
  lib/
    hooks/             TanStack Query data hooks
    utils/             Jalali helpers, schema builders, submit-param builders
    offline/           IndexedDB queue for offline submissions
messages/              fa.json / ar.json content catalogs
public/                Icons, manifest, service worker, fonts
```

## Branding

| Surface | Value |
| --- | --- |
| Package / internal id | `enghelab-app` (`package.json`, `src/config/index.js` → `app_name`) |
| Display name | اپلیکیشن دانشگاه جامع انقلاب اسلامی |
| Short name (home screen) | دانشگاه انقلاب |
| Brand color | `#244a9a` — `--color-primary` in `src/app/globals.css`, `theme_color` in the manifest |

Changing the display name means touching three places in sync: `public/manifest.json`, the `metadata` export in `src/app/layout.jsx`, and the `apple-mobile-web-app-title` meta tag in the same file.

## PWA

See [PWA_SETUP.md](PWA_SETUP.md) for the full implementation and [PWA_QUICK_START.md](PWA_QUICK_START.md) for testing steps. Bumping `CACHE_NAME` in `public/sw.js` invalidates every client's cache on next activation.
