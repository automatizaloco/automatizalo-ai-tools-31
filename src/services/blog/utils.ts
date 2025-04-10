import { supabase } from '@/integrations/supabase/client';
import { NewBlogPost, BlogPost } from '@/types/blog';

// Constants
const API_URL = "https://juwbamkqkawyibcvllvo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d2JhbWtxa2F3eWliY3ZsbHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDUxMDIsImV4cCI6MjA1NzI4MTEwMn0.uqwyR5lwp8JXa7qAZu6nZcCEdaoKOxX0XxQls2vg7Fk";

/**
 * Transform database post to BlogPost type
 */
export const transformDatabasePost = (post: any): BlogPost => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time,
    author: post.author,
    featured: post.featured || false,
    url: post.url || "",
    status: post.status || 'published',
  };
};

/**
 * Extract the blog post data from a webhook response
 */
export const extractBlogPostFromResponse = (responseText: string): Partial<NewBlogPost> | null => {
  try {
    console.log("Extracting blog post data from response text:", responseText);
    
    // Try to parse if it's direct JSON
    try {
      const jsonData = JSON.parse(responseText);
      console.log("Response is valid JSON:", jsonData);
      
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        console.log("Response is an array, using first item");
        return jsonData[0];
      }
      
      return jsonData;
    } catch (jsonError) {
      console.log("Response is not valid JSON, trying to extract JSON from text");
    }
    
    // If not direct JSON, try to find JSON blocks in the text
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const extractedJson = JSON.parse(jsonMatch[1]);
        console.log("Extracted JSON from markdown code block:", extractedJson);
        return extractedJson;
      } catch (extractError) {
        console.error("Failed to parse JSON from markdown code block:", extractError);
      }
    }
    
    // Try to find image information in the response
    const imageMatch = responseText.match(/image(?:_url|Url)?\s*:\s*["']?(https?:\/\/[^"'\s]+)["']?/i);
    const imageUrl = imageMatch ? imageMatch[1] : null;
    console.log("Found image URL in text:", imageUrl);
    
    // If we found an image but couldn't parse JSON, create a basic object with the image
    if (imageUrl) {
      return {
        image: imageUrl
      };
    }
    
    console.log("Could not extract any usable data from the response");
    return null;
  } catch (error) {
    console.error("Error extracting blog post data:", error);
    return null;
  }
};

/**
 * Extract image URL from various object formats
 */
export const extractImageUrl = (data: any): string | null => {
  if (!data) return null;
  
  // Direct image fields
  if (data.image_url) return data.image_url;
  if (data.imageUrl) return data.imageUrl;
  if (data.image) return data.image;
  
  // Nested image fields
  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    const firstItem = data.data[0];
    if (firstItem.url) return firstItem.url;
    if (firstItem.image_url) return firstItem.image_url;
    if (firstItem.imageUrl) return firstItem.imageUrl;
    if (firstItem.image) return firstItem.image;
  }
  
  return null;
};

/**
 * Process an image from URL
 * Downloads the image and uploads to Supabase storage
 */
export const processImage = async (imageUrl: string, title: string): Promise<string> => {
  try {
    console.log("Processing image from URL:", imageUrl);
    
    // Skip if already a Supabase storage URL
    if (imageUrl && imageUrl.includes('supabase.co/storage/v1/object/public/blog_images')) {
      console.log("Image is already in Supabase storage");
      return imageUrl;
    }
    
    // Skip if not a valid URL
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.+/i)) {
      console.log("Invalid image URL:", imageUrl);
      return "https://via.placeholder.com/800x400";
    }
    
    console.log("Downloading and uploading image for:", title);
    
    // Direct fetch approach instead of using webhook
    try {
      // Fetch the image directly
      const imageResponse = await fetch(imageUrl, {
        headers: {
          'Accept': 'image/*',
          'User-Agent': 'Mozilla/5.0 (compatible; AutomatizaloBlogBot/1.0)'
        }
      });
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      
      const contentType = imageResponse.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error("Response is not an image");
      }
      
      const blob = await imageResponse.blob();
      
      // Create a file object from blob
      const fileExt = contentType.split('/')[1] || 'jpg';
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const file = new File([blob], fileName, { type: contentType });
      
      // Upload directly to Supabase
      const { data, error } = await supabase.storage
        .from('blog_images')
        .upload(`blogs/${fileName}`, file);
      
      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog_images')
        .getPublicUrl(`blogs/${fileName}`);
        
      return publicUrlData.publicUrl;
    } catch (directError) {
      console.error("Direct download failed:", directError);
      
      // Fallback to the original image URL
      return imageUrl;
    }
  } catch (error) {
    console.error("Failed to process image:", error);
    return imageUrl; // Return original URL on error
  }
};

/**
 * Save a blog post to the database
 */
export const saveBlogPost = async (data: NewBlogPost): Promise<BlogPost> => {
  try {
    // Map readTime to read_time for database compatibility
    const dbData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags,
      author: data.author,
      date: data.date,
      read_time: data.readTime,
      image: data.image,
      featured: data.featured,
      status: data.status
      // Do not include url field if not in schema
    };
    
    const { data: savedPost, error } = await supabase
      .from('blog_posts')
      .insert(dbData)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error saving blog post:", error);
      throw error;
    }
    
    return transformDatabasePost(savedPost);
  } catch (error) {
    console.error("Database error when saving blog post:", error);
    throw error;
  }
};

/**
 * Update a blog post in the database
 */
export const updateBlogPost = async (id: string, data: Partial<NewBlogPost>): Promise<BlogPost> => {
  // Map readTime to read_time for database compatibility
  const dbData: any = { ...data };
  
  if (data.readTime) {
    dbData.read_time = data.readTime;
    delete dbData.readTime;
  }
  
  const { data: updatedPost, error } = await supabase
    .from('blog_posts')
    .update(dbData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
  
  return transformDatabasePost(updatedPost);
};

/**
 * Delete a blog post from the database
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
    
    // Also delete any translations for this post
    const { error: translationError } = await supabase
      .from('blog_translations')
      .delete()
      .eq('blog_post_id', id);
    
    if (translationError) {
      console.error("Error deleting blog translations:", translationError);
      // Don't throw here, as the main post was already deleted
    }
    
    // Dispatch an event to notify components of the deletion
    const event = new Event('blogPostDeleted');
    window.dispatchEvent(event);
    
  } catch (error) {
    console.error("Database error when deleting blog post:", error);
    throw error;
  }
};

/**
 * Update a blog post's status (draft/published)
 */
export const updateBlogPostStatus = async (id: string, status: 'draft' | 'published'): Promise<BlogPost> => {
  const { data: updatedPost, error } = await supabase
    .from('blog_posts')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating blog post status:", error);
    throw error;
  }
  
  return transformDatabasePost(updatedPost);
};
