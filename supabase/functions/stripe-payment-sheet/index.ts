import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { stripe } from "../_features/stripe/stripe.ts";
import {
  createOrRetrieveCustomer,
  createOrUpdateSubscription,
} from "../_features/stripe/controller.ts";

console.log("Stripe payment-sheet handler up and running!");
serve(async (req) => {
  try {
    // Get the authorization header from the request.
    // When you invoke the function via the client library it will automatically pass the authenticated user's JWT.
    const authHeader = req.headers.get("Authorization")!;

    // Retrieve the logged in user's Stripe customer ID or create a new customer object for them.
    const customer = await createOrRetrieveCustomer(authHeader);

    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" },
    );

    const priceId = "price_1PLgad03MaXp75WnxEKPDNxg";
    const { quantity, seats } = await req.json();

    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const subscription = await createOrUpdateSubscription(
      seats,
      customer,
      quantity,
      priceId,
    );

    console.log('subscription', subscription)
    // Return the customer details as well as the Stripe publishable key which we have set in our secrets.
    const res = {
      paymentIntent: subscription.latest_invoice.payment_intent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
      subscriptionId: subscription.id,
    };
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
