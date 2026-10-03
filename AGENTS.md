# Letters to Abroad frontend

## Project

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind 4 and scoped component CSS.
- `src/app/(auth)` contains public onboarding routes; the route group adds no URL prefix.
- `src/app/dashboard` is the authenticated student dashboard, built from the Figma redesign (see `docs/dashboard.md`): the home page (`page.tsx` → `_supernova/home/Dashboard.tsx`) and seven section pages sharing one shell (`_supernova/components/AppShell.tsx`, Figma sidebar, page view transition). Keep the home page's functional logic intact — the user fetch in `layout.tsx`, the course fetch, image preloads and loader in `page.tsx`, the booked-slot fetch in `Events`, and the sidebar's real logout (clears `token` and `refresh_token`).
- API boundaries live in `src/lib/services`, server actions in `src/actions`, and shared Axios/session handling in `src/lib/axios.ts`, `src/lib/cookies.ts`, and `src/middleware.ts`. Zustand user state is in `src/store/useStore.ts`.
- Read README.md for backend/setup details when relevant. Do not overwrite existing dirty changes.

## Commands

- Windows: use `pnpm.cmd` if PowerShell blocks `pnpm.ps1`.
- `pnpm.cmd dev` starts development; `pnpm.cmd build` builds production; `pnpm.cmd lint` runs ESLint.

## Design implementation

- Search must have no border effects. Calendar day hover is pale gray, 150ms ease-out; MainCTA hover is `#7652D6`, 200ms ease-out; keep button geometry still on hover. Glass-pill buttons (`.primary-cta`, `.product-action`, `.chat-cta`, `.sn-button`) animate their existing inset edge reflection on hover/focus via `src/app/dashboard/_supernova/button-motion.css`; never add a separate light overlay, and disable the animation under `prefers-reduced-motion`.
- Fonts are loaded once via `next/font/google` in `src/app/layout.tsx` and exposed as CSS variables. The onboarding pages use Plus Jakarta Sans and Anek Bangla (`--font-plus-jakarta-sans`, `--font-anek-bangla`, consumed in `src/app/globals.css`). The dashboard follows the LTA website: Geist for text and Momo Trust Sans for headings, mapped to `--sn-body` / `--sn-heading` in `src/app/dashboard/_supernova/reference-fonts.css`. Do not redeclare those variables as literal font-family strings elsewhere.
- Dashboard colours follow the LTA website palette: primary violet `#8764DE`, brand purple `#735DAA`, ink `#1D172C`, muted text `#6A6E74`.
- Be explicit about design deviations and verification limits. Passing tests does not establish exact pixel identity.

## Local tools, skills and security

- Use `pnpx skills` (on Windows `pnpm.cmd dlx skills`) to manage any additional outside skills. Keep installed skills, lock files, tool caches and transient exports ignored; do not ignore production assets or project guidance.
- Preserve `.env.local`. Never output cookies, tokens, passwords or secret values. Public configuration belongs in `.env.example`.
- Do not write to the shared live backend just to verify a visual reference. Do not deploy, push or change remote accounts without explicit authorization.

## Ultra-micro commits (automatic)

- Commit automatically, without being asked, as soon as a closely related unit of change is done and working. Do not batch up a task's changes into one commit at the end.
- One commit holds one concern: a single style tweak, a single component's hover, one dependency, one doc section. If a commit message needs "and" or touches two unrelated concerns, split it.
- Split within a file when its hunks serve different concerns (`git apply --cached` for single hunks, or write an intermediate blob to the index). Keep changes together only when one cannot be correct without the other, such as a dependency and its lockfile entries, a deleted script and its `package.json` entry, or a new stylesheet and the import that loads it.
- Order commits so every commit builds on its own: remove callers before what they depend on, and add dependencies before their users.
- Use Conventional Commits with a scope where it helps (`style(calendar): …`, `docs(agents): …`, `chore: …`), imperative, one line, plus any attribution trailer the harness requires.
- Stage paths explicitly; never `git add -A`/`git add .` across the whole tree. Commit only changes made during the current task. Pre-existing dirty changes belong to the user and are committed only when the user asks.
- Never amend, rebase, squash, force-push or push unless explicitly authorized. Never skip hooks.

## Critical task cleanup

- Before declaring any task complete, stop every long-running resource started during that task: development servers, listeners, terminal/background jobs, watchers, containers, tunnels, emulators and browser helpers.
- Verify that task-started processes, listeners, sessions and containers have stopped.
- Do not stop resources that predated the task or were started by the user without explicit permission.
- If cleanup cannot be completed, report the exact remaining resource and why; do not claim full completion.
