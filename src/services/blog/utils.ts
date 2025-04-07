
import { BlogPost } from "@/types/blog";

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
  status: post.status || 'published', // Default to published if status isn't present
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
    const response = await fetch(imageUrl);
    
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

// Parse webhook JSON response function to handle the direct array response format
export const parseWebhookJsonResponse = (responseText: string): any => {
  try {
    console.log("Parsing webhook response text:", responseText);
    
    // Parse the response as JSON
    const parsedResponse = JSON.parse(responseText);
    console.log("Initially parsed response:", parsedResponse);
    
    // Check if this is an array with blog post data
    if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
      const firstItem = parsedResponse[0];
      console.log("Processing first item in array:", firstItem);
      
      // For new format - direct blog post object in the array
      if (firstItem.title && firstItem.content) {
        console.log("Found direct blog post object:", firstItem);
        
        // Create a result object with all data from the response
        const result = { ...firstItem };
        
        // Handle different image URL property names
        if (firstItem.image_url && !firstItem.image) {
          result.image = firstItem.image_url;
          console.log("Mapped image_url to image:", result.image);
        }
        
        // Handle read_time vs readTime
        if (firstItem.read_time && !firstItem.readTime) {
          result.readTime = firstItem.read_time;
          console.log("Mapped read_time to readTime:", result.readTime);
        }
        
        return result;
      }
      
      // Handle old format with output/data structure
      if (firstItem.output) {
        const jsonMatch = firstItem.output.match(/```json\n([\s\S]*?)\n```/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const extractedContent = JSON.parse(jsonMatch[1]);
            console.log("Successfully extracted content from output:", extractedContent);
            
            // Create a result object with all the extracted content
            const result = { ...extractedContent };
            
            // Add image URL from the data property if available
            if (firstItem.data && Array.isArray(firstItem.data) && firstItem.data.length > 0) {
              // Check for different image URL properties
              const dataItem = firstItem.data[0];
              if (dataItem.url) {
                result.image = dataItem.url;
                console.log("Added image URL from data.url:", result.image);
              } else if (dataItem.image_url) {
                result.image = dataItem.image_url;
                console.log("Added image URL from data.image_url:", result.image);
              }
            }
            
            return result;
          } catch (err) {
            console.error("Error parsing JSON inside output:", err);
          }
        }
      }
      
      // If we have data with an image URL, add it to the result
      if (firstItem.data && Array.isArray(firstItem.data) && firstItem.data.length > 0) {
        const result = { ...firstItem };
        const dataItem = firstItem.data[0];
        
        if (dataItem.url) {
          result.image = dataItem.url;
          console.log("Using image URL from data.url:", result.image);
        } else if (dataItem.image_url) {
          result.image = dataItem.image_url;
          console.log("Using image URL from data.image_url:", result.image);
        }
        
        return result;
      }
    }
    
    // If nothing else works, return the original parsed response
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing webhook response:", error);
    throw new Error("Invalid JSON response from webhook");
  }
};
