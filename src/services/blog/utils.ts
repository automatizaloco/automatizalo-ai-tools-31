
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

// Enhanced parse webhook JSON response function to better handle the AI-generated content
export const parseWebhookJsonResponse = (responseText: string): any => {
  try {
    console.log("Parsing webhook response text:", responseText);
    
    // First, try to parse the response as regular JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
      console.log("Initially parsed response:", parsedResponse);
    } catch (err) {
      console.error("Error parsing response as JSON:", err);
      // If it's not valid JSON but a string, try to check if it's a stringified JSON
      if (typeof responseText === 'string' && responseText.startsWith('[') && responseText.endsWith(']')) {
        try {
          parsedResponse = JSON.parse(responseText);
          console.log("Parsed string as JSON array:", parsedResponse);
        } catch (nestedErr) {
          console.error("Failed to parse string as JSON array:", nestedErr);
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Invalid JSON response");
      }
    }
    
    // Check if this is an array with the expected structure from the webhook
    if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
      const firstItem = parsedResponse[0];
      console.log("Processing first item in array:", firstItem);
      
      // Extract content from output (which contains a JSON string inside markdown code block)
      if (firstItem && firstItem.output) {
        // Try to extract JSON from markdown code block
        const jsonMatch = firstItem.output.match(/```json\n([\s\S]*?)\n```/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const extractedContent = JSON.parse(jsonMatch[1]);
            console.log("Successfully extracted content from output:", extractedContent);
            
            // Add image URL from the data property if available
            if (firstItem.data && Array.isArray(firstItem.data) && firstItem.data.length > 0) {
              if (firstItem.data[0].url) {
                extractedContent.image = firstItem.data[0].url;
                console.log("Added image URL to content:", extractedContent.image);
              }
            }
            
            return extractedContent;
          } catch (err) {
            console.error("Error parsing JSON inside output:", err);
          }
        } else {
          console.warn("No JSON code block found in output");
        }
      }
      
      // If we couldn't extract from output, return the raw response
      return parsedResponse;
    }
    
    // If the response is a nested object with keys that look like JSON strings
    if (typeof parsedResponse === 'object' && parsedResponse !== null && !Array.isArray(parsedResponse)) {
      // Check for a key that looks like a JSON string (starting with ```json)
      const jsonKeyPattern = Object.keys(parsedResponse).find(key => key.includes('```json'));
      
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
