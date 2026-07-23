# Self-Serve Signup + Trial System — What's Built & What You Need to Plug In

## What's now working

**1. Public signup** — `POST /auth/signup` (no login needed) creates a Hospital +
Admin user together, starts a 15-day trial with full PREMIUM features, sends a
welcome email, and auto-logs the person in. Frontend page: `/signup`, linked from
the login page.

**2. Trial enforcement** — computed live (no cron job needed) every time someone
loads the dashboard, via `GET /hospitals/my-plan`. A banner shows days remaining;
once `trialEndsAt` passes, a full-screen paywall blocks the dashboard until they
pick a plan at `/dashboard/upgrade`. Super Admin is never blocked by this.

**3. Self-serve upgrade + payment** — `/dashboard/upgrade` shows Basic (₹999) vs
Premium (₹2999), opens real Razorpay checkout, and a webhook activates the plan
on successful payment. This is separate from Super Admin's internal plan toggle
(which still bypasses payment entirely, as before).

**4. Per-hospital SMTP** — added to Clinic Settings, alongside the existing
per-hospital WhatsApp config. The manual "send invoice by email" button now uses
*each hospital's own* SMTP credentials instead of one shared global Gmail account,
so invoices arrive from the clinic's own address.

## Bugs fixed along the way
- **Staff passwords were being hashed twice** (`auth.service.ts` hashed, then
  `users.service.ts` hashed the hash again) — this would have made every
  admin-created staff login silently fail. Fixed.
- **Razorpay webhook had zero signature verification** — anyone could have POSTed
  a fake "payment succeeded" event and granted themselves a free upgrade. Fixed
  with proper HMAC verification against the raw request body.
- **Order creation never tagged which hospital/plan it was for** — the webhook
  had no way to know what to activate even on a real payment. Fixed via Razorpay
  order `notes`.
- **Basic plan was hardcoded to cost ₹0** in the old subscription endpoint. Fixed
  — Basic is ₹999, Premium ₹2999 (single source of truth in `razorpay.service.ts`).
- **PaymentsModule was never registered** in `app.module.ts` — the entire payments
  system silently didn't exist until now.

## What YOU need to fill in before this goes live

**Razorpay (platform-level — one account, since VAIDYA collects from all hospitals):**
- `RAZORPAY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` — set as real environment
  variables on your backend host (Render), not in a committed `.env`.
- The Razorpay **public key ID** goes in Super Admin → Settings → `razorpayKey`
  (already existed as a field, just needs a real value).
- In your Razorpay dashboard, add a webhook pointing to
  `https://your-api-domain/payments/webhook` and copy its signing secret into
  `RAZORPAY_WEBHOOK_SECRET`.

**SMTP (per-hospital — each clinic configures their own):**
- Each hospital's admin fills in Host/Port/Username/Password/From-Email under
  Clinic Settings → Email (SMTP). For Gmail, this must be an App Password.
- The platform's *own* welcome/trial-reminder emails still use the global SMTP
  settings in Super Admin → Settings (separate from per-hospital SMTP).

**WhatsApp (per-hospital — already existed, unchanged):**
- Each hospital's own Meta WhatsApp Business API credentials go in the same
  Clinic Settings page, in the section above the new SMTP one.

## Known limitation
Trial-reminder emails ("3 days left") have a method ready (`sendTrialEndingSoonEmail`
in `mail.service.ts`) but nothing calls it on a schedule yet — there's no cron
package installed. Adding `@nestjs/schedule` and a daily job to call it for
hospitals nearing expiry is the natural next step if you want that automated too.
