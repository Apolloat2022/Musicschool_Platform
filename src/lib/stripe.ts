import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
// This should only be used on the server side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-05-27.dahlia", // Matches installed stripe package version
  typescript: true,
});

export const getStripePublishableKey = () => {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
};
