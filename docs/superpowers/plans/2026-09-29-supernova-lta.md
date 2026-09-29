# Supernova LTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every source HTML view and persona at `/figma/dashboard` with reusable React components, LTA styling and working local interactions.

**Architecture:** A server route hosts a client app in a scoped font/style layout. Typed fixture modules, pure domain functions and a persona-local reducer support separate view modules and shared controls. URL search parameters own navigation; local state owns demo interactions without backend writes.

**Tech Stack:** Existing Next.js 16.1.6, React 19.2.3, TypeScript, scoped CSS, native dialogs/forms and Playwright; Node 24.19.0 is available for pure TypeScript test imports.

**Spec:** `docs/superpowers/specs/2026-09-29-supernova-lta-design.md` — read it and the unchanged source HTML before implementation.

## Global Constraints

- `/figma/dashboard` becomes canonical; `/figma/dashoard` redirects to it. Keep `/dashboard`, authentication routes, session cookies and backend services unchanged.
- The HTML is the authority for page structure, visible content, controls, fixtures, persona identities and entitlement states. LTA is the authority for visual language.
- Keep source fixture counts and text intact, including names and dates. Decode UTF-8 correctly.
- Keep dashboard hero cards in three columns at desktop widths of 1024px and above. Search stays borderless, including focused and hovered states.
- Use fluid layout, not screenshot-sized absolute coordinates or global CSS zoom for this multipage application.
- MainCTA: base #6B5A89, hover #5B4B7A, 200ms ease-out. Calendar: pale-gray hover, 150ms ease-out, no invented purple outline.
- Files stay in memory; local state does not claim server persistence. Never submit bookings, upload documents externally, send messages, charge money or mutate a real account.
- Preserve dirty work and `.env.local`; no secret output, unrelated commits, push or deployment. Additional outside skills, if needed, must use `pnpx skills` and be ignored.
- Stop and verify every task-started resource; preserve the user's existing server and browser tabs.

## Review Focus

1. Malformed/duplicate URL parameters and back/forward navigation must not crash or silently change entitlements — Task 2.
2. Switching personas with a dialog, search results or local bookings open must not leak another persona's state — Tasks 2 and 4.
3. Rejected files, duplicate filenames and reset/unmount must not leak object URLs or overwrite another upload — Task 6.
4. Calendar dates at month/year boundaries and booking without a chosen slot must stay valid and cannot confirm incomplete data — Task 4.
5. Long university names, filenames and German text at zoomed/narrow widths must remain contained and readable — Tasks 6 and 7.

## File responsibilities

All new app code lives below `src/app/figma/dashboard/`:

- `page.tsx`: server entry and Suspense fallback for query-driven client navigation.
- `layout.tsx`, `supernova.css`: scoped LTA fonts, metadata, theme and responsive shell rules.
- `_lib/types.ts`: `PersonaId`, `ViewId`, entitlements, fixtures and interaction types.
- `_lib/fixtures.ts`: shell/persona/journey/dashboard data.
- `_lib/applications.ts`, `_lib/mentors.ts`, `_lib/content.ts`: exact source application, mentor, job, document, notification, gate, FAQ and page copy.
- `_lib/model.ts`: pure URL validation, entitlement, chance calculation, upload and booking validation.
- `_lib/reducer.ts`: persona-local interaction state and typed actions.
- `_components/SupernovaApp.tsx`, `AppProvider.tsx`: app composition, reducer provider and URL navigation.
- `_components/AppShell.tsx`, `Sidebar.tsx`, `Topbar.tsx`, `PersonaSwitcher.tsx`: shell controls and global search.
- `_components/ui.tsx`, `Modal.tsx`, `BookingDialog.tsx`, `InteractionDialog.tsx`: shared visual primitives and focus-safe dialogs.
- `_components/ApplicationRow.tsx`, `MentorCard.tsx`, `Gate.tsx`: repeated source product structures.
- `_hooks/useUploads.ts`: file/object-URL lifecycle only.
- `_views/DashboardView.tsx`, `ZennaView.tsx`, `ConnectView.tsx`, `ShortlistingView.tsx`, `ProjectView.tsx`, `DocumentsView.tsx`, `NotificationsView.tsx`, `SupportView.tsx`: one module per source view, optionally view-local CSS where styles are substantial.

Other changes: legacy `src/app/figma/dashoard/page.tsx` and `layout.tsx`; `scripts/test-supernova-model.mjs`; replacement/expanded `scripts/test-figma-dashboard.mjs`; `scripts/figma-tests/{shell,products,interactions,documents,responsive}.mjs`; test command in `package.json`; `docs/figma-dashboard.md`, README and AGENTS guidance. Keep old Figma component files/assets intact unless a new component directly replaces their use; do not sweep-delete them.

## Test conventions

Pure tests use `node scripts/test-supernova-model.mjs`; Node 24 imports the leaf `.ts` modules directly. Those modules use erasable types and type-only imports; no TS enums, JSX or runtime alias imports. No extra test library is necessary.

Browser tests use `pnpm.cmd test:figma -- --suite shell` (or products/interactions/documents/responsive); no argument runs all suites. The existing Playwright script becomes the runner, uses `FIGMA_TEST_URL` or localhost:3000, closes every context/browser in `finally`, and saves evidence in ignored `.codex/artifacts/supernova/`. Test modules export `run(page, base, output): Promise<void>`. Each task adds regression assertions before its implementation, records the expected failure, then runs its owned suite. Do not rerun exhaustive suites after every trivial style edit.

### Task 1: Exact fixtures and pure domain behavior

**Files:** Create `_lib/types.ts`, `fixtures.ts`, `applications.ts`, `mentors.ts`, `content.ts`, `model.ts`, `reducer.ts`; create `scripts/test-supernova-model.mjs`. Modify the spec status only if execution is approved.

**Interfaces:**
- `PersonaId = 'free' | 'paid' | 'p004'`; `ViewId = 'dashboard' | 'zenna' | 'connect' | 'cst' | 'p004' | 'documents' | 'notifications' | 'support'`.
- Export `PERSONAS`, `JOURNEY`, `FOCUS`, `HERO`, `APPLICATIONS`, `MENTORS`, `CHANCE_UNIVERSITIES`, `JOBS`, `DOCUMENTS`, `NOTIFICATIONS`, `FAQS`, `GATES`, `PAGE_COPY`. Stable IDs; counts 9/6/5/3 respectively for applications/mentors/chance universities/jobs.
- `parseNavigation(params: URLSearchParams): {view: ViewId; persona: PersonaId}`; take first recognized parameter, otherwise dashboard/paid defaults.
- `hasAccess(persona: PersonaId, view: ViewId): boolean`; archived Zenna and mentor Connect remain accessible.
- `calculateChances(profile: ChanceProfile, universities: readonly ChanceUniversity[]): ChanceResult[]`; `validateProfile(profile): string[]`; `validateUpload(file: Pick<File,'name'|'type'|'size'>): string | null`; `validateBooking(date: string, slot: string, now: Date): string | null`.
- `initialState(): AppState`; `appReducer(state: AppState, action: AppAction): AppState`. State keyed by persona holds sessions, read IDs, reminder acknowledgment, preference, gate choices and handled requests. `AppAction` is a discriminated union: `book`, `read`, `acknowledgeAi`, `dismissAi`, `preference`, `gateChoice`, `handleRequest`, `reset`. Every persona action carries `persona`; reset clears all local state.

- [ ] Write failing pure assertions: exact fixture counts; source persona matrix; invalid query defaults; free cannot access Zenna; p004 can access archived Zenna/mentor Connect; actions do not mutate other personas; reset restores defaults.
- [ ] Run `node scripts/test-supernova-model.mjs`; confirm failure on missing modules.
- [ ] Extract exact UTF-8 fixtures and implement types/domain/reducer. The chance algorithm is `base=(cgpa-5)*9+(ielts-5)*8+germanBonus`, bonus none/A1/A2/B1/B2 = 0/2/4/7/10; each result is `round(clamp(base/difficulty,8,92))`, descending. Degree/field remain source controls; do not invent unsupported factors.
- [ ] Add assertions: defaults 7.8/7/A2 give base45.2 and ranked percentages 58,55,48,40,38; repeated input yields identical results. Reject nonfinite/out-of-range CGPA/IELTS and unknown selections. Upload accepts PDF/JPEG/PNG up to 10*1024*1024 bytes; reject empty, oversized and unsupported files. Booking rejects past/today dates and missing slots using local calendar dates, not UTC truncation.
- [ ] Run pure tests to PASS, then targeted TypeScript validation. Commit only these new task files with `feat: model Supernova personas and source content`.

### Task 2: Canonical route, reusable shell and navigation

**Files:** Create canonical `page.tsx`, `layout.tsx`, `supernova.css`, `_components/{SupernovaApp,AppProvider,AppShell,Sidebar,Topbar,PersonaSwitcher,ui,Modal}.tsx`; modify legacy `page.tsx` and make legacy layout a plain passthrough; modify Playwright runner and create `scripts/figma-tests/shell.mjs`. Preserve exact middleware exceptions.

**Interfaces:**
- `useApp(): {persona: PersonaId; view: ViewId; state: AppState; dispatch: Dispatch<AppAction>; navigate(view: ViewId, itemId?: string): void; setPersona(persona: PersonaId): void; openDialog(dialog: DialogState): void; closeDialog(): void}`.
- `DialogState` is a discriminated union with stable selected source IDs for application, booking, session, gate, requests, job, share, contact, settings and logout; avoid parallel booleans.
- `PageHeader({crumb,title,subtitle})`, `Card`, `Button({variant})`, `StatusBadge({tone})`, `ProgressBar({value})`, `EmptyState`, `Feedback`; preserve native HTML props and refs.
- `Modal({title,onClose,children})` uses native dialog with focus return. `Topbar` search consumes typed source fixtures and accessible result items.

- [ ] Add failing shell tests: anonymous canonical access stays canonical; legacy redirects; headings/profile default paid; eight navigation destinations update query; invalid/duplicate parameters fall back; reload and back/forward preserve selection; persona change stays on the current view; search results cannot expose locked product details.
- [ ] Run `pnpm.cmd test:figma -- --suite shell`; confirm missing canonical app behavior fails.
- [ ] Implement shell, query synchronization and shared primitives. Use Suspense for `useSearchParams`, `router.push` for navigation/persona changes and a validated optional `item` ID for search destination selection. Close dialog/search/drawer when persona changes. Preserve per-persona reducer state.
- [ ] Add a labeled borderless searchbox that searches accessible application/document/mentor fixtures. Arrow keys select results, Enter navigates, Escape dismisses; source product gates remain authoritative. Add sticky sidebar, notification badge, WhatsApp status, accessible persona tabs and mobile drawer. No new backend requests.
- [ ] Run shell tests to PASS, including Escape/focus return, keyboard search, malformed item IDs and state isolation. Commit task-owned files with `feat: add LTA Supernova shell and navigation`.

### Task 3: Dashboard and all product view structures

**Files:** Create all eight `_views/*.tsx`, `_components/{ApplicationRow,MentorCard,Gate}.tsx`; extend `supernova.css`, `SupernovaApp.tsx`; create `scripts/figma-tests/products.mjs`.

**Interfaces:** `DashboardView`, `ZennaView`, `ConnectView`, `ShortlistingView`, `ProjectView`, `DocumentsView`, `NotificationsView`, `SupportView` consume `useApp()`; source fixtures are immutable. `ApplicationRow({application,onOpen})`, `MentorCard({mentor,onBook})`, `Gate({content,onPrimary,onSecondary})` expose semantic controls.

- [ ] Add failing tests over all 24 view/persona combinations: headings and correct gates; dashboard 3 hero/4 suite cards; Zenna 9 rows and filters All9/Offers2/In progress2/Waiting2/Closed3; archived admission summary; Connect 6 mentors in paid/p004 and gate in free; Project004 3 jobs and ranks5–9 only in p004; Documents counts free0/paid4/p0044; notification source counts3/4/4; Support 3 cards/3 FAQs.
- [ ] Run products suite and capture expected missing-content failures.
- [ ] Implement source view structures and exact copy, including every HTML subtitle, tag, explanatory panel and CTA. Dashboard focus uses local mascot; source initials stay initials where portraits are unavailable. Derive entitlement styling and counts; all repeated elements use stable keys and shared primitives.
- [ ] Wire source next-step/card navigation, Zenna filters/application detail, support disclosures and notification navigation/read dispatch. Handle `item` IDs to open accessible matching details after a search selection, without re-opening on each render.
- [ ] Run products suite to PASS and inspect desktop screenshots of all eight views. Commit `feat: rebuild Supernova views in LTA styling`.

### Task 4: Booking, gates and shell interaction outcomes

**Files:** Create `_components/BookingDialog.tsx`, `InteractionDialog.tsx`; extend reducer/types as necessary without breaking Task1 interfaces; wire Connect, Support, Zenna, Project and shell controls; create `scripts/figma-tests/interactions.mjs`.

**Interfaces:** `BookingDialog({mentorId?: string; sessionId?: string; context?: string; onClose(): void})`; source mentor/team determines title, existing session ID determines rescheduling. Local dates use `YYYY-MM-DD` and labeled slots. `InteractionDialog({dialog: DialogState; onClose(): void})` resolves the union to focused reusable content.

- [ ] Add failing tests: choose mentor/book future day+slot/confirm updates summary+notification; reschedule updates same session; cancel leaves state intact; missing slot cannot confirm; next-month/year dates valid; Join call never requests camera or navigates to fabricated meeting URL; switching persona while booking is open closes it and leaves the other persona unchanged.
- [ ] Run interactions suite to observe failures.
- [ ] Implement booking flow with calendar navigation, available-day/slot state, native form validation, shared dialog focus lifecycle and success feedback. Preserve original July6 fixture until explicitly rescheduled; new appointments use valid future dates.
- [ ] Implement gate waitlist/notify selections without entitlement changes; explanatory feature dialogs; apply/talk support flow; AI confirm adds local notification and dismiss removes findings; mentor requests #1–#3 accept/decline update pending count; settings saves WhatsApp preference; profile displays identity/role; logout confirmation resets concept only, with sign-back-in state.
- [ ] Add assertions for all those outcomes, including original cookies unchanged and no account/write network requests. Run interactions and pure tests to PASS. Commit `feat: wire bookings and Supernova controls`.

### Task 5: Shortlisting, archived export and profile sharing

**Files:** Complete `ShortlistingView.tsx`, archived Zenna controls and project share dialog; add `_lib/download.ts`; extend products/interactions suites.

**Interfaces:** `downloadText(filename: string, content: string, mime?: string): void` creates a Blob/object URL, triggers download and revokes it. `formatAdmissionRecord(applications: readonly Application[]): string`; `formatProfileShare(): string` format only source facts; no backend-generated document claims.

- [ ] Add failing tests: labeled five-field form defaults/options; invalid numeric inputs block results; valid submit returns exactly five ranked source universities; repeat produces identical percentages and retains entered values; follow-up opens team contact with current result context.
- [ ] Run products suite to fail on unwired results, then implement controlled fields, pure validation/calculation, visible errors, source disclaimer and result bars/status colors.
- [ ] Add download tests: archived record contains all9 applications and admission summary; share preview contains Tino, rank7, 2340points and top2%; clipboard success/failure gives honest feedback and downloadable summary is available; no automated LinkedIn post.
- [ ] Implement text downloads and local copy/share using supported browser APIs; no invented official PDFs. Run products/interactions/pure tests to PASS. Commit `feat: add chance results and local exports`.

### Task 6: Document lifecycle and complete support/search integration

**Files:** Create `_hooks/useUploads.ts`; complete Documents, Notifications and Support views; integrate uploaded documents in Topbar search; create `scripts/figma-tests/documents.mjs`.

**Interfaces:** `useUploads(persona: PersonaId): {files: UploadedDocument[]; add(files: File[]): void; remove(id: string): void; reset(): void; error: string | null}`. Each document has unique ID, original filename/type/size, persona and local object URL. Context reset signals hook cleanup; native File objects never go to storage/API.

- [ ] Add failing assertions: valid PDF/JPEG/PNG upload and drop; source usage chips remain; free empty state changes after upload; unsupported, zero-byte and >10MB files show errors; duplicate filenames retain separate IDs; persona switch isolates files; long filename wraps; uploaded document is searchable and previewable.
- [ ] Run documents suite to capture failures; implement validation, file input/drop handlers, local preview/download and cleanup. Revoke URLs on remove/reset/unmount; keep ownership registry independent of array snapshots to avoid revoking newly retained files.
- [ ] Pin object URL lifecycle with browser instrumentation of create/revoke calls; remove/reset releases each created URL once. Support Email is exactly `mailto:info@letterstoabroad.com`; WhatsApp shows source contact/availability without invented phone; FAQ controls expose all complete answers. Notifications remain in feed when read and badge derives from current persona.
- [ ] Run documents and shell/interactions suites to PASS. Commit `feat: complete local document vault and support`.

### Task 7: Responsive fidelity, full acceptance and cleanup

**Files:** Refine scoped styles and asset slots; create `scripts/figma-tests/responsive.mjs`; update `package.json`, `AGENTS.md`, `README.md`, `docs/figma-dashboard.md` and plan completion checkboxes. Evidence stays ignored.

**Interfaces:** Full test runner executes all five browser suites and pure tests; responsive suite saves source-view screenshots and asserts rendered bounds, image loading and focus/control usability.

- [ ] Add regression checks at 1920/1425/1280/1024/960/768/640/480 CSS pixels, all8 views; zoom equivalents50/67/80/100/125/150/175/200%; all3 desktop dashboard heroes fully visible at1024+; sidebar y stays fixed after scrolling; no horizontal page overflow; text ranges stay within cards; dialogs/drawer fit and close; search has zero border/outline/shadow; CTA and calendar hover colors/timings match spec; reduced motion removes animation.
- [ ] Run responsive suite to locate real failures. Fix layouts using minmax grids, wrap/auto height, bounded local scrolling and breakpoints. Inspect screenshots of every view and representative locked/archived/mentor states; do not equate passing bounds tests with visual fidelity.
- [ ] Run `node scripts/test-supernova-model.mjs`, `pnpm.cmd test:figma`, scoped ESLint on the new route/tests/legacy redirect/middleware/config, and `pnpm.cmd exec tsc --noEmit`; all must pass. Record unrelated full-repository lint failures separately if run.
- [ ] Run isolated production build with `$env:NEXT_DIST_DIR='.next-codex'; pnpm.cmd build`; remove env override afterwards and restore only build-induced tsconfig edits. Both reference routes must prerender/build successfully.
- [ ] Update docs to describe canonical route, HTML/LTA source roles, local interaction boundaries, commands and evidence. Update AGENTS's obsolete whole-frame zoom instructions for this new fluid application; retain cleanup/security rules. Do not rewrite unrelated README content.
- [ ] Use a fresh final reviewer per the selected execution skill, resolve concrete findings and rerun only affected verification. Commit task-owned final changes with `test: verify responsive Supernova interactions`.
- [ ] Close every task-created browser tab/helper and stop all task-started resources. Verify process/listener inventory against baseline, preserve preexisting services, then provide implementation summary and clickable screenshots with limitations.

## Self-review result

All spec view/interaction rows map to Tasks2–6; persona/domain constraints map to Task1; visual/accessibility/responsive verification maps to Tasks2 and7. The five Review Focus conditions each have explicit regression tests. Interface names/types are shared consistently; pure modules avoid Node runtime import resolution issues. No new backend subsystem or package installation is planned. Native execution is recommended because the tasks share reducer and component interfaces and the existing worktree is dirty; one owner can preserve those changes consistently, with a fresh final review.

Status: plan prepared and self-reviewed; awaiting user review and execution-method selection. No product implementation has started.
