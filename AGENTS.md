# Letters to Abroad frontend

## Project

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind 4 and scoped component CSS.
- `src/app/(auth)` contains public onboarding routes; the route group adds no URL prefix.
- `src/app/dashboard` is the authenticated, API-backed student dashboard.
- `src/app/figma/dashboard` is the canonical public Supernova concept. `/figma/dashoard` redirects to it. Views/personas are query parameters; the supplied HTML owns content/structure and LTA owns styling.
- API boundaries live in `src/lib/services`, server actions in `src/actions`, and shared Axios/session handling in `src/lib/axios.ts`, `src/lib/cookies.ts`, and `src/middleware.ts`. Zustand user state is in `src/store/useStore.ts`.
- Read README.md for backend/setup details when relevant. Do not overwrite existing dirty changes.

## Commands

- Windows: use `pnpm.cmd` if PowerShell blocks `pnpm.ps1`.
- `pnpm.cmd dev` starts development; `pnpm.cmd build` builds production; `pnpm.cmd lint` runs ESLint.
- `pnpm.cmd test:figma:model` validates domain fixtures, entitlements and input bounds.
- `pnpm.cmd test:figma` exercises the reference in Playwright against a running localhost:3000 server. Set `FIGMA_TEST_URL` for another server. Install browsers with `pnpm.cmd exec playwright install chromium` if needed.
- Browser evidence is stored in ignored `.codex/artifacts/figma-dashboard`.

## Design implementation

- Figma reference: https://www.figma.com/design/lnOH0IYXWcqSfk8e4jobzq/lta-dev-ref?node-id=1-514 (1425 × 1770.846).
- Load the Figma design-to-code skill before requesting context. Fetch child contexts when the root response is sparse.
- Treat screenshots as comparison targets, never as whole-page implementation assets.
- Keep Figma images/SVGs local in `public/assets/figma/dashboard`; retain intrinsic SVG dimensions, original image crops, typography, gradients, and spacing.
- Scope reference styles and font loading to its route. Keep reference fixtures independent of account APIs and credentials.
- Supernova uses fluid native React layouts; do not apply whole-frame CSS zoom. Keep three dashboard hero cards at desktop widths of 1024px and above, a sticky sidebar, wrapping text and accessible narrow-screen navigation. Never hide page overflow to conceal a broken layout.
- Keep every card's text inside its own bounds with wrapping and auto height. Search must have no border effects. Match observed calendar hover (pale gray, 150ms ease-out) and MainCTA hover (#5B4B7A, 200ms ease-out); avoid invented movement or outlines.
- Verify actual rendered screens at 1425, 1920, 1280, 1024, 960, 768, 640, and 480 CSS pixels, plus desktop browser zoom. Check all images load, focus/keyboard controls, search, calendar navigation and dialogs.
- Be explicit about design deviations and verification limits. Passing tests does not establish exact pixel identity.

## Local tools, skills and security

- Use `pnpx skills` (on Windows `pnpm.cmd dlx skills`) to manage any additional outside skills. Keep installed skills, lock files, tool caches and transient exports ignored; do not ignore production assets or project guidance.
- Preserve `.env.local`. Never output cookies, tokens, passwords or secret values. Public configuration belongs in `.env.example`.
- Do not write to the shared live backend just to verify a visual reference. Do not deploy, push or change remote accounts without explicit authorization.

## Critical task cleanup

- Before declaring any task complete, stop every long-running resource started during that task: development servers, listeners, terminal/background jobs, watchers, containers, tunnels, emulators and browser helpers.
- Verify that task-started processes, listeners, sessions and containers have stopped.
- Do not stop resources that predated the task or were started by the user without explicit permission.
- If cleanup cannot be completed, report the exact remaining resource and why; do not claim full completion.
