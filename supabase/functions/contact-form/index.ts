
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const reqData = await req.json();
    console.log("Received form data:", reqData);
    
    // Basic validation
    if (!reqData.name || !reqData.email || !reqData.subject || !reqData.message) {
      console.log("Missing required fields");
      return new Response(
        JSON.stringify({ error: "All fields are required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseKey || !resendKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    // Save to database (don't stop on error)
    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: reqData.name,
          email: reqData.email,
          subject: reqData.subject,
          message: reqData.message
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
      } else {
        console.log("Contact message saved to database");
      }
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
      // Continue execution even if DB save fails
    }

    // Send email
    try {
      const { data, error: emailError } = await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: ["contact@automatizalo.co"],
        subject: `New Contact Form: ${reqData.subject}`,
        html: `
          <h1>New Contact Message</h1>
          <p><strong>From:</strong> ${reqData.name} (${reqData.email})</p>
          <p><strong>Subject:</strong> ${reqData.subject}</p>
          <h2>Message:</h2>
          <p>${reqData.message}</p>
        `
      });

      if (emailError) {
        console.error("Email error:", emailError);
        return new Response(
          JSON.stringify({ error: "Failed to send email", details: emailError }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      console.log("Email sent successfully:", data);
      
      // Success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Contact form submitted successfully",
          emailId: data?.id
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
