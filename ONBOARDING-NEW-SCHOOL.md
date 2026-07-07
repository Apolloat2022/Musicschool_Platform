# Running this platform for another school

This platform is **white-label**: one codebase, deployed once per school. Each
school gets its own isolated instance — its own branding, URL, database,
payments, and logins. This guide explains the model and the exact steps to
bring a new school online.

_Last updated: July 6, 2026._

---

## How the model works

There is **one codebase**. You never copy or edit code to add a school. Instead
you deploy a **separate instance** of this same code for each school and give
that instance the school's own settings.

```
                 ┌───────────────────────────┐
   this repo ───▶│  Vercel deploy: Apollo     │──▶ apollotunes.com
   (template)    │  • Apollo branding         │    (Apollo's DB, Stripe, Clerk)
        │        └───────────────────────────┘
        │        ┌───────────────────────────┐
        └───────▶│  Vercel deploy: Springfield│──▶ springfieldmusic.com
                 │  • Springfield branding    │    (Springfield's DB, Stripe, Clerk)
                 └───────────────────────────┘
```

**Apollo is the built-in default.** With no branding variables set at all, the
app is fully branded "Apollo Performing Arts & Academy." Apollo's deployment
needs no branding configuration.

**Every school is fully isolated.** Because each instance points at its own
database and its own Stripe account, no school can see another's students,
lessons, or payments. Tuition flows directly into each school's own bank
account via their own Stripe.

**Updates:** when you improve the code, redeploy each school's instance to give
them the new version. (Vercel does this automatically on `git push` if the
instance is connected to this repo, or via `vercel --prod` if deployed by CLI.)

---

## What is configurable per school

All customer-facing branding is driven from `src/config/school.ts`, which reads
the environment variables below. Nothing is hardcoded — changing these changes
the name, logo, colors, and copy across the homepage, all four dashboards
(admin/teacher/student/parent), the schedule page, billing emails, the Stripe
sender, and the legal pages.

| Variable | What it controls | Example |
|---|---|---|
| `NEXT_PUBLIC_SCHOOL_NAME` | Full name (hero, metadata, emails) | `Apollo Performing Arts & Academy` |
| `NEXT_PUBLIC_SCHOOL_ACCENT_WORD` | Phrase in the name shown in accent color | `Performing Arts` |
| `NEXT_PUBLIC_SCHOOL_SHORT_NAME` | Compact name in nav bars | `Apollo Academy` |
| `NEXT_PUBLIC_SCHOOL_TAGLINE` | Hero subtitle | `Elevate your musicality…` |
| `NEXT_PUBLIC_SCHOOL_DESCRIPTION` | SEO / social description | `Live music lessons…` |
| `NEXT_PUBLIC_SCHOOL_FOOTER_TAGLINE` | Footer line next to copyright | `Excellence in Performance` |
| `NEXT_PUBLIC_SCHOOL_URL` | Public site URL | `https://www.apollotunes.com` |
| `NEXT_PUBLIC_SCHOOL_EMAIL` | Support/contact email shown to users | `support@apollotunes.com` |
| `NEXT_PUBLIC_SCHOOL_LOGO` | Logo path under `/public` | `/logo.png` |
| `NEXT_PUBLIC_SCHOOL_OG_IMAGE` | 1200×630 social image under `/public` | `/og-image.png` |
| `RESEND_FROM_EMAIL` | Verified billing email sender | `Apollo Academy <billing@apolloperformingacademy.com>` |

The logo itself is a file: replace `public/logo.png` (and `public/og-image.png`)
with the school's artwork in that instance.

See `.env.example` for the full, commented list including the non-branding
variables (database, auth, payments, video) described below.

---

## Onboarding a new school — step by step

Budget ~30–45 minutes. You (the operator) do this once per school.

### 1. Create the school's own accounts
These keep each school's data and money separate:
- **Database** — a new Neon Postgres project → gives you `DATABASE_URL`.
- **Stripe** — the school's own Stripe account (their bank details). Grab the
  live API keys and create their recurring tuition **Price** → gives you
  `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
  `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID`.
- **Clerk** — a new Clerk application for their logins → gives you
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.
- **Resend** — verify the school's sending domain → gives you `RESEND_API_KEY`
  and the `RESEND_FROM_EMAIL` address.
- **Video** — a Zoom Meeting SDK app and/or Jitsi JaaS app for live classrooms
  (`ZOOM_SDK_*`, `NEXT_PUBLIC_ZOOM_SDK_KEY`, `JITSI_*`, `NEXT_PUBLIC_JITSI_APP_ID`).

### 2. Set up the database schema
Run the Drizzle migration against the new database so the 10 tables exist:
```bash
DATABASE_URL="<their-neon-url>" npx drizzle-kit migrate
```
(The schema lives in `drizzle/`. Verify the tables: `users`, `music_classes`,
`enrollments`, `services`, `subscription_plans`, `subscriptions`, `purchases`,
`credit_transactions`, `exit_requests`, `attendance`.)

### 3. Create the Vercel project
- Import this repo as a **new Vercel project** (one project per school).
- Add the school's logo: replace `public/logo.png` / `public/og-image.png`
  (either commit a per-school asset or upload via the deployment).

### 4. Set the environment variables
In that Vercel project's **Settings → Environment Variables**, paste a filled-in
copy of `.env.example` with the school's values from steps 1–2. At minimum:
- All `NEXT_PUBLIC_SCHOOL_*` branding + `RESEND_FROM_EMAIL`
- `DATABASE_URL`, Clerk keys, Stripe keys + price ID, `RESEND_API_KEY`
- `ADMIN_USER`, `ADMIN_PASS`, `JWT_SECRET` (generate: `openssl rand -base64 32`)
- Video credentials (Zoom and/or Jitsi)
- `NEXT_PUBLIC_APP_URL` = the school's deployed URL

### 5. Point the Stripe webhook at the deployment
In the school's Stripe dashboard, add a webhook endpoint to
`https://<their-app-url>/api/stripe/webhook`, subscribe it to the invoice/
subscription events, and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

### 6. Deploy and smoke-test
Deploy, then verify on the live instance:
- Homepage shows the school's name/logo (not Apollo).
- Admin login works (`/admin`), and you can create a class.
- A test enrollment runs through Stripe checkout end to end.
- The upcoming-invoice email arrives from the school's `RESEND_FROM_EMAIL`.

### 7. Attach their domain
Add the school's custom domain in Vercel and update `NEXT_PUBLIC_SCHOOL_URL` /
`NEXT_PUBLIC_APP_URL` to match.

---

## Before ANY school goes live (applies to Apollo too)

These are "turn it on for real" items, independent of branding:

1. **Stripe live keys.** Development currently uses Stripe **test** keys. Swap to
   live keys and re-verify the webhook in live mode before taking real payments.
2. **Video credentials.** Live classrooms need Zoom and/or Jitsi keys set
   (`ZOOM_SDK_*` / `JITSI_*`). Without them, lessons can't start.
3. **Parental consent for minors.** Students are often minors, so the parent
   should be the account holder and consent on the child's behalf (COPPA and
   similar). Confirm the enrollment flow captures this before onboarding
   families. _(Not yet built — see project notes.)_
4. **Legal pages.** `/privacy` and `/terms` exist and auto-fill the school's
   name, but should be reviewed by counsel before launch.

### Ad-hoc pricing is server-authoritative (do not reintroduce client prices)

The checkout API (`/api/stripe/checkout`) **never accepts a price amount from the
browser.** Ad-hoc prices (class enrollment, extra credits) are resolved
server-side from `src/lib/pricing.ts` by a `productKey`; recurring plans use
Stripe Price IDs. This closed a tampering hole where a user could edit the
request and pay an arbitrary amount (e.g. a $150 lesson for $1).

**When configuring a school:** set that school's real prices in
`src/lib/pricing.ts` (or wire each product to a Stripe Price ID). **Never** pass
a `priceCents`/amount from a component to the checkout API — always a
`productKey` or `priceId`. Treat any code that sends a client-supplied price as
a security regression.

_Related known gap:_ the class price is currently a flat catalog value, and the
"extra credits" purchase does not yet attach a `serviceId`, so it charges
correctly but doesn't auto-grant credits. Wire these to real `services` /
`subscription_plans` rows (both have `price_cents` + `stripe_price_id` columns)
before selling those specific flows.

---

## Quick reference: is this ready to sell?

- ✅ **Core product** — auth, roles, scheduling, Stripe subscriptions +
  one-time payments, webhooks, invoicing emails, live classrooms, admin panel.
- ✅ **White-label** — fully config-driven; a new school needs zero code changes.
- ✅ **Payment integrity** — checkout prices are server-authoritative (no client
  price tampering).
- ⚠️ **Go-live gaps** — live Stripe keys, video credentials, parental-consent
  flow, and legal review (list above).

For the first handful of schools, deploy one instance each (this guide). Only
consider a shared multi-tenant rebuild once manual per-school deploys become the
bottleneck.
