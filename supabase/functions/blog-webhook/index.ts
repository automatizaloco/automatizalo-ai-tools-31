
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

// Process and store image from URL to Supabase storage
const processImage = async (imageUrl: string, title: string): Promise<string> => {
  try {
    // Skip if already a Supabase storage URL
    if (imageUrl.includes('supabase.co/storage/v1/object/public/blog_images')) {
      console.log("Image is already in Supabase storage");
      return imageUrl;
    }

    // Skip if a placeholder
    if (imageUrl.includes('placeholder.com')) {
      return imageUrl;
    }

    console.log("Downloading image from:", imageUrl);
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const blob = await imageResponse.blob();
    
    // Prepare file path and name
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
    const fileExtension = blob.type.split('/')[1] || 'jpg';
    const fileName = `blog/${sanitizedTitle}-webhook-${Date.now()}.${fileExtension}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabaseAdmin
      .storage
      .from('blog_images')
      .upload(fileName, blob, {
        contentType: blob.type,
        upsert: false
      });

    if (error) {
      console.error("Storage upload error:", error);
      return imageUrl; // Return original if upload fails
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('blog_images')
      .getPublicUrl(fileName);

    console.log("Image stored at:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Image processing error:", error);
    return imageUrl; // Return original URL if processing fails
  }
}

const processNewBlogPost = async (payload: any) => {
  // Process image if present
  if (payload.image) {
    try {
      payload.image = await processImage(payload.image, payload.title);
    } catch (imageError) {
      console.error("Failed to process image:", imageError);
      // Continue with original image URL
    }
  }

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

// Create blog_images bucket if it doesn't exist
const ensureStorageBucket = async () => {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets.some(b => b.name === 'blog_images');
    
    if (!bucketExists) {
      const { data, error } = await supabaseAdmin.storage.createBucket('blog_images', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (error) {
        console.error("Error creating storage bucket:", error);
      } else {
        console.log("Created blog_images bucket successfully");
      }
    }
  } catch (error) {
    console.error("Error checking/creating storage bucket:", error);
  }
};

// Handle the webhook request
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Ensure blog_images bucket exists
    await ensureStorageBucket();
    
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
