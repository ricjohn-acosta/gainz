// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from "https://esm.sh/stripe@15.8.0?target=deno&deno-std=0.132.0&no-check";

export const stripe = Stripe(Deno.env.get("LIVE_STRIPE_SECRET_KEY") ?? "", {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2022-08-01",
});