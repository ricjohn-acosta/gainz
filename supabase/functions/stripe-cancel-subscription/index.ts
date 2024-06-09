import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { cancelSubscription } from "../_features/stripe/controller.ts";

console.log("Stripe payment-sheet handler up and running!");
serve(async (req) => {
  try {
    const { subscriptionId } = await req.json();
    let res = false;

    const subscription = await cancelSubscription(subscriptionId);

    if (subscription) {
      res = true;
    }

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      details: error.message,
      status: 400,
    });
  }
});
