import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { createTransport } from "npm:nodemailer@6.9.9";
import { google } from "npm:googleapis@128.0.0";
import { corsHeaders } from "../_shared/cors.ts";

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
  previewOnly?: boolean;
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
    const { templateId, frequency, customSubject, customContent, testMode = false, testEmail, previewOnly = false } = 
      await req.json() as NewsletterSendRequest;
    
    console.log(`Processing newsletter request: frequency=${frequency}, testMode=${testMode}, previewOnly=${previewOnly}`);
    
    // Fetch subscribers based on frequency (skip if preview only)
    let subscribers = [];
    if (!previewOnly) {
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('frequency', frequency);

      if (subscribersError) {
        throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
      }
      
      subscribers = subscribersData;
    }

    if (subscribers.length === 0 && !testMode && !previewOnly) {
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

    // Define the base URL for the website - now using the custom domain
    const baseUrl = "https://automatizalo.co";
    
    // Generate email content
    const subject = customSubject || template.subject;
    const emailContent = generateNewsletterHTML(template, customContentBlocks, blogPosts, customContent, baseUrl);

    // If this is just a preview request, return the HTML content
    if (previewOnly) {
      return new Response(
        JSON.stringify({ 
          success: true,
          subject: subject,
          content: emailContent
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

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
  customContent?: string,
  baseUrl: string = "https://automatizalo.co"
): string {
  // Logo URL (using the uploaded image from the user)
  const logoUrl = `${baseUrl}/lovable-uploads/5ac78895-cc3c-450b-b1ce-da2960edb89e.png`;
  
  // Social media links
  const socialLinks = {
    facebook: "https://www.facebook.com/automatizalo.co",
    instagram: "https://www.instagram.com/automatizalo.co/",
    twitter: "https://x.com/Automatizalo_co"
  };
  
  // WhatsApp number
  const whatsappNumber = "+573042037763";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  
  // Basic styling with brand colors: black, grey and white
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
          color: #333333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #ffffff;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center;
          padding: 20px;
          background-color: #333333;
          color: white;
        }
        .header img {
          max-width: 200px;
          margin-bottom: 15px;
        }
        .content-area {
          padding: 30px 20px;
        }
        .footer { 
          margin-top: 30px; 
          color: #555555; 
          font-size: 14px; 
          text-align: center;
          padding: 20px;
          background-color: #f1f1f1;
          border-top: 1px solid #dddddd;
        }
        .blog-post { 
          margin-bottom: 30px; 
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 480px) {
          .blog-post {
            flex-direction: row;
            align-items: flex-start;
            gap: 20px;
          }
        }
        .blog-post:last-child {
          border-bottom: none;
        }
        .blog-post-image { 
          flex-shrink: 0;
          width: 100%;
          max-width: 150px;
          margin-bottom: 15px;
        }
        @media (min-width: 480px) {
          .blog-post-image {
            margin-bottom: 0;
          }
        }
        .blog-post-image img { 
          width: 100%;
          height: auto;
          border-radius: 4px;
          object-fit: cover;
        }
        .blog-post-content {
          flex-grow: 1;
          padding-left: 0;
        }
        @media (min-width: 480px) {
          .blog-post-content {
            padding-left: 15px;
          }
        }
        .blog-post h2, .blog-post h3 { 
          margin-top: 0;
          margin-bottom: 10px; 
          color: #333333;
        }
        .blog-post .excerpt { 
          margin-bottom: 10px; 
        }
        .blog-post .read-more {
          display: inline-block;
          padding: 5px 10px;
          background: #333333;
          text-decoration: none;
          color: white;
          border-radius: 3px;
          font-size: 14px;
        }
        .content-block { 
          margin-bottom: 30px; 
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #333333;
          text-decoration: none;
        }
        .whatsapp-button {
          display: block;
          background-color: #333333;
          color: white;
          text-align: center;
          padding: 10px 15px;
          border-radius: 4px;
          margin: 20px auto;
          width: 200px;
          text-decoration: none;
          font-weight: bold;
        }
        hr { 
          border: 0; 
          height: 1px; 
          background: #ddd; 
          margin: 30px 0; 
        }
        a {
          color: #333333;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Automatizalo Logo" />
          <h1>${template.subject}</h1>
          <p>${template.header_text || ''}</p>
        </div>
        
        <div class="content-area">
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
                <div class="blog-post-image">
                  <img src="${post.image}" alt="${post.title}" />
                </div>
                <div class="blog-post-content">
                  <h3>${post.title}</h3>
                  <p class="date">${new Date(post.date).toLocaleDateString()}</p>
                  <p class="excerpt">${post.excerpt}</p>
                  <a href="${baseUrl}/blog/${post.slug}" class="read-more" target="_blank">Read More</a>
                </div>
              </div>
            `).join('')}
          ` : ''}
          
          <a href="${whatsappUrl}" class="whatsapp-button" target="_blank">Chat with us on WhatsApp</a>
        </div>
        
        <div class="footer">
          <p>${template.footer_text || ''}</p>
          
          <div class="social-links">
            <a href="${socialLinks.facebook}" target="_blank">Facebook</a>
            <a href="${socialLinks.instagram}" target="_blank">Instagram</a>
            <a href="${socialLinks.twitter}" target="_blank">X</a>
          </div>
          
          <p>If you no longer wish to receive these emails, you can <a href="${baseUrl}/unsubscribe" target="_blank">unsubscribe here</a>.</p>
          <p>&copy; ${new Date().getFullYear()} Automatizalo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

serve(handler);
