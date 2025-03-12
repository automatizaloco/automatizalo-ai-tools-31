
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createTransport } from "npm:nodemailer@6.9.9";
import { google } from "npm:googleapis@128.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  email: string;
  frequency: string;
  type: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, frequency, type }: NotificationRequest = await req.json();

    // Log the received data
    console.log(`Notification request: ${type} for ${email} with ${frequency} frequency`);

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      Deno.env.get("GOOGLE_CLIENT_ID"),
      Deno.env.get("GOOGLE_CLIENT_SECRET"),
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN"),
    });

    try {
      // Get a new access token
      const tokens = await oauth2Client.refreshAccessToken();
      const accessToken = tokens.credentials.access_token;

      // Configure nodemailer
      const transporter = createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "contact@automatizalo.co", // The email address you used to set up OAuth
          clientId: Deno.env.get("GOOGLE_CLIENT_ID"),
          clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET"),
          refreshToken: Deno.env.get("GOOGLE_REFRESH_TOKEN"),
          accessToken: accessToken,
        },
      });

      // Set up email content
      let subject = "New Newsletter Subscription";
      let html = `
        <h1>New Newsletter Subscription</h1>
        <p>A new user has subscribed to your newsletter:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Frequency:</strong> ${frequency}</li>
        </ul>
      `;

      // Send email notification
      const info = await transporter.sendMail({
        from: "Automatizalo <contact@automatizalo.co>",
        to: "contact@automatizalo.co", // Admin email address
        subject,
        html,
      });

      console.log("Email sent successfully:", info.messageId);

      return new Response(
        JSON.stringify({ success: true, message: "Notification sent", messageId: info.messageId }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
