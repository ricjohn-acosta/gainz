import sendgrid from "npm:@sendgrid/mail";
import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;
sendgrid.setApiKey(SENDGRID_API_KEY);

serve(async (req) => {
  try {
    const { recipientEmail } = await req.json();

    const msg = {
      to: recipientEmail,
      from: "admin@kapaii.app",
      templateId: "d-b8f49a11d2474578b76483e47ab12937",
    };

    await sendgrid.send(msg);
    return new Response(JSON.stringify(true), {
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
