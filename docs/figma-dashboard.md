# Figma dashboard and LTA concept pages

The Dashboard navigation view at `/figma/dashboard` preserves the first Figma reference (`lnOH0IYXWcqSfk8e4jobzq`, node `1:514`). Its original university cards, character and speech bubble, three suite cards, calendar/events, testimonials and footer are reused from `src/app/figma/dashoard/_components`. The legacy URL redirects to the canonical route.

The remaining seven views use the supplied `supernova_concept_v3 (1).html` for their content, controls and persona states, styled in LTA's design language. The HTML does not replace the Dashboard view. Product titles on the original dashboard open Course Shortlisting, LTA Connect and Zenna; the sidebar opens Documents, Notifications and Support. The remaining menu options are available within those pages' shared shell.

The original inset reflection on primary and secondary pill buttons travels around their edge on hover and keyboard focus. No additional light, pseudo-element or outer glow is added. Translucent gradients and backdrop blur preserve a glass finish; the fill, button geometry and label remain still. The effect is shared between the original dashboard and other pages, ignores disabled controls and stops under reduced motion. Controls without an existing inset reflection retain their existing hover. Search remains borderless.

Interactions and uploads remain browser-memory concept state, with no account/backend writes. Bookings, rescheduling, persona gates, preferences, application details, chance results, mentor requests, notifications, local downloads and upload previews are interactive.

Validation against the user's existing localhost server:

- `pnpm.cmd test:figma:model`
- `pnpm.cmd test:figma`
- `node scripts/test-figma-dashboard-restore.mjs`
- `node scripts/test-lta-button-motion.mjs`
- `pnpm.cmd exec tsc --noEmit`
- Scoped ESLint and isolated `NEXT_DIST_DIR=.next-codex` production build.

Ignored browser evidence: `.codex/artifacts/supernova`, `.codex/artifacts/dashboard-restored` and `.codex/artifacts/button-motion`. Responsive tests include 480-1920 CSS pixels and 50%-200% zoom equivalents. They verify geometry and interaction outcomes; screenshots are inspected separately. Browser helpers are closed after tests, and user-started servers remain running.
