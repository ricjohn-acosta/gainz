import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { stripe } from "../_features/stripe/stripe.ts";
import { retrieveCustomer } from "../_features/stripe/controller.ts";

serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization")!;
    let res;

    // Get stripe customer id in supabase db
    const customerId = await retrieveCustomer(authHeader);

    if (!customerId) {
      res = null;
    } else {
      // Return customer subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      res = subscriptions.data[0];
    }

    return new Response(JSON.stringify({ subscription: res }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      details: error.message,
      status: 400,
    });
  }
});
