
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@1.0.0";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Contact form submission:", formData);

    // Save submission to database
    const supabaseClient = getSupabaseClient();
    const { error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Send email using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Using Resend API Key:", resendApiKey ? "Key is present" : "Key is missing");
    
    if (!resendApiKey) {
      throw new Error("Resend API key is missing");
    }
    
    const resend = new Resend(resendApiKey);
    
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["contact@automatizalo.co"],
      subject: `New Contact Form: ${formData.subject}`,
      html: `
        <h1>New Contact Message</h1>
        <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <h2>Message:</h2>
        <p>${formData.message}</p>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully",
        emailId: data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper to get Supabase client in edge function
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

serve(handler);
