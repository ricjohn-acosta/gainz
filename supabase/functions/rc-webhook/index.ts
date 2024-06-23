import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseAdmin = createClient<any>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req) => {
  const handleSetSubscriptionStatus = async (event, eventStatus) => {
    const { error } = await supabaseAdmin
      .from("rc_customers")
      .update({ subscription_status: eventStatus })
      .eq("rc_customer_id", event.original_app_user_id);

    console.log(error);
  };

  if (req.method === "POST") {
    try {
      const { event } = await req.json();

      let res;
      switch (event.type) {
        case "INITIAL_PURCHASE":
          res = event;
          handleSetSubscriptionStatus(event, "SUBSCRIBED");
          break;
        case "RENEWAL":
          res = event;
          handleSetSubscriptionStatus(event, "SUBSCRIBED");
          break;
        case "CANCELLATION":
          res = event;
          handleSetSubscriptionStatus(event, "UNSUBSCRIBED");
          break;
        case "EXPIRATION":
          res = event;
          handleSetSubscriptionStatus(event, "UNSUBSCRIBED");
          break;
        default:
          console.log("Unhandled event type:", event.type);
      }

      if (res) {
        console.log(res, res.type);
        return new Response(JSON.stringify(res), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      console.log("No response to return...");
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  } else {
    return new Response("Method not allowed", { status: 405 });
  }
});
