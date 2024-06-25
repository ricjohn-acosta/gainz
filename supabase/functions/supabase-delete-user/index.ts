import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseAdmin = createClient<any>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req) => {
  try {
    const { userId } = await req.json();

    const { error } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (!error) {
      return new Response("Successfully deleted user", {
        status: 200,
      });
    }

    return new Response("Failed to delete user", {
      status: 500,
    });
  } catch (e) {
    return new Response("Method not allowed", { status: 405 });
  }
});
