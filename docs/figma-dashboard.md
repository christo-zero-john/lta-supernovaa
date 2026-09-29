# Supernova: one LTA account

Canonical route: `/figma/dashboard`. Legacy `/figma/dashoard` redirects here. View/persona bookmarks use `?view=zenna&persona=paid`; back/forward and refresh preserve selection.

The unchanged `supernova_concept_v3 (1).html` defines source content, controls, layout hierarchy and persona entitlements. LTA frame 7892:34777 and the previous dashboard recreation define typography, rounded surfaces, subdued purple controls, artwork and motion. This is an LTA redesign of the HTML, not a copy of the old single-screen Figma dashboard.

## Views and states

Dashboard, Documents, Notifications, Support, Zenna, LTA Connect, Course Shortlisting and Project004 render in one shell. All three source personas are implemented: free Explorer; paid Applicant; Project004 Job seeker with archived Zenna and mentor Connect. Source counts are retained: nine applications, six mentors, five chance results and three jobs.

Main navigation stays sticky and scrolls internally when necessary. At 1024px and above the dashboard has three hero cards. Layout is fluid, with smaller grids and a mobile drawer; no global frame zoom or hidden horizontal overflow. Search has no border effects. LTA CTA hover darkens from #6B5A89 to #5B4B7A over 200ms ease-out. Booking-calendar hover fades to pale gray over 150ms. Reduced-motion preferences are honored.

## React organization

`src/app/figma/dashboard` hosts scoped fonts/CSS, a server entry and interactive client app. Typed fixtures and pure validation/calculation functions are in `_lib`; a reducer/provider owns persona-local interactions. Separate `_views` compose shared shell, cards, buttons, status/progress, application/mentor rows, gates and native dialogs. Upload URL ownership is isolated in `_hooks/useUploads.ts`.

Source strings were extracted directly in UTF-8. Search covers accessible source applications/mentors/documents and uploaded files; selections open details or focus the matching document. Locked products remain discoverable and gates never grant access implicitly.

## Local interactions

Booking and rescheduling save local sessions and feed notifications. Team bookings remain viewable in Support even for free users, and correctly retain the LTA-team identity. Mentor request accept/decline updates pending counts. Zenna filters, AI confirm/dismiss, notification reads and badges, profile/settings/WhatsApp preference, waitlist choices, FAQ disclosures and concept logout work. Logout resets only local concept data; real cookies/accounts are untouched.

Shortlisting retains the HTML's basic formula, bounds and copy, with random noise removed for repeatable results. It is concept logic, not a validated admissions model. Degree/field controls retain source options but do not invent new prediction factors.

Uploads accept PDF/JPEG/PNG up to 10MB, stay in memory, have local preview/download/remove controls and revoke object URLs on removal/reset/unmount. Duplicate filenames remain separate; files and validation errors are persona-local. Archived application records and Project004 sharing generate truthful local text summaries. Email opens a draft; no messages or LinkedIn posts are sent automatically.

The app does not submit bookings, upload to a backend, contact an AI service, mutate accounts or process payments. Refresh clears local interaction state. The real authenticated `/dashboard` stays independent; middleware bypass remains restricted to the exact two reference paths.

## Verification commands

With the user's server running:

```powershell
pnpm.cmd test:figma:model
pnpm.cmd test:figma
pnpm.cmd test:figma -- --suite shell
pnpm.cmd test:figma -- --suite products
pnpm.cmd test:figma -- --suite interactions
pnpm.cmd test:figma -- --suite documents
pnpm.cmd test:figma -- --suite responsive
pnpm.cmd exec eslint src/app/figma/dashboard src/app/figma/dashoard/page.tsx src/app/figma/dashoard/layout.tsx scripts/test-figma-dashboard.mjs scripts/test-supernova-model.mjs
pnpm.cmd exec tsc --noEmit
```

The browser suite checks all 24 view/persona states, original counts/copy, gates, filters, keyboard search and dialogs, local bookings, team identity/accessibility, files/URL cleanup, deterministic forms, downloads, settings/notifications/requests/logout and FAQ. Responsive checks cover eight widths (1920,1425,1280,1024,960,768,640,480) across eight views, eight zoom equivalents (50,67,80,100,125,150,175,200 percent), glyph containment, assets, sticky navigation and reduced motion. Evidence is ignored in `.codex/artifacts/supernova`. Test browsers close in `finally`.

For a production build beside the existing dev server, set `NEXT_DIST_DIR=.next-codex`; restore build-generated tsconfig and next-env route references to the dev output after verification. Preserve preexisting resources and stop every task-started helper before completion. No backend/live-account integration is implied by local checks.
