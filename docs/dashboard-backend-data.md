# Dashboard: backend data requirements

What the backend needs to answer, and in what format, to replace the dummy data on the student dashboard and every page in its menu.

Source: the Supernova reference at `/figma/dashboard` (`src/app/dashboard/_supernova`, `src/app/figma/dashoard`) and the live `/dashboard`. Today every value on those pages is hardcoded in `src/app/dashboard/_supernova/lib/fixtures.ts`, `lib/jobs.ts`, or inline in components. The "Free user / Paid client / Project004 era" persona switcher is a demo control; the **Global → user tier / product access** section replaces it.

## Conventions

- Every response uses the existing wrapper `{ "status": true, "data": ... }`; lists use `{ count, next, previous, results: [] }`.
- Dates are ISO 8601 (`"2026-07-10"`, `"2026-07-06T17:00:00+05:30"`). The frontend formats "8 days left", "Today · 09:12" and similar text, so the backend sends raw dates, not pre-formatted strings.
- Every image or file field is a full URL, or `null`.
- ✅ = endpoint exists and the live dashboard already calls it. 🆕 = new.

---

# Global (sidebar, topbar, settings: on every page)

## Feature: user identity
- Who is the logged-in user? ✅ `GET users/me/` already returns `first_name`, `last_name`, `profile_picture`, `is_email_verified`, `is_onboarding_completed`, `is_approved`, `signup_platform_type`.
- Can `users/me/` also return the user's **journey stage**? The sidebar shows it under the name ("Explorer", "Applicant", "Job seeker").
    - Format needed (added to `users/me/`):
    ```json
    {
        "journey_stage": "aspirant | applicant | admitted | in_germany | working",
        "journey_stage_label": "string"
    }
    ```

## Feature: profile (name and photo), with a prompt when missing
Shown everywhere: the greeting ("Good Morning, Tino!"), the sidebar user card, the topbar avatar and the settings dialog. When the user has no name or no photo yet, the dashboard asks for it (a "complete your profile" dialog on first visit, and editable later in settings). First and last name are separate fields.
- ✅ `GET users/me/` already returns `first_name`, `last_name` and `profile_picture`. When one is missing, does it come back as `null` or `""`? Please pick one and keep it the same everywhere.
- Some accounts seem to store the full name in `first_name` (the frontend splits it on the first space). Can the backend clean this up so `first_name` and `last_name` are always separate?
- Can `users/me/` say which profile fields are missing, so the frontend doesn't have to guess when to show the prompt?
- Does onboarding already collect the name? If so, which users can still reach the dashboard without one (for example invite-only or old accounts)?
- Can the user skip the prompt? If so, should the backend remember that they skipped (so the prompt doesn't show on every visit)?
- Is `gender` available? The frontend uses it to pick a placeholder 3D avatar until a photo is uploaded; without it, a neutral one is used.
    - Format needed (in `users/me/`):
    ```json
    {
        "first_name": "string | null",
        "last_name": "string | null",
        "profile_picture": "string | null",
        "gender": "male | female | other | null",
        "missing_profile_fields": ["first_name", "last_name", "profile_picture"],
        "profile_prompt_dismissed_at": "ISO | null"
    }
    ```
- Update name: 🆕 `PATCH users/me/` `{ "first_name": "string", "last_name": "string" }` returns the updated user. What are the validation rules (required, max length, allowed characters)?
- Upload photo: 🆕 `POST users/me/profile-picture/` (multipart `file`) returns `{ "profile_picture": "URL" }`. Which types and size limit (suggest JPG/PNG/WebP, 5 MB)? Does the backend crop or resize it? Is the photo URL public or signed (and if signed, how long does it last)?
- Remove photo: 🆕 `DELETE users/me/profile-picture/` (the frontend then shows the placeholder avatar again).
- Dismiss prompt: 🆕 `POST users/me/profile-prompt/dismiss/`, or a `profile_prompt_dismissed_at` field set with the `PATCH`.

## Feature: user tier / product access (replaces the persona switcher)
- Is the user a free user or a paid/verified LTA client?
- For each product, what access does this user have? This drives the sidebar lock icons, the lock screens, and the "Free For All" / "LTA Members Only" tags.
- Is Zenna active for them, or archived because their admission is done?
- Is the user on Connect as a student or as a mentor?
- Is Project004 live? (Not answered by the backend yet; the project team decides this later, so a config flag is enough for now.)
    - Format needed (added to `users/me/` or 🆕 `GET users/me/entitlements/`):
    ```json
    {
        "tier": "free | paid",
        "products": {
            "course_shortlisting": { "access": "active" },
            "zenna": { "access": "locked | active | archived" },
            "connect": { "access": "locked | waitlisted | student | mentor" },
            "project004": { "access": "locked | active", "is_live": false, "launch_label": "Coming 2027" }
        }
    }
    ```

## Feature: notification badge
- How many unread notifications does the user have? Drives the sidebar count and the topbar dot.
    - Format: `{ "unread_count": 3 }` (🆕, or included in the notifications list response)

## Feature: WhatsApp updates toggle (topbar pill and settings dialog)
- Are WhatsApp updates on or off for this user?
- Can the user change it? 🆕 `PATCH users/me/preferences/`
- Which number do messages go to? Can a family member be added? (The FAQ promises parents can follow along.)
    - Format:
    ```json
    {
        "whatsapp_enabled": true,
        "whatsapp_number_masked": "+91 ••••• ••210",
        "family_contacts": [
            { "name": "string", "relation": "string", "number_masked": "string" }
        ]
    }
    ```

## Feature: global search (topbar)
- Should search run on the backend (one endpoint across applications, mentors and documents), or should the frontend filter lists it has already loaded? Frontend filtering is fine unless the lists get large.
    - Format if backend: 🆕 `GET search/?q=`
    ```json
    [
        { "type": "application | mentor | document", "id": "string", "title": "string", "subtitle": "string" }
    ]
    ```

## Feature: log out
- Is there a logout endpoint that invalidates the refresh token (for example 🆕 `POST auth/logout/`), or does the frontend only clear cookies?

---

# Page: Dashboard (Home)

### Feature: greeting
- User's first name. ✅ From `users/me/`. Time of day is calculated on the frontend.

### Feature: Zenna recommendations carousel (university cards)
- Does the user have any universities or courses shortlisted for them? ✅ `GET shortlisted-courses/` exists but is missing most fields the card shows.
- If the list is empty, what should the card area show? A prompt to use Course Shortlisting?
    - Format needed:
    ```json
    [
        {
            "id": "string",
            "rank": 1,
            "matching_score": 80,
            "college_id": "string",
            "college_name": "string",
            "college_short_name": "TUM",
            "college_location": "Munich, Germany",
            "college_logo_url": "string",
            "college_image_url": "string",
            "course_id": "string",
            "course_name": "M.Sc. Technology of Biogenic Resources",
            "course_duration_years": 4,
            "course_fee": { "amount": 40000, "currency": "EUR", "label": "Starting: 40k" },
            "start_semesters": ["winter"],
            "application_deadline": "2026-10-15"
        }
    ]
    ```
    The frontend calculates "10 days left" from `application_deadline`. Is `course_fee` tuition or cost of living? The current API only has `cost_of_living`.

### Feature: Explore LTA Suite cards
- Access tag per product (Free For All / LTA Members Only, with lock): comes from the entitlements above.
- Are the intro videos fixed, or managed by the backend or CMS? Right now one S3 URL is hardcoded.
    - Format (only if backend-managed): `[ { "product": "zenna", "video_url": "string", "thumbnail_url": "string" } ]`

### Feature: Upcoming events + calendar
- Does the user have any upcoming events (LTA webinars, workshops)?
- Which of the user's own booked sessions fall in the selected month? These mark calendar days. ✅ `GET booked-slot/` exists. Can it take a `?from=&to=` month filter?
- Are events the same for everyone, or targeted by intake or field?
- Can the user register for an event? If so, what is the register endpoint, and what is the join link?
    - Format needed: 🆕 `GET events/?from=2026-02-01&to=2026-02-28`
    ```json
    [
        {
            "event_id": "string",
            "event_type": "webinar | workshop | mentor_session | lta_team_call",
            "event_name": "string",
            "event_description": "string",
            "event_image_url": "string",
            "start_at": "2026-05-30T09:00:00+05:30",
            "end_at": "2026-05-30T10:00:00+05:30",
            "mode": "online | offline",
            "event_location": "string | null",
            "join_url": "string | null",
            "is_registered": false
        }
    ]
    ```

### Feature: Hear from our family (testimonials)
- Are testimonials fixed, or managed by the backend or CMS?
    - Format: 🆕 `GET testimonials/`
    ```json
    [
        {
            "id": "string",
            "name": "string",
            "course_name": "M.Sc. Logistics and Production (ISE)",
            "university_name": "string",
            "photo_url": "string",
            "quote": "string"
        }
    ]
    ```

### Feature: footer mentor card
- "Book a session" opens the booking flow (see Connect and Support).
- "Chat with a Mentor": what is the WhatsApp number or link? One fixed LTA number, or the user's assigned counsellor?

### Live-dashboard-only blocks (already on the API)
- Stats row ✅ `students/me/stats/`, applications table ✅ `applications/`, next mentor session card ✅ `booked-slot/upcoming/`, course shortlist ✅ `shortlisted-courses/`. When the Supernova design moves to the live dashboard, these should use the formats in the Zenna and Connect sections below.

---

# Page: Documents

### Feature: document vault list
- Which documents has the user uploaded?
- Which documents has LTA verified?
- Which products or applications use each document? (the "USED IN" badges)
- Is there a required-documents checklist? Applications show "1 doc missing", so the backend must know what is required.
    - Format: 🆕 `GET documents/`
    ```json
    [
        {
            "document_id": "string",
            "file_name": "Passport_TinoSunny.pdf",
            "document_type": "passport | transcript | ielts | german_certificate | offer_letter | other",
            "mime_type": "application/pdf",
            "size_bytes": 482133,
            "uploaded_at": "2026-03-12T10:00:00Z",
            "verification_status": "pending | verified | rejected",
            "rejection_reason": "string | null",
            "used_in": ["zenna", "course_shortlisting", "project004"],
            "preview_url": "signed URL",
            "download_url": "signed URL"
        }
    ]
    ```
    - Missing documents format: `[ { "document_type": "string", "label": "string", "required_for": "application_id" } ]`

### Feature: upload / delete
- Upload endpoint: 🆕 `POST documents/` (multipart with `file` + `document_type`), or presigned S3 upload?
- Are the frontend limits right (PDF, JPG or PNG, 10 MB max)? The backend must enforce the same limits.
- Can a verified document, or one used by an application, be deleted? 🆕 `DELETE documents/{id}/`

---

# Page: Notifications

### Feature: notification feed
- What notifications does the user have, across every product?
- Which page and item should each notification open? For example, the DIT deadline notice should open that application.
- Does the backend create notifications when things happen (booking confirmed, offer received, AI found a deadline)?
- Should the page update live (WebSocket/SSE), or refresh on page load or by polling?
    - Format: 🆕 `GET notifications/?page=`
    ```json
    [
        {
            "notification_id": "string",
            "message": "DIT portal submission due in 8 days — Zenna is tracking it.",
            "product": "zenna | connect | course_shortlisting | project004 | documents | support | account",
            "target_id": "application id / session id / null",
            "created_at": "2026-07-02T08:00:00Z",
            "is_read": false
        }
    ]
    ```
- Mark as read: 🆕 `PATCH notifications/{id}/` `{ "is_read": true }`. Is a "mark all read" endpoint needed too?

---

# Page: Support

### Feature: help channels
- WhatsApp number, support email and reply-time text: fixed or config? (Currently hardcoded as `info@letterstoabroad.com`.)

### Feature: book a free 15-minute call with the LTA team
- Which LTA team slots are free this month?
- Does the user already have team calls booked? These show at the top of the page.
    - Format: 🆕 `GET team-calls/availability/?month=2026-07`
    ```json
    [ { "slot_id": "string", "start_at": "ISO", "end_at": "ISO" } ]
    ```
    - Book: 🆕 `POST team-calls/` `{ "slot_id": "string", "context": "optional text, e.g. CST results" }` returns `{ "booking_id", "start_at", "join_url" }`

### Feature: FAQs
- Fixed text, or managed by the backend or CMS? Format if backend: `[ { "question": "string", "answer": "string" } ]`

---

# Page: Zenna (application tracker)

### Feature: access / lock screen
- Zenna access (`locked | active | archived`) comes from the entitlements.
- Locked users see "Apply with LTA" (opens team booking) and "Talk to us first" (opens contact). Nothing new needed from the backend.

### Feature: summary stats
- How many applications does the user have?
- How many offers?
- What is the average completion?
- What is the next deadline, and for which university? ✅ `students/me/stats/` exists but returns different fields.
    - Format needed:
    ```json
    {
        "total_applications": 9,
        "offers_received": 2,
        "average_completion": 74,
        "next_deadline": { "application_id": "string", "university_short_name": "DIT", "date": "2026-07-10" },
        "status_counts": { "offer": 2, "in_progress": 2, "waiting": 2, "closed": 3 }
    }
    ```

### Feature: applications list + filter + detail
- ✅ `GET applications/` exists. Missing: status group, deadline, next action, university short code.
    - Format needed:
    ```json
    [
        {
            "application_id": "string",
            "university_name": "Deggendorf Institute of Technology",
            "university_short_name": "DIT",
            "university_logo_url": "string",
            "course_name": "International Management",
            "intake": "Winter 2026",
            "status": "in_progress | in_review | submitted | offer_received | enrolled | rejected | withdrawn",
            "status_label": "In progress",
            "status_group": "in_progress | waiting | offer | closed",
            "progress": 82,
            "next_deadline": "2026-07-10",
            "next_action": "Portal submission | Confirm enrolment | 1 doc missing | Decision late July",
            "missing_documents": ["string"],
            "offer_letter_url": "string | null",
            "update_viewed": false
        }
    ]
    ```

### Feature: Zenna AI agent (deadlines found in the user's documents)
- Did the AI find any deadlines in the user's documents? For each: which document, and how confident is it?
- Can the user confirm the findings (which schedules reminders) or dismiss them?
    - Format: 🆕 `GET zenna/ai-findings/`
    ```json
    [
        {
            "finding_id": "string",
            "title": "Blocked-account proof due",
            "due_date": "2026-07-10",
            "source_document_id": "string",
            "source_document_name": "Visa Checklist — Deggendorf IT.pdf",
            "confidence": 91,
            "state": "pending | confirmed | dismissed"
        }
    ]
    ```
    - Actions: 🆕 `POST zenna/ai-findings/{id}/confirm/` and `.../dismiss/`, or bulk?

### Feature: WhatsApp updates card
- Who is the user's assigned application mentor (currently "Jisha")?
    - Format: `{ "counsellor": { "name": "string", "photo_url": "string | null", "whatsapp_url": "string" } }`

### Feature: archived view (after admission)
- Which university and course was the user admitted to, and when did they enrol?
- Download the full admissions record: will the backend generate a PDF?
    - Format: `{ "admitted_university": "string", "course_name": "string", "enrolled_at": "2026-08-01", "total_applications": 9, "offers": 2, "record_pdf_url": "string" }`

---

# Page: LTA Connect

### Feature: access / waitlist
- Connect access (`locked | waitlisted | student | mentor`) comes from the entitlements.
- Join the waitlist: 🆕 `POST connect/waitlist/`. Is "you're on the list" part of the entitlement state?

### Feature: next session + booked sessions
- ✅ `booked-slot/upcoming/` and `booked-slot/` exist. Missing: session topic and meeting link.
    - Additions needed: `{ "topic": "Course selection for Technical Logistics", "join_url": "string | null", "mode": "video" }`

### Feature: mentors picked for your profile
- Which mentors are recommended for this user, and how are they matched (field, university, intake)?
    - Format: 🆕 `GET connect/mentors/recommended/`
    ```json
    [
        {
            "mentor_id": "string",
            "full_name": "Geen Geo",
            "profile_picture": "string | null",
            "headline": "M.Sc. Logistics & Production · TU München",
            "tags": ["Mechanical", "TUM admits", "Winter intake"],
            "rating": 4.9,
            "sessions_count": 41,
            "price": { "amount": "string", "currency": "INR" }
        }
    ]
    ```

### Feature: book / reschedule a 1:1
- **Key decision:** are bookings made inside the dashboard, or does the dashboard link out to `connect.letterstoabroad.com` as the Figma dialog does? If inside the dashboard:
    - Which slots does this mentor have free in a given month? 🆕 `GET connect/mentors/{id}/availability/?month=` returns `[ { "slot_id", "start_at", "end_at" } ]`
    - Is booking paid? `order_status` and `amount` suggest Razorpay. If so, what is the order and payment flow?
    - Book: `POST booked-slot/` `{ "slot_id" }`. Reschedule: 🆕 `PATCH booked-slot/{id}/` `{ "slot_id" }`. What is the cancellation or reschedule policy?

### Feature: mentor mode (alumni who now mentor)
- How many aspirants requested a session with this mentor, and who are they?
- Accept or decline a request.
- Payout info ("sessions pay out monthly").
    - Format: 🆕 `GET connect/mentor/requests/`
    ```json
    [
        {
            "request_id": "string",
            "aspirant_name": "string",
            "topic": "string",
            "requested_at": "ISO",
            "state": "pending | accepted | declined"
        }
    ]
    ```
    - Actions: `POST connect/mentor/requests/{id}/accept/` and `.../decline/`

---

# Page: Course Shortlisting (admit-chance checker)

### Feature: profile form
- Where do the dropdown options come from (bachelor degrees, target fields, German levels, CGPA/IELTS ranges)? Currently hardcoded to 4 degrees and 4 fields.
- Can the form be pre-filled from the user's onboarding data?
    - Format: 🆕 `GET cst/options/`
    ```json
    {
        "degrees": ["string"],
        "fields": ["string"],
        "german_levels": ["none", "A1", "A2", "B1", "B2"],
        "cgpa": { "min": 5, "max": 10 },
        "ielts": { "min": 5, "max": 9 },
        "prefill": { "degree": "string", "cgpa": 7.8, "ielts": 7, "german_level": "A2", "field": "string" }
    }
    ```

### Feature: calculate chances
- **Key decision:** does the backend calculate the percentages? The frontend currently runs a made-up formula with invented "difficulty" values, so the numbers are not real.
- Are the results saved? Do they become the user's `shortlisted-courses` (the dashboard carousel)?
    - Format: 🆕 `POST cst/check/` `{ "degree", "cgpa", "ielts", "german_level", "field" }` returns
    ```json
    [
        {
            "course_id": "string",
            "university_name": "string",
            "university_short_name": "TUM",
            "university_logo_url": "string",
            "course_name": "string",
            "admit_chance": 80,
            "band": "strong | fair | low"
        }
    ]
    ```
- "Talk to our team about these results" opens team booking with the results as `context`, reusing the Support endpoint.

---

# Page: Project004 (jobs, competitions)

### Feature: access
- Is Project004 live, and does this user have access? From `project004.is_live` and `access` above. The project team decides launch; no backend answer yet.
- "Notify me at launch": 🆕 `POST project004/notify-me/`

### Feature: stats row
- How many of the user's job applications are in review?
- How many hackathons have they entered?
- How many employers viewed their profile this week?
    - Format: `{ "applications_in_review": 3, "hackathons_entered": 2, "employer_views_this_week": 2 }`

### Feature: matched jobs
- Format: 🆕 `GET project004/jobs/matched/`
    ```json
    [
        {
            "job_id": "string",
            "company_name": "string",
            "company_logo_url": "string",
            "role": "Junior Logistics Coordinator",
            "city": "Nürnberg",
            "match_score": 86,
            "application_status": "not_applied | applied | in_review | rejected | offer",
            "applied_at": "ISO | null"
        }
    ]
    ```

### Feature: competition + leaderboard
- Which competition is the user in, when are the finals, and how many participants are there?
- Which leaderboard rows are around the user's rank?
    - Format:
    ```json
    {
        "competition_id": "string",
        "name": "Logistics Challenge 2027",
        "finals_at": "ISO",
        "participants": 412,
        "me": { "rank": 7, "points": 2340, "percentile": 2 },
        "leaderboard": [
            { "rank": 5, "display_name": "A. Fernandes", "points": 2410, "is_me": false }
        ]
    }
    ```

### Feature: shareable profile card
- Is there a public profile URL to share on LinkedIn, or only copyable text? Format: `{ "share_text": "string", "public_url": "string | null" }`

---

# Summary

**Already there, needs extra fields:** `users/me/` (journey stage, entitlements, gender, missing profile fields; plus new endpoints to update the name and upload the photo), `shortlisted-courses/` (logo, image, location, duration, fee, deadline), `applications/` (status group, deadline, next action, short code), `students/me/stats/` (Zenna summary shape), and `booked-slot/` / `booked-slot/upcoming/` (topic, join link, month filter).

**Entirely new, roughly in priority order:**
1. Entitlements. Every lock, gate and tag depends on it, so it unblocks the most.
2. Profile update: name and photo upload. It's small, and every page shows the name and photo.
3. Notifications.
4. Documents.
5. Events.
6. Connect: mentors, availability and booking.
7. Team-call booking.
8. Course Shortlisting check.
9. Zenna AI findings.
10. Mentor requests.
11. Project004. Last, because it is not live.

**Could stay as fixed frontend text if the team prefers:** testimonials, FAQs, help channels, product intro videos and social links. Each is listed as a question above so the team can decide rather than build them by default.

**Decisions needed before backend work starts:**
- Are Connect bookings made inside the dashboard, or by linking to the Connect site?
- Does the backend calculate Course Shortlisting percentages (the current frontend formula is fake), and do the results feed the dashboard carousel?
- Who decides when Project004 goes live? (Project team; a config flag is enough for now.)
- Do notifications update live, or on page load?

**Not covered:** the demo copy in `fixtures.ts` for the "what matters today" focus banner, the hero cards and the journey steps (`FOCUS`, `HERO`, `JOURNEY`). No page renders them today.
