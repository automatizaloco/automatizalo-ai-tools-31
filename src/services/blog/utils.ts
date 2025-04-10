import { BlogPost } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Utility function to transform database post to BlogPost type
export const transformDatabasePost = (post: any): BlogPost => ({
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
  featured: post.featured,
  status: post.status || 'published',
  url: post.url,
  translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
    if (trans) {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
    }
    return acc;
  }, {}) : {}
});

// Utility function to transform BlogPost to database format
export const transformPostForDatabase = (postData: any) => {
  const { translations, readTime, ...rest } = postData;
  return {
    ...rest,
    read_time: readTime
  };
};

// Download image from URL and convert to base64
export const downloadImage = async (imageUrl: string): Promise<string | null> => {
  try {
    console.log("Downloading image from URL:", imageUrl);
    
    // Check if URL is already a valid image URL from Supabase storage
    if (imageUrl.includes('supabase.co/storage/v1/object/public/blog_images')) {
      console.log("Image is already in Supabase storage, no need to download:", imageUrl);
      return imageUrl;
    }
    
    // If it's a base64 data URL, return as is
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // If it's a placeholder, return as is
    if (imageUrl.includes('placeholder.com')) {
      return imageUrl;
    }
    
    // For external URLs, download the image
    console.log("Fetching external image...");
    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
};

/**
 * Parse webhook response JSON from various formats
 */
export const parseWebhookJsonResponse = (response: any): any => {
  console.log("Parsing webhook response:", response);
  
  // If response is already a parsed object, return it directly
  if (typeof response === 'object' && !Array.isArray(response) && response !== null) {
    console.log("Response is already an object");
    return response;
  }
  
  // If response is an array, take the first item
  if (Array.isArray(response)) {
    console.log("Response is an array, returning first item:", response[0]);
    return response[0];
  }
  
  // Try to parse response as JSON if it's a string
  if (typeof response === 'string') {
    try {
      // Try direct parsing
      const parsed = JSON.parse(response);
      console.log("Successfully parsed response string as JSON:", parsed);
      
      // If parsed result is an array, take the first item
      if (Array.isArray(parsed)) {
        console.log("Parsed JSON is an array, returning first item:", parsed[0]);
        return parsed[0];
      }
      
      return parsed;
    } catch (firstError) {
      console.error("First parsing attempt failed:", firstError);
      
      try {
        // Try to extract JSON from a markdown code block
        const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const parsed = JSON.parse(jsonMatch[1].trim());
          console.log("Extracted JSON from code block:", parsed);
          
          // If parsed result is an array, take the first item
          if (Array.isArray(parsed)) {
            console.log("Parsed JSON from code block is an array, returning first item:", parsed[0]);
            return parsed[0];
          }
          
          return parsed;
        }
      } catch (secondError) {
        console.error("Second parsing attempt failed:", secondError);
      }
      
      console.error("Failed to parse response as JSON:", response);
      return null;
    }
  }
  
  console.error("Unknown response format:", response);
  return null;
};

// Upload image to Supabase storage from URL or base64
export const uploadImageToStorage = async (imageSource: string, postTitle: string): Promise<string | null> => {
  try {
    console.log("Preparing to upload image to storage");
    
    // Check if it's already a Supabase storage URL for our project
    if (imageSource.includes('juwbamkqkawyibcvllvo.supabase.co/storage/v1/object/public/blog_images')) {
      console.log("Image is already in Supabase storage, skipping upload");
      return imageSource;
    }
    
    // Create a bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const blogBucketExists = buckets?.some(bucket => bucket.name === 'blog_images');
      
      if (!blogBucketExists) {
        console.log("Creating blog_images bucket");
        const { error } = await supabase.storage.createBucket('blog_images', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (error) {
          console.error("Error creating bucket:", error);
        } else {
          console.log("Blog images bucket created successfully");
        }
      } else {
        console.log("Blog images bucket already exists");
      }
    } catch (bucketError) {
      console.error("Error checking/creating bucket:", bucketError);
      // Continue anyway as the bucket might already exist
    }
    
    let imageBlob: Blob;
    let fileExtension = 'jpg'; // Default extension
    
    // If it's a base64 data URL
    if (imageSource.startsWith('data:image/')) {
      console.log("Converting base64 image to blob");
      
      // Extract base64 data from the data URL
      const base64Data = imageSource.split(',')[1];
      
      // Get the MIME type from the data URL
      const mimeMatch = imageSource.match(/data:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      
      // Get file extension from mime type
      if (mimeType === 'image/png') fileExtension = 'png';
      if (mimeType === 'image/gif') fileExtension = 'gif';
      if (mimeType === 'image/webp') fileExtension = 'webp';
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      imageBlob = new Blob(byteArrays, { type: mimeType });
    } 
    // If it's an external URL
    else {
      console.log("Fetching image from external URL:", imageSource);
      try {
        const response = await fetch(imageSource, {
          headers: {
            'Accept': 'image/*',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        imageBlob = await response.blob();
        
        // Determine file extension from content type
        const contentType = response.headers.get('content-type');
        if (contentType) {
          if (contentType.includes('png')) fileExtension = 'png';
          if (contentType.includes('gif')) fileExtension = 'gif';
          if (contentType.includes('webp')) fileExtension = 'webp';
        }
      } catch (fetchError) {
        console.error("Error fetching external image:", fetchError);
        return null;
      }
    }
    
    // Generate a unique filename with sanitized post title
    const sanitizedTitle = (postTitle || 'image').toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
    const fileName = `${sanitizedTitle}-${uuidv4().substring(0, 8)}.${fileExtension}`;
    const filePath = `blog/${fileName}`;
    
    console.log(`Uploading image as ${filePath} (${imageBlob.size} bytes)`);
    
    // Upload to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('blog_images')
      .upload(filePath, imageBlob, {
        contentType: imageBlob.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading image to storage:", error);
      
      // If the error is because the file already exists, try to get the URL
      if (error.message.includes('already exists')) {
        console.log("File already exists, getting existing URL");
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('blog_images')
          .getPublicUrl(filePath);
          
        return publicUrl;
      }
      
      return null;
    }
    
    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase
      .storage
      .from('blog_images')
      .getPublicUrl(data?.path || filePath);
    
    console.log("Image uploaded successfully to:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    return null;
  }
};
