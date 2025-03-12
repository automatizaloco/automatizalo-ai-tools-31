
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { createTransport } from "npm:nodemailer@6.9.9";
import { google } from "npm:googleapis@128.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface NewsletterSendRequest {
  templateId?: string;
  frequency: string;
  customSubject?: string;
  customContent?: string;
  testMode?: boolean;
  testEmail?: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  date: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateId, frequency, customSubject, customContent, testMode = false, testEmail } = await req.json() as NewsletterSendRequest;
    
    console.log(`Processing newsletter request: frequency=${frequency}, testMode=${testMode}`);
    
    // Fetch subscribers based on frequency
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('frequency', frequency);

    if (subscribersError) {
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }

    if (subscribers.length === 0 && !testMode) {
      console.log(`No subscribers found for ${frequency} newsletter`);
      return new Response(
        JSON.stringify({ message: `No subscribers found for ${frequency} newsletter` }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get template
    let template;
    if (templateId) {
      const { data: templateData, error: templateError } = await supabase
        .from('newsletter_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) {
        throw new Error(`Failed to fetch template: ${templateError.message}`);
      }
      template = templateData;
    } else {
      // Use default template
      template = {
        name: "Default Template",
        subject: customSubject || `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Newsletter`,
        header_text: `Here's your ${frequency} update`,
        footer_text: "Thank you for subscribing to our newsletter!",
      };
    }

    // Get newsletter custom content
    let customContentBlocks = [];
    if (templateId) {
      const { data: contentBlocks, error: contentError } = await supabase
        .from('newsletter_content')
        .select('*')
        .eq('template_id', templateId)
        .order('position', { ascending: true });

      if (!contentError) {
        customContentBlocks = contentBlocks || [];
      }
    }

    // Define the date range based on frequency
    const now = new Date();
    let startDate;
    if (frequency === 'weekly') {
      // One week ago
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (frequency === 'monthly') {
      // One month ago
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
    }

    const formattedStartDate = startDate.toISOString().split('T')[0];
    
    // Fetch recent blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, slug, image, date')
      .gte('date', formattedStartDate)
      .order('date', { ascending: false });

    if (blogError) {
      throw new Error(`Failed to fetch blog posts: ${blogError.message}`);
    }

    // Generate email content
    const subject = customSubject || template.subject;
    const emailContent = generateNewsletterHTML(template, customContentBlocks, blogPosts, customContent);

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      Deno.env.get("GOOGLE_CLIENT_ID"),
      Deno.env.get("GOOGLE_CLIENT_SECRET"),
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN"),
    });

    // Get a new access token
    const tokens = await oauth2Client.refreshAccessToken();
    const accessToken = tokens.credentials.access_token;

    // Configure nodemailer
    const transporter = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "contact@automatizalo.co",
        clientId: Deno.env.get("GOOGLE_CLIENT_ID"),
        clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET"),
        refreshToken: Deno.env.get("GOOGLE_REFRESH_TOKEN"),
        accessToken: accessToken,
      },
    });

    // Send the newsletter
    let sentCount = 0;
    let recipientEmails: string[] = [];

    if (testMode && testEmail) {
      console.log(`Test mode enabled, sending to ${testEmail}`);
      recipientEmails = [testEmail];
    } else {
      recipientEmails = subscribers.map((sub) => sub.email);
    }

    for (const email of recipientEmails) {
      try {
        const info = await transporter.sendMail({
          from: "Automatizalo <contact@automatizalo.co>",
          to: email,
          subject: subject,
          html: emailContent,
        });
        console.log(`Email sent to ${email}: ${info.messageId}`);
        sentCount++;
      } catch (sendError) {
        console.error(`Failed to send email to ${email}:`, sendError);
      }
    }

    // Record in history if not test mode
    if (!testMode) {
      const { error: historyError } = await supabase
        .from('newsletter_history')
        .insert({
          template_id: templateId || null,
          subject: subject,
          content: emailContent,
          frequency: frequency,
          recipient_count: sentCount,
        });

      if (historyError) {
        console.error("Failed to record newsletter history:", historyError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent to ${sentCount} recipients`,
        testMode: testMode
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateNewsletterHTML(
  template: any, 
  contentBlocks: any[], 
  blogPosts: BlogPost[],
  customContent?: string
): string {
  // Basic styling
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${template.subject}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { margin-bottom: 30px; }
        .footer { margin-top: 30px; color: #777; font-size: 14px; }
        .blog-post { margin-bottom: 30px; }
        .blog-post img { max-width: 100%; }
        .blog-post h2 { margin-bottom: 10px; }
        .blog-post .excerpt { margin-bottom: 10px; }
        .blog-post .read-more {
          display: inline-block;
          padding: 5px 10px;
          background: #f1f1f1;
          text-decoration: none;
          color: #333;
          border-radius: 3px;
        }
        .content-block { margin-bottom: 30px; }
        hr { border: 0; height: 1px; background: #ddd; margin: 30px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${template.subject}</h1>
        <p>${template.header_text || ''}</p>
      </div>
      
      ${customContent ? `<div class="content-block">${customContent}</div><hr>` : ''}
      
      ${contentBlocks.map(block => `
        <div class="content-block">
          <h2>${block.title}</h2>
          <div>${block.content}</div>
        </div>
      `).join('<hr>')}
      
      ${blogPosts.length > 0 ? `
        <hr>
        <h2>Latest Blog Posts</h2>
        ${blogPosts.map(post => `
          <div class="blog-post">
            <h3>${post.title}</h3>
            <p class="date">${new Date(post.date).toLocaleDateString()}</p>
            <p class="excerpt">${post.excerpt}</p>
            <a href="https://automatizalo.co/blog/${post.slug}" class="read-more">Read More</a>
          </div>
        `).join('')}
      ` : ''}
      
      <div class="footer">
        <p>${template.footer_text || ''}</p>
        <p>If you no longer wish to receive these emails, you can <a href="https://automatizalo.co/unsubscribe">unsubscribe here</a>.</p>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

serve(handler);
