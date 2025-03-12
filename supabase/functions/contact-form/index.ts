
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@1.0.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    if (!body.name || !body.email || !body.subject || !body.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseKey || !resendKey) {
      console.error("Missing environment variables:", {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
        resendKey: !!resendKey
      });
      
      return new Response(
        JSON.stringify({ error: "Server configuration missing" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    try {
      // Save to database
      console.log("Saving to database...");
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
        // Continue with email even if DB fails
      }
      
      // Send email notification
      console.log("Sending email notification...");
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['contact@automatizalo.co'],
        subject: `New Contact Form: ${body.subject}`,
        html: `
          <h1>New Contact Message</h1>
          <p><strong>From:</strong> ${body.name} (${body.email})</p>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <h2>Message:</h2>
          <p>${body.message}</p>
        `,
      });

      if (emailError) {
        console.error("Email error:", emailError);
        return new Response(
          JSON.stringify({ error: "Failed to send email", details: emailError }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: emailData }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (innerError) {
      console.error("Operation error:", innerError);
      return new Response(
        JSON.stringify({ error: "Operation failed", details: String(innerError) }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
