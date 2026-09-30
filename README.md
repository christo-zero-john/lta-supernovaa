# Letters to Abroad Dashboard

Student dashboard frontend for Letters to Abroad (LTA), maintained in the
`lta-supernovaa` repository. It brings together course shortlists, university
applications, admission statistics, booked mentoring sessions, and LTA product
information.

The application uses Next.js App Router and calls a separately hosted LTA API
directly from the browser. This repository contains the frontend; email delivery,
account validation, and data persistence belong to the backend.

## Technology

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16.1.6 |
| UI | React 19.2.3 and TypeScript |
| Styling | Global and component CSS; Tailwind CSS 4 tooling |
| HTTP | Axios with shared request and response interceptors |
| User state | Zustand, held in memory |
| Tooltips | Radix UI |
| Static assets | Images, SVG icons, and fonts in `public/` |

## Local setup

Use Node.js compatible with Next.js 16 and npm. The repository includes a tracked
`package-lock.json` for reproducible npm installs.

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Copy the environment file only if `.env.local` does not already exist; preserve
existing configuration. On shells other than Windows PowerShell, use `npm` in
place of `npm.cmd` and the equivalent file-copy command.

Open [http://localhost:3000](http://localhost:3000). The root page redirects to
`/signup`; authenticated users may be redirected to `/dashboard` by middleware.
Use an existing backend account to exercise the dashboard. There is no local
backend or mock-data mode supplied here.

### Environment configuration

The only environment variable read by the application is:

```dotenv
NEXT_PUBLIC_LTA_API_BASE_URL=https://apiv2.letterstoabroad.com/api/
```

Set it in `.env.local` for development and in the hosting provider's environment
settings for deployments. Keep the trailing slash: services append relative
paths such as `auth/signin/`.

The example points to the shared live backend. Account creation and other API
requests therefore operate against that backend. For a separate development
backend, replace the URL and ensure its CORS policy permits your frontend origin
and request headers.

`NEXT_PUBLIC_` values are exposed in browser code and included at build time.
Restart the development server after a change; rebuild and redeploy hosted apps
to change their API address. Never put passwords, SMTP credentials, or private
API keys in this variable. OTP email credentials are configured on the backend.

`.env.local` is ignored by Git. `.env.example` is tracked as the setup template.

## Commands

| Command | Purpose |
| --- | --- |
| `npm.cmd run dev` | Start the development server |
| `npm.cmd run build` | Create a production build |
| `npm.cmd run start` | Serve an existing production build |
| `npm.cmd run lint` | Run ESLint |

There is no automated test script in `package.json`. Build and lint commands are
available checks, not evidence that backend-dependent flows work. Verify login,
onboarding, and dashboard data in a browser against the intended backend.

## Routes and authentication

The `(auth)` directory is an App Router route group; it adds no `/auth` prefix
to URLs.

| Route | Purpose |
| --- | --- |
| `/` | Redirect to signup |
| `/signup` | Create an account with email and password |
| `/signup-otp?email=...` | Public signup OTP verification and resend UI |
| `/login` | Sign in with email and password |
| `/verify-otp?email=...&invite_token=...` | Invite onboarding; sends an initial OTP and verifies it |
| `/set-password?uid=...&temp_token=...` | Set a password after invite verification |
| `/welcome` | Welcome screen after password setup |
| `/dashboard` | Authenticated student dashboard |

### Session handling

- Signin and invite password setup save access and refresh tokens in browser
  cookies named `token` and `refresh_token`. Signup also saves them if returned.
- The Axios client adds `Portal-Type: dashboard` and, when a token exists,
  `Authorization: Bearer <token>` to requests.
- A `401` response can trigger one token refresh using `token/refresh/`. Failed
  refresh clears the cookies and redirects to `/login`.
- Middleware checks whether a `token` cookie exists. It redirects unauthenticated
  protected-route requests to `/signup` and authenticated public auth-route
  requests to `/dashboard`. Cookie presence alone does not validate a token;
  the backend must enforce authorization.
- The dashboard layout fetches `users/me/` and stores the profile in Zustand.
  The store is not persisted, so a page reload fetches the profile again.

Invite onboarding and public signup use different OTP endpoints. Do not treat
them as interchangeable flows.

## Dashboard

`/dashboard` is the Figma redesign: a home page with the student's courses,
sessions and the LTA suite, and seven section pages (Documents,
Notifications, Support, Zenna, LTA Connect, Course Shortlisting, Project004)
in one shared shell.

Most of it is placeholder data. Only the user's name and photo, the home
page's shortlisted courses and its booked sessions come from the API.
Product access follows the URL's `persona` parameter, not the account. See
the [dashboard guide](docs/dashboard.md#data-status) for what each page shows.

## API integration

All paths below are relative to `NEXT_PUBLIC_LTA_API_BASE_URL`. The table describes
frontend calls, rather than guaranteeing that every route is deployed.

| Method | Path | Used for |
| --- | --- | --- |
| POST | `auth/signin/` | Login |
| POST | `auth/signup/` | Public account creation |
| POST | `auth/signup/verify-otp/` | Public signup verification |
| POST | `auth/signup/resend-otp/` | Public signup OTP resend |
| POST | `auth/pre-register/send-otp/` | Invite OTP send and resend |
| POST | `auth/pre-register/verify-otp/` | Invite OTP verification |
| POST | `auth/pre-register/set-password/` | Invite password setup |
| POST | `token/refresh/` | Access-token refresh |
| GET | `users/me/` | Current user profile |
| GET | `shortlisted-courses/` | Course shortlist |
| GET | `shortlisted-courses/{id}/` | Individual shortlisted course |
| GET | `applications/` | Applications, with `id` and optional `search` parameters |
| GET | `students/me/stats/` | Admission statistics |
| GET | `booked-slot/` | Calendar bookings |
| GET | `booked-slot/upcoming/` | Upcoming mentoring session |

Services generally extract the payload from `response.data.data`. Action
wrappers turn results into `{ success, data?, error? }` for components. Despite
their directory name, these wrappers are ordinary imported functions, not
Next.js Server Actions; they do not use a `"use server"` directive.

## Repository structure

```text
src/
  app/(auth)/        Signup, login, OTP, password and welcome screens
  app/dashboard/     Dashboard routes; all its code is in _supernova/
  actions/           API result and error wrappers
  lib/               Axios client, cookies, API services
  store/             User profile state (Zustand)
  middleware.ts      Cookie-based route redirects
public/              Static assets
docs/                Project documentation
```

The [architecture guide](docs/architecture.md) explains each part. The
TypeScript alias `@/*` resolves to `src/*`. Remote Next.js images currently
allow `lta-dev-tl6j9mrplp.s3.amazonaws.com`; update `next.config.ts` if API
image URLs move to another host.

## Known limitations and troubleshooting

### Signup opens an OTP screen, but no email arrives

Public signup currently redirects to `/signup-otp` after any successful action,
even if the API already returned login tokens. The OTP screen's initial message
is static; it does not confirm email dispatch. Its verification and resend
buttons do make API calls, including a 30-second cooldown after successful
resend. Verification sends `{ otp }`, while resend sends `{ email }`.

During investigation on September 28, 2026, read-only `OPTIONS` requests to the
shared backend's `auth/signup/verify-otp/` and `auth/signup/resend-otp/` returned
HTTP 404. Signup metadata was accessible. These observations identify a
frontend/backend contract mismatch; they do not establish email delivery status
or the response from an actual account-creation request. Recheck route support
when the backend changes. Setting the API URL alone does not resolve this flow.

### Login succeeds, but the dashboard keeps loading

Inspect the `users/me/` request first. Dashboard data loading waits for a user ID;
profile-fetch failures currently only log an error and can leave the page on its
loader. Check the API address, token validity, CORS, and profile response shape.

### Logout or sidebar navigation behaves unexpectedly

Logout currently clears token cookies but navigates to `/auth/login`, while the
actual login page is `/login`. Sidebar item selection updates local active state;
it does not navigate to separate feature routes. Some product, footer, and social
controls are placeholders or commented out. Social sign-in is disabled in the
signup form.

### Authentication implementation needs further hardening

Tokens are stored in JavaScript-readable cookies. Review these implementations
before relying on them for production session security. Middleware token-value
logging has been removed; avoid adding logs that expose account credentials.

## Deployment

The repository is a standard Next.js application suitable for Vercel or a Node.js
host that supports Next.js. Configure `NEXT_PUBLIC_LTA_API_BASE_URL` before the
production build. For a Node.js host, run `npm.cmd run build`, then
`npm.cmd run start` using the appropriate command spelling for that host.

Deployment addresses inspected during the September 28, 2026 investigation:

- [LTA dashboard](https://dashboard.letterstoabroad.com/)
- [Vercel deployment](https://dashboard-opal-ten-58.vercel.app/)

At that time, both served identical inspected signup and API-client bundles and
used the shared API address shown above. Future deployments may differ. Backend
email delivery and complete onboarding remain separate acceptance checks from a
successful frontend build.

## Dashboard

`/dashboard` is the Figma redesign: a home page with the student's courses,
sessions and the LTA suite, and seven section pages (Documents,
Notifications, Support, Zenna, LTA Connect, Course Shortlisting, Project004).
See the [dashboard guide](docs/dashboard.md). Run `pnpm.cmd test:model` for
the concept model tests.

[AGENTS.md](AGENTS.md) contains project guidance. Local skills, caches and
browser evidence remain ignored by Git.
