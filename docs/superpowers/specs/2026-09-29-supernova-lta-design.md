# Supernova concept rebuilt in LTA's design language

Status: implemented and locally verified on 2026-09-29. The user authorized execution without further approval questions.

## Intent and source precedence

Rebuild the supplied `supernova_concept_v3 (1).html` as a cohesive, interactive React application at `/figma/dashboard`. The HTML is the authority for page structure, visible content, controls, fixtures, persona identities and entitlement states. LTA is the authority for visual language. Preserve the HTML file unchanged as the reference.

The user approved the direction on 2026-09-29 with “continue.” Success means all source pages and states are implemented, navigation and controls work, components are reusable, and the result looks like LTA rather than the HTML's original generic styling.

Visual sources:

- Existing dashboard recreation and its local Figma assets, fonts and cached high-fidelity context.
- [LTA frame 7892:34777](https://www.figma.com/design/cZctV1sX6rBPpoAUbnUdWg/Letters-To-Abroad?node-id=7892-34777), inspected in the browser. Its selected desktop frame is 1425 × 1924, with rounded pale panels, LTA branding, mascot, image cards and purple controls.
- Previously verified MainCTA states: base #6B5A89, hover #5B4B7A, 200ms ease-out. Calendar states, wherever used in booking: pale-gray hover, 150ms ease-out, no invented purple outline.

This is a redesign using LTA's language, not a literal copy of one Figma screen. Elements specific to the old Figma dashboard, such as testimonials and event fixtures, are not added where absent from the HTML. The earlier corrections remain design constraints: conventional desktop density, three dashboard hero cards, sticky sidebar, contained text, and no search border effects.

## Scope and routes

- `/figma/dashboard` becomes the canonical application URL rather than redirecting to the misspelled route.
- `/figma/dashoard` redirects to the canonical application, preserving the original URL's accessibility.
- All eight source views render within the shared shell. `?view=zenna&persona=paid` and equivalent supported values allow refresh, bookmarks and browser back/forward without creating new top-level routes. Missing values default to dashboard and paid; unknown values fall back safely to those defaults.
- Settings and profile use a shared dialog; logout uses a local concept-session reset, followed by an explicit sign-back-in action. These are source shell controls, not new product pages.
- Keep `/dashboard`, authentication routes, session cookies and backend services unchanged. Exact reference-route middleware exceptions remain restricted to the two URLs.

## Persona and entitlement model

One identity, Tino Sunny, is used in all three moments. Switching persona updates the role, journey, product entitlements, dashboard focus, document fixtures, notifications and appropriate product states. It does not silently switch the selected view or erase that persona's local interactions.

| Persona | Source label and role | Journey stage | CST | Zenna | Connect | Project004 |
| --- | --- | --- | --- | --- | --- | --- |
| free | Free user; 2025 · Lead; Explorer | Aspirant | Enabled | Locked | Waitlist | Coming 2027 |
| paid | Paid client; 2026 · Applicant; Applicant | Applicant | Enabled | Live | Student | Coming 2027 |
| p004 | Project004 era; 2027 · In Germany; Job seeker | In Germany | Enabled | Archived | Mentor | Live |

Locked navigation stays discoverable and opens the appropriate gate, matching the HTML. It never grants entitlement merely because a CTA was clicked. Notifications and displayed unread badges derive from the active persona's local read state.

## Shared shell and LTA styling

Preserve the HTML's shell hierarchy: branding; Main menu; My suite; Settings and Log out; account card; search, WhatsApp status, notification control and avatar; persona demo strip; page content.

Use the existing LTA logo and exact supplied local assets where they fit their meaning. Use the original mascot in the dashboard focus illustration, rather than the HTML's emoji avatar. Maintain its aspect ratio. Use consistent line icons and source initials where no exact brand/portrait asset exists; do not substitute a photograph of a different person.

Use Plus Jakarta Sans for body text and controls, Anek for LTA headings and brand treatment, and existing source fonts only where appropriate. Pale neutral/lavender surfaces, white rounded cards, muted purple accents, subtle inset button highlights, and soft purple/image gradients replace the HTML's bright generic palette. Status colors remain distinct and always have text labels.

Spacing and density: approximately 247px sidebar at roomy desktop widths, 12px outer shell spacing, 24px panel padding, 24–32px section gaps, and 12–18px grid gaps. Body/control text is readable at approximately 13–14px; headings approximately 28px. Use fluid layout, not screenshot-sized absolute coordinates or global CSS zoom for this multipage application. Keep dashboard hero cards in three columns at desktop widths of 1024px and above. Four suite cards may remain one row at wide desktop widths and become two rows as space reduces.

The sidebar stays sticky at top and scrolls internally if its contents exceed the viewport. Narrow widths use an accessible menu drawer with close and Escape handling. Tables/rows reflow into readable cards before their fields collide. Long filenames, university names, badges and quotes wrap inside their owning card. No page-level horizontal overflow hiding to mask defects. Search stays borderless, including focused and hovered states; other controls retain visible keyboard focus.

## View inventory and acceptance

| View | Required source elements and states |
| --- | --- |
| Dashboard | Persona-specific greeting and subtitle; mascot focus banner and next-step CTA; five-stage journey strip; three persona-specific hero cards; four suite cards with original descriptions, entitlements and CTA labels. Free: admission chances. Paid: deadline, offer and missing document. Project004: job matches and rank. |
| Zenna | Free gate and four feature chips. Paid: four statistics, five filters, all nine application rows with logo initials, course, status, completion and deadline; two AI findings with confidence and source filename; confirm/dismiss controls; WhatsApp information panel. Archived: admission summary, download record and all nine archived rows. |
| LTA Connect | Free launch gate and four features. Paid: next session with Geen Geo, Join call and Reschedule; six complete mentor cards with roles, tags, ratings and booking buttons. Mentor: full-circle banner, three pending requests and Review requests; the same mentor directory. |
| Course Shortlisting | Bachelor degree, CGPA, IELTS, German level and target-field controls with all original options; initial empty results explanation; chance-check CTA; five ranked university results, percentages and bars; source disclaimer; results follow-up CTA. |
| Project004 | Free/paid launch gate and four features. Enabled: three statistics, all three job rows with match and application status plus View; Logistics Challenge leaderboard ranks 5–9 with Tino at 7, score and employer explanation; profile card and share action. |
| Documents | Upload/drop zone with source supported types and 10MB limit; persona-specific fixture documents, metadata and USED IN chips; explicit free-persona empty state. Uploaded local files appear in the same list. |
| Notifications | Every source notification for the active persona, its icon and timestamp; local read/unread state connected to the shell badge. Selecting a relevant notification navigates to its corresponding source product view. |
| Support | Source introduction, WhatsApp / Book a call / Email cards, all three FAQ questions and complete answers. FAQs expand/collapse with keyboard and pointer. |

Keep source fixture counts and text intact, including names and dates. Decode UTF-8 correctly so umlauts, punctuation and symbols do not become mojibake. Extract fixtures into typed data rather than duplicating markup across persona branches.

## Interaction contracts

The implementation is a local interactive concept. It must give concrete outcomes without submitting bookings, uploading documents to a server, sending messages, charging money, or mutating a real account. These boundaries belong in the spec and developer documentation; product flows should communicate local outcomes where needed rather than expose implementation jargon everywhere.

| Control | Required behavior |
| --- | --- |
| Sidebar, focus CTA, hero and suite cards | Navigate to the exact view associated with the HTML element; selected navigation and URL update; main content returns to top; browser history works. |
| Persona tabs | Switch typed persona state and all dependent content, preserving the current view and separate persona-local changes. |
| Global search | Search source applications, documents and mentors; show a compact result panel with category, name and destination; selection opens that view and relevant item. Empty query closes results; no-results is explicit; Escape closes and keyboard navigation works. |
| WhatsApp status and settings | Toggle a local notification preference through a settings dialog; shell status updates; save gives a visible outcome. Profile opens the same account settings with identity and active role. |
| Logout | Confirm resetting only the concept session. A local signed-out state offers sign back in. Never call the real logout API or modify cookies. |
| Zenna filters | Show the source counts and matching application subset; active filter has accessible selected state. Archived mode remains read-only. |
| Application row | Open a details dialog containing the source course, status, completion and next deadline. No invented admissions decision or workflow mutation. |
| AI Confirm & notify / Dismiss | Confirm records a local reminder acknowledgment, updates the agent panel and adds a local notification; dismiss removes the findings from the panel. Neither sends WhatsApp messages. |
| Archived record download | Generate a truthful downloadable text/CSV summary of the nine source application fixtures and admission summary. Do not claim to download an original official document. |
| Gates: apply, learn, waitlist, notify, how it works | Open focused dialogs using the source product context. Waitlist and launch-notification choices record a local selected state and update the CTA; explanatory actions expose the original feature information; apply/talk actions open the support booking/contact flow. |
| Mentor Book 1:1 and Support Book a call | Open a reusable booking dialog for that mentor or the team; pick a valid future day and an available local slot; confirm updates a local session summary and notification. Include validation, cancel, success and reschedule states. |
| Join call | Open a session details/ready dialog for the source upcoming session; no fabricated live meeting URL or camera permissions. |
| Reschedule | Reuse the booking dialog with the existing session; selected new time updates the local next-session card and notification. |
| Review requests | Show three local request rows with accept/decline controls; handled requests update the pending count and provide feedback. Source has no request identities, so use clearly labeled anonymized request numbers, not invented real people. |
| Chance check | Controlled form, source defaults/options, native bounds plus validation; compute five results using the source formula and difficulty factors. Remove random noise so the same inputs yield repeatable results. Retain source 8–92 bounds, ordering, status colors and follow-up control. This reproduces concept logic, not a validated admissions model. |
| Result follow-up | Open team support booking/contact with the calculated results included in the local dialog context. |
| Job View | Show details from that exact source job row, match and application status, without submitting an application. |
| Share profile | Open a preview of source rank/score/profile text; copy locally or download a shareable summary. Opening LinkedIn's public sharing interface is optional; never automatically publish to LinkedIn. |
| Documents upload/drop | Accept PDF/JPG/JPEG/PNG up to 10MB per file; validate unsupported/oversized files and provide a visible error; list valid files and create local preview/download object URLs. Keep files in memory only; revoke URLs when removed, reset or unmounted. No external upload. |
| Notifications | Mark selected items read, update badge, and navigate to the associated view. All source feed content stays available. |
| WhatsApp support | Open the source contact/availability details and local contact dialog; do not invent a support phone number. |
| Email support | Open a mailto draft addressed to the HTML's info@letterstoabroad.com; do not send email. |
| FAQ | Accessible disclosures with complete source answers. |

Dialog behavior is shared: heading, explicit close, Escape, sensible initial focus, focus return to trigger and appropriate backdrop dismissal. Feedback uses an accessible live status region. Bookings, preferences, read states and waitlist choices last within the current browser session; refreshing does not claim server persistence.

## React structure and state

- A server page and scoped font/style layout host a focused client application root. Keep the client boundary around interactive concept UI; do not convert unrelated routes.
- Typed `PersonaId`, `ViewId`, entitlement unions and fixture records live in small data/model modules. Derive active role, counts, filtered rows and access states from these inputs rather than maintaining redundant state.
- A reducer/context owns persona-local bookings, read notifications, preferences, gate selections and AI acknowledgments. Upload file/object-URL handling is isolated in a focused hook. Page-local filters and controlled forms remain in their own views.
- URL navigation state uses supported Next router/search-parameter APIs with validated input and back/forward synchronization. Avoid DOM replacement, `innerHTML`, HTML-template injection and direct event-handler strings.
- Reuse `AppShell`, `Sidebar`, `Topbar`, `PersonaSwitcher`, `PageHeader`, `Card`, `Button`, `StatusBadge`, `ProgressBar`, `Modal`, `BookingDialog`, `EmptyState` and `Feedback` components. Each view is a separate focused module; shared data rows/cards compose these primitives.
- Reuse existing local assets, icon wrappers and fonts where suitable. Avoid installing a UI library for controls already available through native elements and the project's existing dependencies. No extra outside skill is necessary; if one becomes necessary, manage it using `pnpx skills` and ignore its installation/cache files as requested.
- Do not copy backend-dependent dashboard components wholesale if they assume a real session or API. Reuse their visual primitives/assets through explicit props without pulling backend effects into the concept.
- Use stable fixture IDs and keys, label every input, use real buttons/links, and avoid clickable nonsemantic divs. Respect reduced motion.

## Motion and visual engagement

Engagement comes from useful state changes, purposeful art and clear feedback. Use subtle 150–200ms surface transitions, short content fades on view/persona switches, progress-bar updates, active filter transitions and confirmation feedback. Keep controls anchored; no exaggerated card lift, animated borders, moving mascot speech bubbles or layout-shifting hover effects. Reduced-motion mode removes motion while preserving outcomes.

## Verification and delivery

Before implementation, create a testable inventory from this spec and the HTML. Browser verification must cover all 24 view/persona combinations, shell controls, source fixture counts and representative interaction paths. Required regression checks include gates not granting access; nine Zenna rows and filter counts; six mentors; deterministic five-university results and invalid inputs; upload type/size handling; local booking/reschedule outcomes; AI acknowledgment/dismissal; archived download; notification badge/read state; settings/logout; FAQ; global search; URL refresh/back/forward; dialog focus/Escape and mobile drawer dismissal.

Render at 1920, 1425, 1280, 1024, 960, 768, 640 and 480 CSS pixels, plus desktop zoom equivalents from 50% through 200%. Check asset loading, three complete desktop hero cards, sticky sidebar, text/glyph containment, zero page overflow, form usability and reduced motion. Capture screenshots for every view, including representative locked and archived states. Inspect the rendered pages rather than relying on component tests alone.

Run scoped ESLint, TypeScript and an isolated `.next-codex` production build. Keep unrelated repository lint issues separate. Update project guidance and route documentation for the canonical URL and new test coverage; replace obsolete visual assertions that require the old single-screen dashboard at the canonical route.

Preserve preexisting dirty files and `.env.local`; do not print secrets, commit unrelated changes, push or deploy. At handoff, summarize implemented scope, verified behavior and local-only limitations, and link browser evidence. Stop and verify every task-started server, listener, watcher, browser helper and terminal job. Preserve the user's preexisting development server and user-owned browser tabs.

## Review checklist

- Eight source views and all three persona states have explicit coverage.
- Every source button has a defined, reviewable local outcome.
- HTML content/structure and LTA styling have distinct source authority.
- Canonical routing, legacy redirect, history and account boundaries are specified.
- Component boundaries, state lifetime, validation and file cleanup are explicit.
- Density, text containment, sticky navigation and motion constraints reflect the user's corrections.
- Backend integrations, payments and external communications are not implied by local prototype behavior.
- No implementation decision is left as an unresolved placeholder.
