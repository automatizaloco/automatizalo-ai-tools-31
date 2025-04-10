
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
    console.log("Processing image from URL:", imageUrl);
    
    // Skip if already a Supabase storage URL
    if (imageUrl && imageUrl.includes('supabase.co/storage/v1/object/public/blog_images')) {
      console.log("Image is already in Supabase storage");
      return imageUrl;
    }

    // Skip if a placeholder and no other image URL is found
    if (imageUrl && imageUrl.includes('placeholder.com')) {
      console.log("Placeholder image detected, skipping processing");
      return imageUrl;
    }
    
    // Skip if empty or invalid URL
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      console.log("Invalid image URL:", imageUrl);
      return "https://via.placeholder.com/800x400";
    }

    console.log("Downloading image from:", imageUrl);
    
    // Download the image with proper error handling
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!imageResponse.ok) {
      console.error(`Failed to download image: ${imageResponse.status} - ${await imageResponse.text()}`);
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const blob = await imageResponse.blob();
    console.log(`Downloaded image: ${blob.size} bytes, type: ${blob.type}`);
    
    if (blob.size === 0) {
      console.error("Downloaded image has 0 bytes");
      return "https://via.placeholder.com/800x400";
    }
    
    // Prepare file path and name
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
    const fileExtension = blob.type.split('/')[1] || 'jpg';
    const fileName = `blog/${sanitizedTitle}-webhook-${Date.now()}.${fileExtension}`;
    
    console.log(`Uploading image as ${fileName} (${blob.size} bytes)`);
    
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
      
      // If the error is because the file already exists, try to get the URL
      if (error.message && error.message.includes('already exists')) {
        console.log("File already exists, getting existing URL");
        
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('blog_images')
          .getPublicUrl(fileName);
          
        return publicUrl;
      }
      
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
  console.log("Processing payload:", JSON.stringify(payload, null, 2));

  // Better image URL extraction - check for all common field names
  // First check direct fields
  let imageUrl = 
    payload.image_url || 
    payload.imageUrl || 
    payload.image || 
    payload.url || 
    payload.coverImage || 
    payload.cover_image || 
    payload.featured_image;
  
  console.log("Initial image URL search found:", imageUrl);
  
  // If no image URL found, check response array format - webhook might return an array
  if (!imageUrl && Array.isArray(payload) && payload.length > 0) {
    const firstItem = payload[0];
    imageUrl = 
      firstItem.image_url || 
      firstItem.imageUrl || 
      firstItem.image || 
      firstItem.url || 
      firstItem.coverImage || 
      firstItem.cover_image || 
      firstItem.featured_image;
      
    console.log("Found image URL in array format:", imageUrl);
    
    // Update payload to use the first item if it's an array
    if (typeof firstItem === 'object') {
      payload = firstItem;
    }
  }
  
  // Check if there's an image property in nested data
  if (!imageUrl && payload.data && Array.isArray(payload.data) && payload.data.length > 0) {
    imageUrl = 
      payload.data[0].url || 
      payload.data[0].image_url || 
      payload.data[0].imageUrl ||
      payload.data[0].image;
    
    console.log("Found image URL in nested data:", imageUrl);
  }
  
  // Check output property for JSON content with image
  if (!imageUrl && payload.output) {
    try {
      const jsonMatch = payload.output.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const extractedContent = JSON.parse(jsonMatch[1]);
        imageUrl = 
          extractedContent.image_url || 
          extractedContent.imageUrl || 
          extractedContent.image || 
          extractedContent.url;
          
        console.log("Found image URL in JSON output:", imageUrl);
      }
    } catch (err) {
      console.error("Error parsing JSON in output:", err);
    }
  }
  
  console.log("Final image URL found:", imageUrl);

  // Process image if present
  if (imageUrl) {
    try {
      payload.image = await processImage(imageUrl, payload.title);
      console.log("Processed image URL:", payload.image);
    } catch (imageError) {
      console.error("Failed to process image:", imageError);
      // Continue with original image URL
      payload.image = imageUrl;
    }
  } else {
    console.log("No image URL found in payload, using placeholder");
    payload.image = "https://via.placeholder.com/800x400";
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
    image: payload.image, // We've already processed this above
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
