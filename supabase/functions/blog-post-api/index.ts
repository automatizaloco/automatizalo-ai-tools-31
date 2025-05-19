
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

// CORS headers for the API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Connect to Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Setup Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate a slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Estimate read time based on content length (rough estimate)
const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${readTimeMinutes} min read`;
};

// Translate blog content to the target language using existing functions
const translateContent = async (content: string, title: string, excerpt: string, targetLang: string) => {
  try {
    console.log(`Attempting to translate to ${targetLang}`);

    // Create a client that doesn't timeout too quickly
    const fetchWithTimeout = async (url: string, options: any, timeout = 60000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    };

    // Call the existing translate-blog function with the custom fetch
    const translateUrl = `${supabaseUrl}/functions/v1/translate-blog`;
    console.log(`Calling translation service at: ${translateUrl}`);

    const response = await fetchWithTimeout(translateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        text: content,
        title: title,
        excerpt: excerpt,
        targetLang: targetLang,
        preserveFormatting: true,
        format: "html"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from translate-blog: ${response.status}`, errorText);
      throw new Error(`Translation API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Translation to ${targetLang} successful`);

    return {
      title: data?.title || "",
      excerpt: data?.excerpt || "",
      content: data?.content || ""
    };
  } catch (error) {
    console.error(`Error in translateContent to ${targetLang}:`, error);
    // Return empty results rather than throwing to allow the process to continue
    return {
      title: "",
      excerpt: "",
      content: ""
    };
  }
};

// Save a translated version of the blog post
const saveTranslation = async (
  blogPostId: string,
  language: string,
  translatedTitle: string,
  translatedExcerpt: string,
  translatedContent: string
) => {
  try {
    // Skip saving if no content was translated successfully
    if (!translatedTitle || !translatedContent) {
      console.log(`Skipping ${language} translation save - empty content`);
      return;
    }

    console.log(`Saving ${language} translation for post ${blogPostId}`);

    const translationRecord = {
      blog_post_id: blogPostId,
      language,
      title: translatedTitle,
      excerpt: translatedExcerpt,
      content: translatedContent
    };

    const { error } = await supabase
      .from("blog_translations")
      .insert(translationRecord);

    if (error) {
      console.error(`Error creating ${language} translation:`, error);
      throw new Error(`Failed to create translation: ${error.message}`);
    }

    console.log(`Successfully saved ${language} translation`);
  } catch (error) {
    console.error(`Error in saveTranslation for ${language}:`, error);
    // Don't rethrow - we want to continue even if saving translations fails
  }
};

serve(async (req) => {
  console.log("Received request", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Verify that request method is POST
  if (req.method !== "POST") {
    console.log(`Method not allowed: ${req.method}`);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    // Parse request body
    const rawRequestData = await req.json();
    console.log("Received blog post creation request:", JSON.stringify(rawRequestData).substring(0, 200) + "...");
    
    // Handle both array and object formats
    const requestData = Array.isArray(rawRequestData) ? rawRequestData[0] : rawRequestData;

    // Validate required fields
    const requiredFields = ["title", "content", "excerpt", "category", "author"];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    }

    // Prepare blog post data
    const slug = requestData.slug || generateSlug(requestData.title);
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const readTime = estimateReadTime(requestData.content);
    const status = requestData.status || "published";
    
    // Use image_url if provided, otherwise use image
    const imageUrl = requestData.image_url || requestData.image || "https://juwbamkqkawyibcvllvo.supabase.co/storage/v1/object/public/blog_images/placeholder.jpg";

    // Create the blog post
    const blogPostData = {
      title: requestData.title,
      slug: slug,
      excerpt: requestData.excerpt,
      content: requestData.content,
      category: requestData.category,
      tags: requestData.tags || [],
      author: requestData.author,
      date: requestData.date || currentDate,
      read_time: readTime,
      image: imageUrl,
      featured: requestData.featured || false,
      status: status
    };

    console.log("Saving blog post to database...");
    const { data: savedPost, error: saveError } = await supabase
      .from("blog_posts")
      .insert(blogPostData)
      .select("*")
      .single();

    if (saveError) {
      console.error("Error saving blog post:", saveError);
      return new Response(
        JSON.stringify({ error: `Failed to save blog post: ${saveError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Blog post saved successfully, ID:", savedPost.id);

    // Run translations in a background task to avoid timeout issues
    const runTranslations = async () => {
      try {
        console.log("Starting translations to Spanish and French...");
        
        // Run translations in parallel but catch errors individually
        const [esTranslation, frTranslation] = await Promise.all([
          // Spanish translation
          translateContent(
            requestData.content,
            requestData.title,
            requestData.excerpt,
            "es"
          ).catch(error => {
            console.error("Error translating to Spanish:", error);
            return { title: "", excerpt: "", content: "" };
          }),
          
          // French translation
          translateContent(
            requestData.content,
            requestData.title,
            requestData.excerpt,
            "fr"
          ).catch(error => {
            console.error("Error translating to French:", error);
            return { title: "", excerpt: "", content: "" };
          })
        ]);

        // Save translations independently - don't wait for both to complete
        await Promise.allSettled([
          saveTranslation(
            savedPost.id,
            "es",
            esTranslation.title,
            esTranslation.excerpt,
            esTranslation.content
          ),
          saveTranslation(
            savedPost.id,
            "fr",
            frTranslation.title,
            frTranslation.excerpt,
            frTranslation.content
          )
        ]);
        
        console.log("Translation process completed");
      } catch (translationError) {
        console.error("Error during translation process:", translationError);
        // Translation errors don't fail the entire operation
      }
    };

    // Start translations in the background without awaiting
    if (typeof EdgeRuntime !== 'undefined') {
      // In environments supporting waitUntil
      EdgeRuntime.waitUntil(runTranslations());
      console.log("Translations started in background");
    } else {
      // Fallback for environments without waitUntil
      runTranslations().catch(error => console.error("Translation background task failed:", error));
      console.log("Translations started in background (without waitUntil)");
    }

    // Create the full URL for the blog post
    const relativeUrl = `/blog/${savedPost.slug}`;
    const fullUrl = `https://automatizalo.co${relativeUrl}`;

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog post created successfully",
        id: savedPost.id,
        slug: savedPost.slug,
        url: relativeUrl,
        fullUrl: fullUrl
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: `Failed to process request: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
