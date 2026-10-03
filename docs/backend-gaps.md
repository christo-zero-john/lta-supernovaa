# Supernova dashboard: what the backend is missing

What `lta-backend` needs to add or change so the Supernova student dashboard can run on real data. It comes from reading both codebases on 3 October 2026, not from testing the live API.

The dashboard combines every LTA product (Course Shortlisting, Zenna, LTA Connect, Project004), so it may read from any backend app. The response formats the frontend expects are in [dashboard-backend-data.md](dashboard-backend-data.md).

## Summary

| Area | State |
| --- | --- |
| Account tier | "Verified student" is the existing `is_approved` plus an active membership. One permission change (section 7). |
| Profile (name, photo, phone, gender) | Nothing needed. `PATCH profiles/me/` already covers it. |
| Course Shortlisting | Works. Needs university and course display fields. |
| Zenna applications | Works. Needs deadlines, next action, and student access to steps. |
| After the offer (APS, blocked account, insurance, visa) | Files are stored. No status per step. |
| LTA Connect | Works. Needs a topic, mentor recommendations, and one permission fix. |
| Documents | Stored in about ten separate models. No single list, no verification status. |
| Notifications | Missing entirely. |
| Events | Basic model only. No registration. |
| Team calls | Missing entirely. |
| Project004 | Only the job-profile onboarding exists. No jobs, competitions or rankings. |

## 1. Do not build these: they already exist

The earlier request doc asked for these as new work. They are already in the backend under other paths.

| Asked for | Use instead |
| --- | --- |
| `is_paid` on `users/me/` | `is_approved` (already returned). The dashboard now calls this tier "verified". |
| `PATCH users/me/` for the name | `PATCH profiles/me/` (`first_name`, `last_name`, `phone_number`, `gender`) |
| Photo upload and removal | `PATCH profiles/me/` with `profile_picture` as multipart, or `null` to remove |
| Mentor name and photo on bookings | `booked-slot/` already returns the full `mentor_profile` |
| Join link on bookings | `google_calendar_event.meet_link` (shown from 10 minutes before the start) |
| Month filter on bookings | `booked-slot/?start_date=&end_date=` |
| Mentor availability | `mentors/{id}/availability-slots/` and `.../month-availability-slots/?month=` |
| Booking and payment | `POST booked-slot/`, `checkout/`, `verify-payment/`, `cancellation-summary/`, `confirm-cancellation/` |
| Backend-calculated admit chances | `POST public/student-submissions/`, results in `shortlisted-courses/` |
| Shortlisting form options | `public/field-of-study/`, `public/interests/`, `public/germany/intakes/`, `public/language-certification-master/`, `public/universities/`, `public/courses/` |
| Assigned counsellor | `students/me/` returns `assigned_to` with name, photo, phone and `is_online` |

## 2. Changes to existing endpoints (no schema change)

| Endpoint | Change | Why |
| --- | --- | --- |
| `booked-slot/` (list) | Return an empty list for a student with no Connect membership. Today `IsConnectAllowed` refuses the request. | The Home calendar calls this for every student. |
| `students/{id}/applications/{id}/progress/` | Let a student read their own. Today it is admin-only. | The student sees only a percentage, not which steps are done. |
| `applications/` | Add `updated_at` to the response. | "Last activity" on each application. |
| `students/me/stats/` | Add `offers_received`, `average_completion`, `status_counts`. All derivable from existing data. | Zenna summary tiles. |
| `shortlisted-courses/` | Add `created_at`. | Report date. |
| `mentors/` | Add `sessions_count` (count of paid, completed bookings). | Mentor cards. |
| Zenna permission (`IsZennaAllowed`) | Stop requiring a verified email for approved students. See section 7. | An approved student must not be locked out. |
| `users/me/` | Add a computed `journey_stage`. See section 6 for the rule. | Sidebar and Home journey strip. |
| `profiles/me/` photo upload | Enforce file type and size (suggested JPG, PNG, WebP; 5 MB). | No limits were visible in the serializer. |

## 3. New columns on existing tables

| Model | Columns | Used for |
| --- | --- | --- |
| `Application` | `application_deadline` (date), `enrolment_deadline` (date), `next_action` (short text), `intake` (text), `course` (FK to `CourseMaster`, nullable) | Next deadline, days left, "what happens next" |
| `UniversityMaster` | `short_name`, `logo`, `image`, `city` | University cards and application rows |
| `CourseMaster` | `application_deadline` (date), `tuition_fee` (money), `duration_semesters` (int) | Shortlist cards |
| `StudentProfile` | `whatsapp_enabled` (bool), `arrived_in_germany_on` (date), `employment_started_on` (date), `profile_prompt_dismissed_at` (datetime) | WhatsApp toggle, last two journey stages, profile prompt |
| `Passport`, `Aadhar`, `APSCertificate`, `PassportPhoto`, `Signature`, `LOR`, `LanguageCertification`, `Education` files, candidate documents | `verification_status` (pending, verified, rejected), `rejection_reason`, `verified_by`, `verified_at` | Document vault status |
| `Visa`, `BlockedAccount`, `HealthInsurance`, `APSCertificate` | `status` (not started, in progress, done) | After-the-offer checklist |
| `BookedSlot` | `topic` (text) | Session cards and calendar |
| `Event` | `description`, `end_time`, `mode` (online, offline), `location`, `join_url` | Events list |

## 4. New tables

| Table | Main columns | Purpose |
| --- | --- | --- |
| `Notification` | `user`, `product`, `message`, `target_type`, `target_id`, `is_read`, `created_at` | The notification feed and unread count. Rows are written when an application, booking, document or shortlist changes. |
| `RequiredDocument` | `application` or `application_type`, `document_type`, `label` | Lets the backend say which documents are missing. |
| `EventRegistration` | `event`, `student_profile`, `created_at` | Registering for a webinar or workshop. |
| `TeamCallSlot` | `start_time`, `end_time`, `staff` | Free LTA team slots. |
| `TeamCallBooking` | `slot`, `student_profile`, `context`, `meet_link` | The free 15-minute call. |
| `ConnectWaitlist` | `student_profile`, `created_at` | Only if Connect stays closed to unverified students. |

Zenna AI (deadlines found in documents) is future scope, so it needs no table now.

### Project004 (when the product is defined)

| Table | Main columns |
| --- | --- |
| `Job` | `company`, `title`, `location`, `requirements`, `is_active` |
| `JobMatch` | `candidate_profile`, `job`, `match_percentage` |
| `JobApplication` | `candidate_profile`, `job`, `status` |
| `Competition` | `name`, `starts_at`, `ends_at` |
| `CompetitionEntry` | `competition`, `candidate_profile`, `score`, `rank` |
| `ProfileView` | `candidate_profile`, `employer`, `viewed_at` |

The existing candidate onboarding (nine steps, draft or submitted) is enough to show "job profile completeness" today.

## 5. New endpoints

| Endpoint | Returns |
| --- | --- |
| `GET dashboard/summary/` | One call for Home: journey stage, days to intake, application counts by status, average completion, next deadline, next session, unread notifications, document progress. Avoids five calls on every load. |
| `GET documents/` | One list across every document model: type, file name, upload date, verification status, where it is used. Plus the missing required documents. |
| `GET notifications/`, `PATCH notifications/{id}/`, `POST notifications/mark-all-read/` | The feed. |
| `GET students/me/checklist/` | After-the-offer steps with their status. |
| `GET connect/mentors/recommended/` | Mentors ranked for this student's field, target university and intake. |
| `POST events/{id}/register/`, `DELETE events/{id}/register/` | Event registration. `GET events/` also needs `?from=&to=` and `is_registered`. |
| `GET team-calls/availability/?month=`, `POST team-calls/` | Team call booking. |
| `POST auth/logout/` | Invalidates the refresh token. Token blacklisting is currently commented out in settings. |

## 6. Journey stage rule

Proposed, computed on the server so every client agrees:

| Stage | Condition |
| --- | --- |
| `aspirant` | Not approved |
| `applicant` | `is_approved` is true |
| `admitted` | At least one application with `admission_status = confirmed` |
| `in_germany` | `arrived_in_germany_on` is set |
| `working` | `employment_started_on` is set |

## 7. The "verified" rule (decided)

A student is verified when both are true:

- `is_approved` is true, and
- they have an active Zenna or Dashboard membership.

Email verification is not part of the rule. An approved student is already an LTA client and must be able to use the products even if they never confirmed their email.

This needs one backend change: `IsZennaAllowed` in `users/permissions.py` also requires `is_email_verified` today, so it would refuse an approved student with an unverified email. Either drop that condition for approved students, or mark the email as verified when an admin approves the student.

## 8. Decisions needed from the team

1. Is LTA Connect open to every student or only to verified students?
2. Are Connect bookings made inside the dashboard, or by linking to the Connect site?
3. Do notifications update live, or on page load?
4. Who sets document verification status: the assigned assistant, or any admin?

## 9. Suggested order

1. Section 2 changes (the Zenna permission first) and `dashboard/summary/`. Mostly existing data; unblocks Home and Zenna.
2. `Application` deadline columns and student access to steps.
3. University and course display columns.
4. Document verification columns and `GET documents/`.
5. `Notification`.
6. Connect: `topic`, `sessions_count`, recommendations.
7. After-the-offer status fields and checklist.
8. Events registration and team calls.
9. Project004 tables.
