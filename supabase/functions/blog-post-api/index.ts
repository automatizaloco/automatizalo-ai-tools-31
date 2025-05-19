
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
    // Call the existing translate-blog function
    const { data, error } = await supabase.functions.invoke("translate-blog", {
      body: {
        text: content,
        title: title,
        excerpt: excerpt,
        targetLang: targetLang,
        preserveFormatting: true,
        format: "html"
      }
    });

    if (error) {
      console.error(`Error translating to ${targetLang}:`, error);
      throw new Error(`Translation to ${targetLang} failed: ${error.message}`);
    }

    return {
      title: data?.title || "",
      excerpt: data?.excerpt || "",
      content: data?.content || ""
    };
  } catch (error) {
    console.error(`Error in translateContent to ${targetLang}:`, error);
    throw error;
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
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Verify that request method is POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    // Parse request body
    const requestData = await req.json();
    console.log("Received blog post creation request:", JSON.stringify(requestData).substring(0, 200) + "...");

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
      image: requestData.image || "https://juwbamkqkawyibcvllvo.supabase.co/storage/v1/object/public/blog_images/placeholder.jpg",
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

    // Start translations in the background
    const translationPromises = [];

    try {
      console.log("Starting translations to Spanish and French...");
      // Translate to Spanish
      translationPromises.push((async () => {
        try {
          console.log("Translating to Spanish...");
          const esTranslation = await translateContent(
            requestData.content,
            requestData.title,
            requestData.excerpt,
            "es"
          );
          await saveTranslation(
            savedPost.id,
            "es",
            esTranslation.title,
            esTranslation.excerpt,
            esTranslation.content
          );
          console.log("Spanish translation completed and saved.");
        } catch (esError) {
          console.error("Error in Spanish translation:", esError);
          // We continue with the process even if one translation fails
        }
      })());

      // Translate to French
      translationPromises.push((async () => {
        try {
          console.log("Translating to French...");
          const frTranslation = await translateContent(
            requestData.content,
            requestData.title,
            requestData.excerpt,
            "fr"
          );
          await saveTranslation(
            savedPost.id,
            "fr",
            frTranslation.title,
            frTranslation.excerpt,
            frTranslation.content
          );
          console.log("French translation completed and saved.");
        } catch (frError) {
          console.error("Error in French translation:", frError);
          // We continue with the process even if one translation fails
        }
      })());

      // Wait for translations to complete or timeout after 30 seconds
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 30000));
      await Promise.race([Promise.all(translationPromises), timeoutPromise]);
      
    } catch (translationError) {
      console.error("Error during translation process:", translationError);
      // We still consider the API call successful if the main post was created,
      // even if translations failed
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog post created successfully",
        id: savedPost.id,
        slug: savedPost.slug,
        url: `/blog/${savedPost.slug}`
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
