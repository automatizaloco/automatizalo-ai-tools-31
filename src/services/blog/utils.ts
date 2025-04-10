
import { supabase } from '@/integrations/supabase/client';
import { NewBlogPost, BlogPost } from '@/types/blog';

// Constants
const API_URL = "https://juwbamkqkawyibcvllvo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d2JhbWtxa2F3eWliY3ZsbHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDUxMDIsImV4cCI6MjA1NzI4MTEwMn0.uqwyR5lwp8JXa7qAZu6nZcCEdaoKOxX0XxQls2vg7Fk";

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
    
    // Use the blog webhook to process the image
    try {
      const response = await fetch(`${API_URL}/functions/v1/blog-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          title: title,
          slug: title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
          excerpt: "Processing image only",
          content: "Processing image only",
          category: "Image Processing",
          author: "System",
          image_url: imageUrl
        })
      });
      
      if (!response.ok) {
        console.error("Image processing webhook failed:", response.statusText);
        throw new Error(`Webhook failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.data && result.data.image) {
        console.log("Processed image URL:", result.data.image);
        return result.data.image;
      }
      
      throw new Error("No image URL returned from webhook");
    } catch (webhookError) {
      console.error("Failed to process image through webhook:", webhookError);
      return imageUrl; // Return original URL on error
    }
  } catch (error) {
    console.error("Failed to download image, using original URL:", error);
    return imageUrl;
  }
};

/**
 * Save a blog post to the database
 */
export const saveBlogPost = async (data: NewBlogPost): Promise<BlogPost> => {
  const { data: savedPost, error } = await supabase
    .from('blog_posts')
    .insert(data)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error saving blog post:", error);
    throw error;
  }
  
  return savedPost as BlogPost;
};
