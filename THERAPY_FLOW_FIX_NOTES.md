# Therapy Prescribe → Schedule → Therapist Flow — Fix Notes

## What was audited (doctor → reception → therapist)
1. Doctor prescribes therapies in the consultation page
   (`veda-client/src/app/dashboard/appointments/[id]/page.tsx`, mirrored in
   `.../patients/[id]/emr/page.tsx`) → `PATCH /appointments/:id` with `recommendedTherapies`.
2. Backend `AppointmentsController.update` → `AppointmentsService.update` saves it via `$set`.
   The `recommendedTherapies` schema field is a proper Mongoose subdocument array
   (`appointment.schema.ts`), so each entry gets its own `_id` automatically — required for
   step 4 to find the right entry later. Confirmed correct.
3. Reception dashboard (`ReceptionDashboard.tsx`) reads `recommendedTherapies` where
   `isProcessed` is false/undefined and lists them under "Pending Recommendations."
   Clicking **Schedule** opens a modal (date/time/room/therapist), which on submit:
   - `POST /appointments/process-recommendation` (now correctly auth-guarded — see below)
   - `POST /therapies` (creates the record the Therapist Dashboard reads)
4. Therapist Dashboard reads via `GET /therapies/me/today`, filtered by `therapistId` +
   today's date range. Confirmed correct.

**Conclusion: the code for this entire flow is correctly wired.** No logic bug found after
three independent passes (button wiring, DTO/validation layer, Mongoose schema, service layer).

## Fixes applied in this pass
- `appointments.controller.ts`: `POST /appointments/process-recommendation` had **no auth
  guard at all** — anyone could hit it unauthenticated. Added `@UseGuards(JwtAuthGuard)`.
- `app.module.ts`: was importing the `AuditLog` schema class directly instead of
  `AuditLogsModule` — invalid Nest module reference. Fixed, and stripped ~200 lines of
  dead commented-out historical versions of the file.
- `ReceptionDashboard.tsx`:
  - Schedule-therapy submit now surfaces the actual backend error message (was a generic
    "Failed to schedule therapy" that hid the real cause) and logs full details to console.
  - Added a visible warning in the modal if no THERAPIST-role staff accounts exist for the
    hospital, since the required dropdown being silently empty was a plausible dead-end.
- `.gitignore`: confirmed `.env` is excluded (it already was on inspection).
- JWT secret fallback and CORS wildcard: already fixed in the version you uploaded (no
  action needed, verified correct).

## Why you may still see "nothing happens, no console error" on the live site
Since the code is verified correct and you've confirmed a redeploy + hard refresh still
shows the old behavior, this points to a **deployment configuration issue, not a code bug**.
Check, in this order:

1. **Vercel → Project Settings → General → Root Directory** — must be set to `veda-client`.
   This repo has `veda-api` and `veda-client` as sibling folders; if Root Directory is blank
   or wrong, Vercel can build/serve something other than what you expect.
2. **Latest Vercel deployment → Source tab** — open
   `src/components/dashboards/ReceptionDashboard.tsx` in Vercel's own viewer and search for
   `"was missing from render tree"`. If it's not there, the fix isn't actually live.
3. **Commit SHA on the deployment** vs. `git log -1 --oneline` locally for the branch you
   intend to deploy — confirm they match.
4. **Render (backend)** — same root-directory check for `veda-api`, and confirm
   `JWT_SECRET`, `MONGO_URI`, etc. are set as real environment variables there (not relying
   on a committed `.env`, which won't be present in most deploy pipelines anyway).
5. Confirm at least one user with role `THERAPIST` exists for the hospital you're testing —
   the new UI warning will now tell you this directly instead of failing silently.

## Files changed in this package
- `veda-api/src/app.module.ts`
- `veda-api/src/appointments/appointments.controller.ts`
- `veda-client/src/components/dashboards/ReceptionDashboard.tsx`
