
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.37.0';

// Define allowed origins for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client with admin rights
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const validateRequest = (req: Request, payload: any) => {
  // Add validation logic here if needed
  // For example, validate required fields, API key, etc.
  
  const mandatoryFields = ['title', 'content', 'slug', 'excerpt', 'category', 'author'];
  for (const field of mandatoryFields) {
    if (!payload[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Ensure we have a tags array
  if (!payload.tags || !Array.isArray(payload.tags)) {
    payload.tags = [];
  }
  
  return payload;
};

const processNewBlogPost = async (payload: any) => {
  // Map fields to match the database schema
  const blogData = {
    title: payload.title,
    slug: payload.slug || payload.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    tags: payload.tags,
    author: payload.author,
    date: payload.date || new Date().toISOString().split('T')[0],
    read_time: payload.read_time || payload.readTime || '5 min', // Handle both read_time and readTime
    image: payload.image || 'https://via.placeholder.com/800x400',
    featured: payload.featured || false,
    url: payload.url || null, // Store the source URL if provided
    status: payload.status || 'draft', // Handle the status field with a default value of draft
  };

  console.log('Creating blog post with data:', blogData);

  // Insert into the database
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert(blogData)
    .select()
    .single();

  if (error) {
    console.error('Error inserting blog post:', error);
    throw error;
  }

  console.log('Blog post created successfully:', data);
  
  // Handle translations if provided
  if (payload.translations) {
    try {
      await processTranslations(data.id, payload.translations);
    } catch (translationError) {
      console.error('Error processing translations:', translationError);
      // Continue even if translations fail
    }
  }

  return data;
};

const processTranslations = async (blogPostId: string, translations: any) => {
  const translationPromises = [];
  
  // Process each translation
  if (translations.fr) {
    translationPromises.push(
      supabaseAdmin
        .from('blog_translations')
        .insert({
          blog_post_id: blogPostId,
          language: 'fr',
          title: translations.fr.title || '',
          excerpt: translations.fr.excerpt || '',
          content: translations.fr.content || ''
        })
    );
  }
  
  if (translations.es) {
    translationPromises.push(
      supabaseAdmin
        .from('blog_translations')
        .insert({
          blog_post_id: blogPostId,
          language: 'es',
          title: translations.es.title || '',
          excerpt: translations.es.excerpt || '',
          content: translations.es.content || ''
        })
    );
  }
  
  // Wait for all translations to be processed
  if (translationPromises.length > 0) {
    const results = await Promise.all(translationPromises);
    for (const result of results) {
      if (result.error) {
        console.error('Translation insert error:', result.error);
      }
    }
  }
};

// Handle the webhook request
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Get the request body
    const payload = await req.json();
    console.log('Received webhook payload:', payload);
    
    // Validate the request
    const validatedPayload = validateRequest(req, payload);
    
    // Process the blog post
    const blogPost = await processNewBlogPost(validatedPayload);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog post created successfully',
        data: blogPost
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An error occurred while processing the webhook',
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
