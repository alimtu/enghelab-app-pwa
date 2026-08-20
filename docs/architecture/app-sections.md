# App sections

This is a university app. Forms are one capability inside it, not its purpose.
Sections that have nothing to do with forms — news, class schedules, dining,
library, transport — are expected, and the structure is built so they cost one
object plus one route, not a redesign.

## Where things live

```
src/lib/navigation/sections.js   the registry: everything the app contains
src/features/<feature>/          one folder per capability (forms lives here)
src/components/FormGenerator/    the dynamic-form engine — a generic capability
                                 any feature may use, not the forms feature
src/components/ui/               design-system primitives
src/app/(publicPages)/<route>/   thin route files that render a feature
```

`features/forms` holds the parts specific to form-based sections: the browser
UI, the layout preference, the sample data. The engine under
`components/FormGenerator` stays generic on purpose — a future section can
render a dynamic form without belonging to the forms feature.

## Adding a section

1. Add an object to `SECTIONS` in `src/lib/navigation/sections.js`:

```js
{
  id: 'schedule',
  title: 'برنامه کلاسی',
  description: 'برنامه هفتگی و تقویم امتحانات',
  href: '/schedule',
  icon: CalendarIcon,
  area: AREA_CAMPUS,      // groups it on the dashboard
  nav: false,             // or { slot: 'side' } to put it in the bottom bar
  requiresAuth: true,     // optional
}
```

2. Create `src/features/schedule/` for its components and data.
3. Create `src/app/(publicPages)/schedule/page.jsx` as a thin route that
   renders the feature.

The dashboard and the bottom navigation both read the registry, so both pick
the section up with no further edits.

## Rules that keep it from drifting back

- **The centre navigation button belongs to the app, not a feature.** It points
  at the hub. If one feature ever takes that slot, the app starts looking like
  that feature is all it does — which is exactly the drift this structure
  prevents.
- **Only mark a section `kind: 'form'` if the form engine drives it.** That flag
  is how form-specific behaviour (the offline send queue) knows what it owns.
- **The send queue is form-specific.** It is reached from the form sections, not
  from the global navigation, because it has no meaning for a non-form section.
- **Auth is per action, not per app.** Sections are browsable by default; use
  `requireAuth()` for actions and `<AuthGate>` for sections that genuinely need
  an account. See `src/lib/auth/AuthProvider.jsx`.
