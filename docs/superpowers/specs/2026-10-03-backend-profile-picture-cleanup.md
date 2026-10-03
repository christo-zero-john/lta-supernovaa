# Backend: delete replaced profile pictures and validate the upload

Status: proposed on 2026-10-03. Not implemented. For the `lta-backend` repository.

Written from reading the backend code. Nothing here was run against the live API.

## Problem

1. **Old pictures are never deleted.** When a profile picture is replaced or removed, only the path in the database changes. The old file stays in S3 under `profiles/`. `AWS_S3_FILE_OVERWRITE = False` gives every upload a new object name, the project has no `django-cleanup`, and no signal or serializer deletes the old file. A student who replaces a photo because they want it gone still has it in the bucket.
2. **Any file is accepted as a picture.** `StudentProfile.profile_picture` and `MemberProfile.profile_picture` take any file type and any size. Only the mentor profile is protected, by its `ResizedImageField`.

Other uploads in this backend already delete the old file by hand (`Career.resume`, application letters, profile documents), so this is a gap, not a design choice.

## Scope

In scope: the three profile picture fields.

| Model | Field | File |
| --- | --- | --- |
| `StudentProfile` | `profile_picture` (`FileField`, `profiles/`) | `users/models/student/profile.py` |
| `MemberProfile` | `profile_picture` (`ImageField`, `profiles/`) | `users/models/member/member_profile.py` |
| `MentorProfile` | `profile_picture` (`ResizedImageField`, `mentor/profile-pictures/`) | `mentoring/models/profile.py` |

Out of scope: every other file field (documents, letters, resumes), and removing files that are already orphaned (see Follow-up).

## Why the fix goes on the model, not in one serializer

`StudentProfile.profile_picture` is written from at least five places:

- `users/serializers/shared_profile.py` (`PATCH profiles/me/`, used by the Supernova dashboard)
- `admissions/serializers/student/profile.py` (two update serializers)
- `candidates/serializers/profile.py` (through `source="student_profile.profile_picture"`)
- `candidates/services/onboarding.py`
- Django admin

The member picture is written in `users/serializers/member/admin_profile.py` and `application_assistant.py`, and the mentor picture in `mentoring/serializers/mentor/profile.py`.

Fixing each writer separately would miss the next one that is added. One model-level rule covers all of them.

## Design

### 1. Delete the old file when the picture changes

Add one small reusable helper, for example `common/files.py`:

- `delete_replaced_file(sender, instance, field_name)`: on `pre_save`, load the stored value of the field for `instance.pk`. If there is one and it differs from the new value (including a new value of `None`), remember it and delete it from storage once the transaction commits.
- `delete_file_on_delete(sender, instance, field_name)`: on `post_delete`, delete the file.

Connect both for the three fields above in each app's `apps.py` `ready()`.

Rules the helper must follow:

- **Delete after commit.** Use `transaction.on_commit` so a rolled-back save never loses the file the row still points to.
- **Never delete a file that is still in use.** Skip the delete when the old and new names are equal.
- **Do nothing on create** (`instance.pk` is `None` or the row does not exist yet).
- **A storage error must not fail the request.** Catch it, log it with the object name, and continue. An orphaned file is better than a failed profile update.
- **Respect `update_fields`.** If the save names `update_fields` and the picture is not among them, do nothing.

`QuerySet.update()` and bulk operations do not send `pre_save`. No current writer uses them for these fields; note this in the helper's docstring.

### 2. Validate the upload

Add one validator, for example `common/validators.py`:

- Allowed types: JPG, PNG, WebP.
- Maximum size: 5 MB.
- Check the content, not only the extension: open it with Pillow (`Image.open(...).verify()`) and reject a file that is not a real image of an allowed format.

Apply it to `StudentProfile.profile_picture` and `MemberProfile.profile_picture` through the field's `validators`. `ModelSerializer` picks model validators up, so every writer is covered. This needs a migration for each model, with no data change.

Keep `StudentProfile.profile_picture` a `FileField`; changing its type is not needed for this fix. The mentor field already resizes and re-encodes, so it only needs the size limit if it has none.

Error response: HTTP 400 in the project's usual error shape, with a message a student can act on, for example "Upload a JPG, PNG or WebP image up to 5 MB."

The Supernova dashboard already limits its picker to these types and 5 MB, so the two sides agree.

## API behaviour after the change

| Request | Result |
| --- | --- |
| `PATCH profiles/me/` with a new `profile_picture` | Saved; the previous object is removed from S3 after commit |
| `PATCH profiles/me/` with `profile_picture: null` | Field cleared; the object is removed |
| `PATCH profiles/me/` without `profile_picture` | Picture untouched |
| Upload of a PDF, an SVG, or a renamed non-image | 400 |
| Upload over 5 MB | 400 |
| Deleting a profile or its user | The picture object is removed |

No response shape changes. No frontend change is needed.

## Tests

Use an in-memory or temporary file storage in tests, so no test touches S3.

For each of the three models:

- Replacing the picture deletes the old file and keeps the new one.
- Setting the picture to `None` deletes the file.
- Saving other fields keeps the file.
- Saving with `update_fields` that excludes the picture keeps the file.
- Deleting the row deletes the file.
- A save that rolls back keeps the old file.
- A storage failure during the delete does not fail the save.

For validation, through `PATCH profiles/me/`:

- JPG, PNG and WebP are accepted.
- A PDF, an SVG, and a text file renamed to `.png` are rejected with 400.
- A 5 MB + 1 byte image is rejected with 400.

## Rollout

1. Merge the validator and migrations.
2. Merge the cleanup helper and its signal connections.
3. Deploy. No downtime and no data migration.

Risk is low: the change only removes files the database has stopped pointing to, and only after a successful commit.

## Follow-up (separate task)

Files already orphaned stay in the bucket. A one-off management command can list objects under `profiles/` and `mentor/profile-pictures/`, compare them with the paths the three models still reference, and delete the rest. It should have a dry-run mode that only prints what it would delete, and be run by someone with access to the bucket.

## Acceptance criteria

- [ ] Replacing or removing a student, member or mentor profile picture removes the old object from storage.
- [ ] Unrelated updates never delete a picture.
- [ ] A non-image or an image over 5 MB is rejected with a 400 and a clear message.
- [ ] All writers listed above are covered without per-serializer code.
- [ ] The tests above pass without network access.
