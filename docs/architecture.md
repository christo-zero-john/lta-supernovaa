# Architecture

How the frontend is put together: where each concern lives and how a request
or a page render flows through it. For setup and commands see the
[README](../README.md); for the dashboard's pages and data see
[dashboard.md](dashboard.md).

## Stack

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16 App Router, React 19 |
| Language | TypeScript (strict), path alias `@/*` → `src/*` |
| Styling | Global CSS, component CSS beside each component, Tailwind 4 tooling |
| Fonts | `next/font/google` in `src/app/layout.tsx` (Plus Jakarta Sans, Anek Bangla) |
| HTTP | Axios instance with auth and refresh interceptors |
| User state | Zustand, in memory only |
| Scrolling | Lenis (`src/components/SmoothScroll`) |
| Tooltips | Radix UI |

## Directory map

```text
src/
  middleware.ts               Cookie-presence redirects (see Authentication)
  app/
    layout.tsx                Root layout, fonts, metadata
    page.tsx                  Redirects to /signup
    globals.css               Global styles and font variables
    (auth)/                   Signup, login, OTP, set-password, welcome
                              (route group: adds no URL prefix)
    dashboard/
      layout.tsx              Fetches users/me/, mounts providers and shell
      page.tsx                Home: loader, course fetch, image preloads
      <section>/page.tsx      Seven section pages, each wraps one view
      _supernova/             All dashboard code (private folder, not routed)
        components/           Shell, sidebar, topbar, dialogs, shared UI
        home/                 Home page (Figma design) and its cards
        views/                One component per section page
        demo/                 "Choose options" dummy data and its switch
        hooks/                Current user, uploads, unread count
        lib/                  Types, routes, reducer, model, fixtures
  actions/                    Result wrappers around services
  lib/
    axios.ts                  Base URL, headers, token refresh
    cookies.ts                Token cookie helpers
    services/                 One module per API resource
  store/useStore.ts           Current user (Zustand)
  components/                 App-wide components (PageLoader, SmoothScroll,
                              TruncatedText)
scripts/test-supernova-model.mjs   Model/reducer assertions
docs/                         This documentation
```

## Authentication and session

1. Login and invite password setup save `token` and `refresh_token` cookies
   (`src/lib/cookies.ts`). The cookies are readable from JavaScript.
2. `src/middleware.ts` only checks that a `token` cookie exists. Without it,
   any non-public route redirects to `/signup`. With it, public auth routes
   redirect to `/dashboard`. It does not validate the token; the backend must.
3. `src/lib/axios.ts` adds `Portal-Type: dashboard` and the bearer token to
   every request. On a `401` it refreshes once via `token/refresh/`. If that
   fails it clears the cookies and sends the user to `/login`.
4. The sidebar's **Log out** clears both cookies and navigates away (see
   [review R3](review.md#r3-logout-goes-to-a-route-that-does-not-exist)).

## API layer

Three layers, each with one job:

| Layer | Location | Job |
| --- | --- | --- |
| Client | `src/lib/axios.ts` | Base URL from `NEXT_PUBLIC_LTA_API_BASE_URL`, headers, refresh |
| Services | `src/lib/services/*.service.ts` | One function per endpoint, unwraps `response.data.data`, response types in `api.types.ts` |
| Actions | `src/actions/*.actions.ts` | Wrap a service call as `{ success, data?, error? }` for components |

Despite the folder name, `src/actions` are ordinary client-side functions, not
Next.js Server Actions (no `"use server"`).

The full list of endpoints is in the README's API table. The dashboard
currently calls only `users/me/`, `shortlisted-courses/` and `booked-slot/`.
The services for applications, stats and upcoming mentor sessions still exist
but have no caller (see [dashboard-backend-data.md](dashboard-backend-data.md)).

## Dashboard runtime

### Render tree

```text
dashboard/layout.tsx          fetch users/me/ → useStore
└─ Suspense                   (AppProvider reads the URL query)
   └─ DemoDataProvider        which dummy datasets are switched on
      └─ AppProvider          persona, view, reducer state, dialogs, uploads
         ├─ AppShell          Sidebar + <ViewTransition> page column
         │  └─ page.tsx       home, or SupernovaPage(view) → Topbar,
         │                    PersonaSwitcher, PageHeader, the view
         └─ SupernovaOverlays InteractionDialog + feedback toast
```

The layout stays mounted while pages change, so the sidebar, dialogs and
in-memory state survive navigation. Only the page column animates.

### Routing

`src/app/dashboard/_supernova/lib/routes.ts` is the single source of truth:
`VIEW_ROUTES` maps each `ViewId` to its URL slug, sidebar label and sidebar
group. It is typed against `ViewId`, so a view without a route does not
compile.

Two query parameters carry extra state:

| Parameter | Meaning | Default |
| --- | --- | --- |
| `persona` | `free`, `verified` or `p004`; decides locks and page copy | `free` (omitted from URLs) |
| `item` | An application or mentor id; opens its dialog on arrival | none |

Only the search box sets `item` (`DashboardSearch` → `navigate(view, item)`).

### Persona and access

The persona is the dashboard's stand-in for the account's tier. It comes from
the URL, not from the user's account. `hasAccess()` in `lib/model.ts` decides
locks:

| View | `free` | `verified` | `p004` |
| --- | --- | --- | --- |
| Zenna, LTA Connect | Locked (gate / waitlist) | Open | Open |
| Project004 | Locked | Locked | Open |
| Everything else | Open | Open | Open |

The plan replaces this with the existing `is_approved` field on `users/me/`:
an approved student is the `verified` persona
([dashboard-backend-data.md](dashboard-backend-data.md#feature-user-tier)).

### State

| State | Where | Lifetime |
| --- | --- | --- |
| Current user | `useStore` (Zustand) | Until reload |
| Bookings, read notifications, notices, WhatsApp preference, AI findings, waitlist choices, Project004 requests | `appReducer` in `lib/reducer.ts`, one slice per persona | Until reload |
| Uploaded files | `useUploads` (object URLs, per persona) | Until reload |
| Open dialog, toast | `AppProvider` | Transient |
| Dummy data switches | `DemoDataProvider` | Browser tab (`sessionStorage`) |

Nothing in the dashboard's own state is sent to the backend.

### Data sources

| Source | Location | Used for |
| --- | --- | --- |
| API | `src/actions`, `src/lib/services` | User, home course cards, home calendar |
| Fixtures | `lib/fixtures.ts`, `lib/jobs.ts`, `home/testimonials.ts` | Persona copy, mentors, CST universities, gates, FAQs, help cards, jobs, testimonials |
| Demo data | `demo/demo-data.json` via `DemoDataProvider` | Optional dummy shortlists, documents, events, applications, session, notifications |

The topbar's **Choose options** switch (`DemoDataSwitch`) turns demo datasets
on per tab. When `colleges` or `events` is on, it **replaces** the real API
data on the home page, not adds to it.

## Styling

- Dashboard styles: `_supernova/supernova.css` (section pages and shell),
  `home/dashboard.css` (home), `button-motion.css` (glass-pill hover),
  `reference-fonts.css`.
- Fonts come only from the CSS variables `--font-plus-jakarta-sans` and
  `--font-anek-bangla` set in the root layout. Do not redeclare them.
- Design rules (hover colours, timings, reduced motion) are in
  [AGENTS.md](../AGENTS.md#design-implementation).

## Checks

| Command | What it checks | Current state |
| --- | --- | --- |
| `pnpm.cmd exec tsc --noEmit` | Types | Passes |
| `pnpm.cmd lint` | ESLint | Fails, see [review T2](review.md#t2-lint-scans-generated-build-folders) |
| `pnpm.cmd test:model` | Model and reducer | Fails, see [review T1](review.md#t1-the-model-test-script-does-not-run) |

None of these exercise the backend. Verify API-backed flows in a browser.
