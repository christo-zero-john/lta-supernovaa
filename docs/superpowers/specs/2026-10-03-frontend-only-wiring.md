# Supernova: wire the features the backend already supports

Status: proposed on 2026-10-03. Not implemented.

This covers everything the dashboard can make real with frontend changes only. Each item uses a backend route that exists today. Work that needs backend changes is in [backend-gaps.md](../../backend-gaps.md) and is out of scope here.

The routes below come from reading the backend code. None of the write routes has been called against the live API from this project, because the dashboard talks to the shared live backend (see Testing).

## Goal

Replace placeholder data with the student's real data wherever the backend already provides it, so that an account's locks, name, shortlist, applications, counsellor, mentors and sessions are real.

## What stays placeholder after this work

So nobody expects more than this spec delivers:

- Notifications (no backend).
- Documents page (no combined list, no status, no required-documents list).
- After-the-offer checklist (no status per step).
- Application deadlines and "next action" (no columns yet).
- Free team call booking (no backend).
- Reschedule a session (no backend action).
- Project004 jobs, competitions and ranks (no backend).
- Journey stages beyond Aspirant, Applicant and Admitted (no arrival or employment dates).

## Work items

Ordered so each builds on the one before. Each is its own small set of commits.

### 1. Account tier from the account, not the URL

Today the locks come from the `?persona=` query parameter, which anyone can edit ([review.md L1](../../review.md#l1-access-comes-from-the-url-not-the-account)).

- **Data:** `GET users/me/`, already fetched in `src/app/dashboard/layout.tsx`. It returns `is_approved`, `is_email_verified`, `memberships` and `service_statuses`.
- **Rule:** a student is verified when all three hold, the same rule the backend's Zenna permission applies:
  - `service_statuses.admissions.is_approved` (or `is_approved`) is true,
  - `service_statuses.admissions.is_active` is true (an active Zenna or Dashboard membership),
  - `is_email_verified` is true.
- **Project004:** open when `service_statuses.recruitment.is_active` is true.
- **Changes:**
  - Extend the `User` type in `src/store/useStore.ts` with `memberships` and `service_statuses`.
  - Add one function, for example `personaFromUser(user)` in `_supernova/lib/model.ts`, that returns `free`, `verified` or `p004`.
  - `AppProvider` uses it when no preview is active. While the account is loading, treat the student as `free` and show nothing locked-or-unlocked until it arrives.
  - Keep `?persona=` and the "Preview as" dropdown only when `NEXT_PUBLIC_DASHBOARD_PREVIEW=true`. Add that variable to `.env.example`. The same flag hides "Choose options" ([review.md L2, L3](../../review.md#l2-demo-controls-ship-to-every-user)).
- **Also:** the account dialog's "Current role" comes from the derived persona instead of the dropdown.

### 2. Journey stage from the account

- **Rule, computed in the frontend until the backend sends `journey_stage`:**
  - Aspirant: not verified.
  - Applicant: verified.
  - Admitted: at least one application with `admission_status` of `confirmed` (needs item 4's data).
  - In Germany, Working: not derivable yet; never shown as current.
- **Change:** `hooks/useJourneyStage.ts` reads the account and the applications instead of the demo switches.

### 3. Course Shortlisting form on real options and real submit

- **Options (all public `GET`s):** `public/germany/intakes/`, `public/field-of-study/`, `public/interests/`, `public/language-certification-master/`, `public/universities/`, `public/courses/`.
- **Submit:** `POST public/student-submissions/`. Results then appear in `GET shortlisted-courses/`, which the home page already reads.
- **Changes:**
  - New `shortlisting.service.ts` and actions for the option lists and the submit.
  - `views/ShortlistingView.tsx` loads the lists, replaces `SHORTLIST_OPTIONS` in `lib/fixtures.ts`, and submits for real.
  - The questions and their order must match the existing tool at `https://letterstoabroad.com/course-shortlisting`. That walkthrough is not finished: only the country choice and the intake step (Summer 2027, Winter 2027) are recorded so far. Finish it before building the form, and do not press the final submit on the live site.
  - After submit, show the "preparing" state and poll `shortlisted-courses/` until results arrive, then show them.
  - Results show only what the API returns: university, course, chance and rank. The "Eligible" badge and "Why this chance" text are placeholder fields and are removed until the backend provides them.
- **Open point:** the exact request body of `student-submissions/` must be taken from the backend serializer when this item starts.

### 4. Zenna: real applications and numbers

- **Data:** `GET applications/` (`fetchApplications` already exists in `src/lib/services/applications.service.ts`) and `GET students/me/stats/` (`fetchStats` exists).
- **Changes:**
  - `views/ZennaView.tsx` and `components/ApplicationRow.tsx` render the real list: university name and logo, course, status, progress.
  - Map `application_status` and `admission_status` to the four badges (in progress, waiting, offer, closed) in one place.
  - The numbers panel shows total applications, offers received and average completion, computed from the list. "Next deadline" is dropped until the backend has deadlines.
  - The deadline column on each row is dropped for the same reason.
  - The application dialog shows the progress percentage only; the step checklist stays hidden until students can read their own steps.
  - Fix [review.md B1](../../review.md#b1-picking-the-already-selected-search-result-does-nothing) while touching this.
  - Home tiles (`home/homeStats.ts`) take the real applications.

### 5. Zenna: the assigned counsellor

- **Data:** `GET students/me/` returns `assigned_to` with name, photo, phone and `is_online`.
- **Changes:** replace the hard-coded "Jisha S." card. "Message" opens WhatsApp with the counsellor's number when there is one, and LTA's official number (`LTA_WHATSAPP`) otherwise. With no counsellor assigned, show "Your counsellor will be assigned soon" and the official number.

### 6. LTA Connect: real mentors and sessions

Blocked on one decision: is Connect open to every student, or only verified ones? (Question 2 in backend-gaps.md.) Until it is answered, build this for verified students only, as today.

- **Data:** `GET mentors/`, `GET mentors/{id}/availability-slots/` and `.../month-availability-slots/?month=`, `GET booked-slot/?start_date=&end_date=`, `GET booked-slot/upcoming/` (`getUpcomingBookedSlot` exists).
- **Changes:**
  - Mentor cards from `mentors/`: name, photo, latest role. Tags and the rating line are removed unless the API returns them.
  - "Your next session" from `booked-slot/upcoming/`, with the Meet link from `google_calendar_event.meet_link` (the backend shows it from 10 minutes before the start).
  - The booking dialog reads real availability.
  - Fix [review.md B2](../../review.md#b2-no-sessions-booked-yet-shows-above-a-booked-session) by deriving every session card from the one fetched list.
  - The placeholder follow-ups ("Rate your last session", "Finish your booking", "Sessions completed") are removed; only what the API supports is shown.
- **Known limit:** `booked-slot/` refuses students without a Connect membership today. The page must treat that refusal as "no sessions", not as an error.

### 7. LTA Connect: booking and payment

- **Data:** `POST booked-slot/`, `checkout/`, `verify-payment/`, `cancellation-summary/`, `confirm-cancellation/`.
- **Changes:** the booking dialog creates the booking, opens the payment step, verifies it, and shows the session. Cancellation shows the summary first, then confirms.
- **Not included:** reschedule. The button is hidden until the backend adds the action.
- This item moves real money. See Testing.

### 8. Small fixes that ride along

- Logout pushes `/login`, not `/auth/login` ([review.md R3](../../review.md#r3-logout-goes-to-a-route-that-does-not-exist)).
- Remove the unused concept logout ([review.md C1](../../review.md#c1-unused-concept-logout)).
- The account dialog says "Could not load your account" with a retry button if the account request is refused, instead of loading forever.
- `scripts/test-supernova-model.mjs` is updated for the new `personaFromUser` and no longer imports the removed `APPLICATIONS` ([review.md T1](../../review.md#t1-the-model-test-script-does-not-run)).

## Shared rules for every item

- **Loading:** use `LoadingText` or a skeleton in place; never show "0" or "Not added yet" for data that has not arrived.
- **Empty:** a titled empty card with the one action that starts that data, as on Zenna today.
- **Errors:** a short message in place with a retry; one failed panel must not blank the page.
- **Demo data:** with the preview flag on, a demo switch may replace real data for previews. With it off, demo data is never shown.
- **No new placeholder numbers.** If the API does not return it, the dashboard does not show it.
- API calls go through `src/lib/services` and `src/actions`, as the existing ones do.

## Testing

The dashboard uses the shared live backend, and this project's standing rule is no write operations against it.

| Kind | How it is tested |
| --- | --- |
| Reads (`GET`) | In the browser with a real test account, and with mocked responses for empty, loading and error states |
| Shortlisting submit (item 3) | Mocked in the browser by the developer. The real submit is tested by the project owner, or with a test account the owner explicitly allows writes for |
| Booking and payment (item 7) | Mocked only. The real flow needs the owner, a test account and the payment provider's test mode |
| Tier rule (item 1) | Unit cases in `scripts/test-supernova-model.mjs`: unapproved, approved without membership, approved with inactive membership, approved with unverified email, verified, recruitment member |

Each item is checked at desktop and phone widths before it is called done, and `pnpm.cmd exec tsc --noEmit` and ESLint on `src` must pass.

## Order and size

| # | Item | Depends on | Size |
| --- | --- | --- | --- |
| 1 | Account tier | — | Small |
| 2 | Journey stage | 1, 4 | Small |
| 3 | Shortlisting form | Finished walkthrough of the live tool | Large |
| 4 | Zenna applications | 1 | Medium |
| 5 | Counsellor | 1 | Small |
| 6 | Connect mentors and sessions | 1, the Connect decision | Medium |
| 7 | Connect booking and payment | 6, a test account | Large |
| 8 | Ride-along fixes | — | Small |

Suggested first release: items 1, 4, 5, 8 and 2. They are read-only, so they can be built and checked without touching live data.

## Open questions

1. Is LTA Connect for every student or only verified students? (Blocks the unverified view in item 6.)
2. Which account may be used for write tests, if any? (Blocks the real checks in items 3 and 7.)
3. Should the preview controls be available to LTA staff in production, or only in development builds?
