import { stripe } from "./stripe.ts";
// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
const supabaseAdmin = createClient<any>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

export const retrieveCustomer = async (authHeader: string) => {
  // Get JWT from auth header
  const jwt = authHeader.replace("Bearer ", "");
  // Get the user object
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(jwt);
  if (!user) throw new Error("No user found for JWT!");

  // Check if the user already has a Stripe customer ID in the Database.
  const { data, error } = await supabaseAdmin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("profile_id", user?.id);
  console.log(data?.length, data, error);
  if (error) throw error;

  if (data?.length === 1) {
    // Exactly one customer found, return it.
    const customer = data[0].stripe_customer_id;
    console.log(`Found customer id: ${customer}`);
    return customer;
  }

  return null;
};

export const createOrRetrieveCustomer = async (authHeader: string) => {
  // Get JWT from auth header
  const jwt = authHeader.replace("Bearer ", "");
  // Get the user object
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(jwt);
  if (!user) throw new Error("No user found for JWT!");

  // Check if the user already has a Stripe customer ID in the Database.
  const { data, error } = await supabaseAdmin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("profile_id", user?.id);
  console.log(data?.length, data, error);
  if (error) throw error;
  if (data?.length === 1) {
    // Exactly one customer found, return it.
    const customer = data[0].stripe_customer_id;
    console.log(`Found customer id: ${customer}`);
    return customer;
  }
  if (data?.length === 0) {
    // Create customer object in Stripe.
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { uid: user.id },
    });
    console.log(`New customer "${customer.id}" created for user "${user.id}"`);
    // Insert new customer into DB
    await supabaseAdmin
      .from("stripe_customers")
      .insert({ profile_id: user.id, stripe_customer_id: customer.id })
      .throwOnError();
    return customer.id;
  } else throw new Error(`Unexpected count of customer rows: ${data?.length}`);
};

export const createOrUpdateSubscription = async (
  seats,
  customerId,
  quantity,
  priceId,
) => {
  try {
    // Fetch all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let subscription;

    if (subscriptions.data.length > 0) {
      // Customer already has an active subscription, update it
      const existingSubscription = subscriptions.data[0];
      const updatedSubscription = await stripe.subscriptions.update(
        existingSubscription.id,
        {
          items: [
            {
              id: existingSubscription.items.data[0].id,
              price: priceId,
              quantity,
            },
          ],
          metadata: { seats },
        },
      );

      subscription = updatedSubscription;
    } else {
      // Customer does not have an active subscription, create a new one
      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId, quantity }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: { seats },
      });

      console.log(subscription);
    }

    return subscription;
  } catch (error) {
    console.error("Error creating or updating subscription:", error);
    res.status(400).json({
      error: true,
      message: "Error creating or updating subscription",
      details: error.message,
    });
  }
};

export const updateSubscription = async (
  seats,
  customerId,
  newQuantity,
  priceId,
) => {
  try {
    // Fetch all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      // Customer already has an active subscription, update it
      const existingSubscription = subscriptions.data[0];
      return await stripe.subscriptions.update(existingSubscription.id, {
        items: [
          {
            id: existingSubscription.items.data[0].id,
            price: priceId,
            quantity: newQuantity,
          },
        ],
        metadata: { seats },
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Error fetching subscription",
      });
    }
  } catch (error) {
    console.error("Error creating or updating subscription:", error);
    res.status(400).json({
      error: true,
      message: "Error creating or updating subscription",
      details: error.message,
    });
  }
};

export const cancelSubscription = async (id) => {
  try {
    return await stripe.subscriptions.cancel(id);
  } catch (error) {
    console.error("Error creating or updating subscription:", error);
    res.status(400).json({
      error: true,
      message: "Error creating or updating subscription",
      details: error.message,
    });
  }
};
