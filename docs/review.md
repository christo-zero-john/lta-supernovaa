# Code review: `supernova-redesigned` against `main`

Reviewed 2026-09-30. The branch is 256 commits ahead of `main` and changes
177 files (+14,670 / −4,075). Almost all of it is the new dashboard under
`src/app/dashboard/_supernova`. Outside it, the branch only removes a token
log from `middleware.ts`, adds an optional `gender` to the `User` type, and
adds `TruncatedText` and `SmoothScroll`.

The review read the TypeScript and TSX changes and ran the project checks. It
did not review the CSS for pixel accuracy.

Most of the dashboard shows placeholder data today (see
[dashboard.md § Data status](dashboard.md#data-status)). Most items below
only matter once a page is wired to real data. Each item says **when** to fix
it.

## Summary

| ID | Item | Kind | Introduced by | Fix when |
| --- | --- | --- | --- | --- |
| [B1](#b1-picking-the-already-selected-search-result-does-nothing) | Picking the already-selected search result does nothing | Bug | This branch | Zenna or Connect opens to users |
| [B2](#b2-no-sessions-booked-yet-shows-above-a-booked-session) | "No sessions booked yet" shows above a booked session | Bug | This branch | Connect booking goes live |
| [R3](#r3-logout-goes-to-a-route-that-does-not-exist) | Logout goes to `/auth/login`, which does not exist | Bug | Already on `main` | Now (one line) |
| [L1](#l1-access-comes-from-the-url-not-the-account) | Access comes from the URL, not the account | Launch blocker | This branch | Before real users see locks |
| [L2](#l2-demo-controls-ship-to-every-user) | Demo controls ship to every user | Launch blocker | This branch | Before production release |
| [L3](#l3-demo-data-replaces-real-data) | Demo data replaces real data | Launch blocker | This branch | With L2 |
| [L4](#l4-hardcoded-concept-identities) | Hardcoded concept identities | Content | This branch | When each page is wired |
| [C1](#c1-unused-concept-logout) | Unused concept logout | Cleanup | This branch | Any time |
| [C2](#c2-uncalled-api-services) | Uncalled API services | Cleanup | This branch | When Zenna/Connect are wired |
| [T1](#t1-the-model-test-script-does-not-run) | `test:model` does not run | Tooling | This branch | Now |
| [T2](#t2-lint-scans-generated-build-folders) | Lint scans generated build folders | Tooling | Local setup | Now |
| [T3](#t3-pre-existing-lint-errors-in-the-api-layer) | Pre-existing lint errors in the API layer | Tooling | Already on `main` | With API work |
| [T4](#t4-two-lockfiles) | Two lockfiles | Tooling | Already on `main` | Now |

---

## Bugs

### B1. Picking the already-selected search result does nothing

**Where:** `src/app/dashboard/_supernova/components/AppProvider.tsx:84-87`,
triggered from `components/DashboardSearch.tsx:56`.

**What happens:** Search for a mentor (or a Zenna application) and pick it.
Its dialog opens and the URL gets `?item=<id>`. Close the dialog, search
for the same result, and pick it again. Nothing opens.

**Why:** This is a search/dialog-state bug, not an access bug. The dialog
for a search result is derived from the URL's `item`, unless that item is
marked dismissed. `navigate()` first calls `closeDialog()`, which marks the
*current* URL's item as dismissed. It then pushes the same URL, so the item
stays dismissed.

**Reach today:** Search only lists mentors and applications when the persona
has access (`verified` or `p004`), and applications also need the demo switch.
With the default `free` persona, search offers only documents, which have no
dialog, so the bug cannot be triggered.

**Fix direction:** In `navigate()`, do not mark the target item as
dismissed. Reset `dismissedItem` when navigating to an item, or open the
dialog directly from search instead of routing through the URL.

### B2. "No sessions booked yet" shows above a booked session

**Where:** `src/app/dashboard/_supernova/views/ConnectView.tsx:14-16, 41`.

**What happens:** As `?persona=verified`, with the demo "Mentor session booked"
switch off, book a 1:1 with a mentor. The page shows the empty message
"No sessions booked yet…" and, directly below it, the new "Session
booked — <mentor>" card.

**Why:** The empty state checks only `session`, which is the demo session or
a rescheduled one (`id === "source-session"`). Sessions booked on the page
live in `local` and are rendered separately, so they don't count.

**Fix direction:** Show the empty state only when there is no demo session
and no local booking. Once `booked-slot/` feeds this page, derive both cards
from the one fetched list.

### R3. Logout goes to a route that does not exist

**Where:** `src/app/dashboard/_supernova/components/Sidebar.tsx:71`.

**What happens:** Logout clears `token` and `refresh_token`, then pushes
`/auth/login`. The `(auth)` route group adds no URL prefix, so that route
does not exist. Middleware then redirects the now-unauthenticated request to
`/signup`, not `/login`.

**Introduced by:** Already on `main`; the redesign carried it over.

**Fix direction:** Push `/login`. Consider a backend logout endpoint that
invalidates the refresh token (asked in
[dashboard-backend-data.md](dashboard-backend-data.md#feature-log-out)).

---

## Launch blockers

These are deliberate parts of the concept build. They are not defects while
the dashboard shows placeholder data, but each must change before real users
depend on it.

### L1. Access comes from the URL, not the account

**Where:** `lib/model.ts:35-41` (`hasAccess`), `lib/routes.ts`
(`personaFromParams`).

The old dashboard chose its layout from the account: `signup_platform_type`
plus `is_email_verified`, `is_onboarding_completed` and `is_approved`. The
redesign ignores those flags. Locks for Zenna, Connect and Project004 depend
only on `?persona=`, which any user can edit.

**Fix:** `users/me/` already returns `is_approved`, and an approved student
is the `verified` persona. Derive the persona from the user, not the URL, and keep the query parameter only for internal previews.

### L2. Demo controls ship to every user

**Where:** `components/PersonaSelect.tsx` (rendered by `Topbar` and the home header),
`demo/DemoDataSwitch.tsx` (rendered by `Topbar` and the home header).

Every signed-in user sees the persona dropdown in the navbar and
the **Choose options** dummy-data switch. Nothing gates them by environment
or role.

**Fix when:** Before a production release. Hide both behind an environment
flag or an internal-user check.

### L3. Demo data replaces real data

**Where:** `home/Dashboard.tsx:147-150` (calendar), `home/Dashboard.tsx:313`
(course cards).

With the `events` or `colleges` switch on, the home page shows demo data
*instead of* the user's real booked sessions or shortlisted courses. A user
who flips a switch can hide their own data.

**Fix when:** With L2. Once the switch is internal-only, this is acceptable
for previews.

### L4. Hardcoded concept identities

The concept's sample student and staff appear as literal text:

| Text | Where |
| --- | --- |
| "Tino Sunny (you)" on the leaderboard | `views/ProjectView.tsx:60` |
| "Tino Sunny" profile text and `Tino-Sunny-Project004.txt` download | `components/InteractionDialog.tsx:238, 262` |
| Mentor "Jisha" | `views/ZennaView.tsx:184`, `lib/fixtures.ts:60` |
| "Good morning, Tino!" and similar greetings | `lib/fixtures.ts` `PAGE_COPY[*].dashboard` (currently unused: the home page uses the real name) |

**Fix when:** Each page is wired to real data. Use `useCurrentUser()` for the
student and the assigned counsellor from the backend.

---

## Cleanup

### C1. Unused concept logout

`InteractionDialog` has a `logout` dialog ("Log out of this concept?") that
calls `reset()` and sets `signedOut`. Nothing opens a `logout` dialog, and
nothing reads `signedOut`. The sidebar uses the real logout instead. Remove
the dialog, `reset`, `signedOut` and `resetVersion` together, or keep them
only if a "reset demo" control is planned.

### C2. Uncalled API services

`applications`, `stats` and `mentorsession` services and actions have no
caller since the old dashboard was removed. Keep them: the Zenna and Connect
pages need them once the backend adds the fields listed in
[dashboard-backend-data.md](dashboard-backend-data.md).

---

## Tooling

### T1. The model test script does not run

`pnpm.cmd test:model` fails at import:

```text
SyntaxError: The requested module '.../lib/fixtures.ts' does not provide an export named 'APPLICATIONS'
```

Commit `e14741e` moved the sample applications from `fixtures.ts` into
`demo/demo-data.json`, but `scripts/test-supernova-model.mjs` still imports
and asserts on `APPLICATIONS`. Update the script to read the demo data, or
drop that assertion.

### T2. Lint scans generated build folders

`pnpm.cmd lint` reports about 23,500 problems. Nearly all come from
git-ignored build output in `.codex/` and `.next-codex/`, which
`eslint.config.mjs` does not ignore. Add both to `globalIgnores`. Linting
`src` alone gives 8 errors and 4 warnings (T3).

### T3. Pre-existing lint errors in the API layer

The 8 errors in `src` are `no-explicit-any` in `src/actions/*.actions.ts` and
`src/lib/axios.ts`. These files are unchanged from `main`. Type the error
handlers when those actions are next touched.

### T4. Two lockfiles

Both `package-lock.json` and `pnpm-lock.yaml` are tracked. AGENTS.md uses
pnpm; the README's setup still uses npm. Pick one package manager, delete the
other lockfile, and align the README.

---

## Fix checklist by feature

Use this list when a feature moves from placeholder to real data.

| When you wire… | Also fix |
| --- | --- |
| Account tier (`is_approved`) | L1 |
| LTA Connect (mentors, booking) | B1, B2, C2, L4 (mentor names) |
| Zenna (applications, stats) | B1, C2, L4 (counsellor) |
| Project004 | L4 (leaderboard, profile download) |
| Production release | L2, L3, R3 |
| API layer changes | T3 |
