
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
    
    // Validate form data
    if (!reqData.name || !reqData.email || !reqData.subject || !reqData.message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
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
      // Continue execution even if DB save fails
    }

    // Send email
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("Missing Resend API key");
      return new Response(
        JSON.stringify({ error: "Email service configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const resend = new Resend(resendKey);
    
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

  } catch (error) {
    console.error("Unhandled error in contact form handler:", error);
    
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
