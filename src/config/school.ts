// Central white-label configuration for a single school instance.
//
// Selling model: deploy one instance of this platform per school. Everything
// customer-facing that used to say "Apollo" is driven from here, so onboarding
// a new school means setting these NEXT_PUBLIC_SCHOOL_* environment variables
// (see .env.example) — no code changes.
//
// The defaults below keep the original Apollo branding as a working fallback,
// so existing deployments behave exactly as before if no env vars are set.

export const school = {
  /** Full display name, used in the hero, metadata, and emails. */
  name: process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Apollo Performing Arts & Academy",

  /** Phrase within `name` to highlight in the accent color (optional). */
  accentWord: process.env.NEXT_PUBLIC_SCHOOL_ACCENT_WORD ?? "Performing Arts",

  /** Short name used in the compact nav bars, e.g. "Apollo Academy". */
  shortName: process.env.NEXT_PUBLIC_SCHOOL_SHORT_NAME ?? "Apollo Academy",

  /** One-line hero subtitle. */
  tagline:
    process.env.NEXT_PUBLIC_SCHOOL_TAGLINE ??
    "Elevate your musicality with our signature learning tiers. Choose your path and begin your transformation today.",

  /** SEO / social description. */
  description:
    process.env.NEXT_PUBLIC_SCHOOL_DESCRIPTION ??
    "High-fidelity live music lessons and masterclasses.",

  /** Small footer tagline shown next to the copyright. */
  footerTagline:
    process.env.NEXT_PUBLIC_SCHOOL_FOOTER_TAGLINE ?? "Excellence in Performance",

  /** Public site URL (used for metadata + Open Graph). Must be a full URL. */
  url: process.env.NEXT_PUBLIC_SCHOOL_URL ?? "https://www.apollotunes.com",

  /** Contact / support email surfaced to parents and students. */
  contactEmail: process.env.NEXT_PUBLIC_SCHOOL_EMAIL ?? "revanaglobal@gmail.com",

  /** Path (under /public) to the school logo. */
  logoSrc: process.env.NEXT_PUBLIC_SCHOOL_LOGO ?? "/logo.png",

  /** Path (under /public) to the 1200x630 social share image. */
  ogImage: process.env.NEXT_PUBLIC_SCHOOL_OG_IMAGE ?? "/og-image.png",

  /**
   * Verified Resend sender for billing email, e.g.
   * "Springfield Music <billing@springfieldmusic.com>". MUST be on a
   * Resend-verified domain for this deployment or emails will fail to send.
   * Server-only (not exposed to the browser).
   */
  billingFrom:
    process.env.RESEND_FROM_EMAIL ??
    "Apollo Academy <billing@apolloperformingacademy.com>",
} as const;

/** Convenience: current year, for copyright lines. */
export const currentYear = new Date().getFullYear();
