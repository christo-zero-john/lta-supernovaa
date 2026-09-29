# Dashboard

`/dashboard` is the authenticated student dashboard, built from the Figma
redesign. The middleware sends visitors without a `token` cookie to `/signup`.

## Pages

| Page | Route | Content |
| --- | --- | --- |
| Dashboard | `/dashboard` | The first Figma design (`lnOH0IYXWcqSfk8e4jobzq`, node `1:514`) with the student's data |
| Documents | `/dashboard/documents` | Concept page |
| Notifications | `/dashboard/notifications` | Concept page |
| Support | `/dashboard/support` | Concept page |
| Zenna | `/dashboard/zenna` | Concept page |
| LTA Connect | `/dashboard/connect` | Concept page |
| Course Shortlisting | `/dashboard/course-shortlisting` | Concept page |
| Project004 | `/dashboard/project004` | Concept page |

The route table is `VIEW_ROUTES` in `src/app/dashboard/_supernova/lib/routes.ts`.
The layout (`src/app/dashboard/layout.tsx`) loads the user (`users/me/`) and
keeps the sidebar, dialogs and app state mounted while pages change. Only the
page column animates, through React's `<ViewTransition>` in `AppShell`.

## Home page data

`src/app/dashboard/page.tsx` shows the page loader while it fetches the
shortlisted courses and preloads the first-screen images. Then it renders
`_supernova/home/Dashboard.tsx`.

- **Greeting:** based on the time of day and the user's first name.
- **Zenna row:** Zenna and her bubble always show. Each shortlisted course
  becomes one of the four Figma card designs, repeated in order
  (`universityCard.ts`). With no courses, the bubble says so, and the LTA
  suite cards fill the row.
- **Upcoming Events:** the user's booked sessions (`booked-slot/`), month by
  month (`events.ts`).
- **Testimonials:** real student testimonials (`testimonials.ts`), three per
  view, scrolling sideways.
- **Footer:** Book a session and Chat with a Mentor open the shared booking and
  contact dialogs.

## Concept pages

The seven section pages use the content, controls and persona states of
`supernova_concept_v3 (1).html`, in LTA styling. Their state (bookings,
uploads, preferences, notifications) is kept in browser memory only; nothing
is written to the backend.

## Avatars

Until users can upload photos, users without a `profile_picture` get a 3D
avatar (Microsoft Fluent Emoji, MIT) from `public/assets/avatars/<group>/`.
The group is `male` or `female` when the user has that gender, and `common`
otherwise. The pick within a group is fixed per user id. To add avatars, put
the file in a group folder and list it in `AVATARS` in
`_supernova/hooks/useCurrentUser.ts`.

## Checks

- `pnpm.cmd test:model` tests the concept model, validation and reducer.
- `pnpm.cmd exec tsc --noEmit` and `pnpm.cmd lint`.
