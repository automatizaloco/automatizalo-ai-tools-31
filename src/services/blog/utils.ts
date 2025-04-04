
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

// Parse webhook JSON response that might be nested in an unexpected format
export const parseWebhookJsonResponse = (responseText: string): any => {
  try {
    // First, try to parse the response as regular JSON
    const parsedResponse = JSON.parse(responseText);
    
    // Check if this is an array with the expected structure
    if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
      const firstItem = parsedResponse[0];
      
      // Check if it has an output property that contains JSON
      if (firstItem.output) {
        // Try to extract JSON from the output string
        const jsonMatch = firstItem.output.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            return JSON.parse(jsonMatch[1]);
          } catch (err) {
            console.error("Error parsing JSON inside output:", err);
          }
        }
      }
      
      return parsedResponse;
    }
    
    // If the response is a nested object with keys that look like JSON strings
    if (typeof parsedResponse === 'object' && parsedResponse !== null && !Array.isArray(parsedResponse)) {
      // Check for a key that looks like a JSON string (starting with ```json)
      const jsonKeyPattern = Object.keys(parsedResponse).find(key => key.startsWith('```json'));
      
      if (jsonKeyPattern) {
        try {
          // Extract the content between ```json and ``` markers
          const jsonText = jsonKeyPattern.match(/```json\n([\s\S]*?)$/)?.[1];
          if (jsonText) {
            return JSON.parse(jsonText);
          }
        } catch (err) {
          console.error("Error parsing JSON from key:", err);
        }
      }
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing webhook response:", error);
    throw new Error("Invalid JSON response from webhook");
  }
};
