// Server-side price catalog for ad-hoc (non-Stripe-Price) checkouts.
//
// SECURITY: this is the ONLY source of truth for these amounts. The checkout
// API resolves prices from here by product key — it must NEVER accept a price
// amount sent from the browser, or a user could tamper the request and pay any
// amount they like (e.g. change a $150 lesson to $1).
//
// Recurring plans and predefined services use Stripe Price IDs instead, which
// are defined server-side / in Stripe and are equally safe.

export const PRODUCTS = {
  class_enrollment: { priceCents: 15000, name: "Masterclass Enrollment" },
  extra_credits_5: { priceCents: 5000, name: "5 Extra Service Credits" },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

/** Resolve a product by key. Returns null for unknown keys (reject the request). */
export function resolveProduct(
  key: string
): { priceCents: number; name: string } | null {
  return (PRODUCTS as Record<string, { priceCents: number; name: string }>)[key] ?? null;
}
