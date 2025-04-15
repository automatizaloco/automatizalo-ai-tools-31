
import { NewBlogPost, BlogPost } from '@/types/blog';
import { extractBlogPostFromResponse, saveBlogPost } from './utils';
import { useWebhookStore } from '@/stores/webhookStore';

/**
 * Send post data to N8N webhook
 */
export const sendPostToN8N = async (blogPostData: NewBlogPost): Promise<string> => {
  try {
    // Get webhook URL from store or use fallback
    const webhookStore = useWebhookStore.getState();
    const webhookUrl = webhookStore.getActiveBlogCreationUrl();
    const method = webhookStore.getActiveBlogCreationMethod();
    
    console.log("Using webhook URL:", webhookUrl);
    console.log("Using method:", method);
    console.log("Sending blog post data:", blogPostData);
    
    let response;
    
    if (method === 'GET') {
      const params = new URLSearchParams();
      Object.entries(blogPostData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
      
      const urlWithParams = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}${params.toString()}`;
      console.log("Making GET request to:", urlWithParams);
      
      response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.log("Making POST request to:", webhookUrl);
      
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogPostData)
      });
    }

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status: ${response.status}`);
    }
    
    console.log("Webhook response received");
    return await response.text();
  } catch (error) {
    console.error("Error sending post to N8N:", error);
    throw error;
  }
};

/**
 * Process webhook response and save blog post
 */
export const processAndSaveWebhookResponse = async (
  responseText: string,
  originalTitle: string,
  originalSlug: string
): Promise<BlogPost> => {
  try {
    // Extract blog post data from response
    const extractedData = extractBlogPostFromResponse(responseText);
    
    if (!extractedData) {
      throw new Error("Failed to extract blog post data from webhook response");
    }
    
    console.log("Extracted blog post data:", extractedData);
    
    // Handle fields from webhook response with proper mapping
    const blogPostData: NewBlogPost = {
      title: extractedData.title || originalTitle,
      slug: extractedData.slug || originalSlug,
      excerpt: extractedData.excerpt || "Generated blog post",
      content: extractedData.content || "Content not available",
      category: extractedData.category || "Automatic",
      tags: extractedData.tags || ["automatic", "ai-generated"],
      author: extractedData.author || "AI Assistant",
      date: extractedData.date || new Date().toISOString().split('T')[0],
      // Fix: Change read_time to readTime as per our type definition
      readTime: extractedData.readTime || (extractedData as any).read_time || "5 min",
      status: 'draft',
      featured: false,
      // Use the image URL directly from the webhook response
      image: "https://via.placeholder.com/800x400" // Default placeholder, will be updated below
    };
    
    // Get image URL from the extracted data
    let imageUrl = null;
    
    // Extract image URL from response data
    if (typeof extractedData === 'object' && extractedData !== null) {
      // Check standard fields first
      if ('image' in extractedData && typeof extractedData.image === 'string') {
        imageUrl = extractedData.image;
      } 
      // Check alternate field names that might be in the response
      else if ('image_url' in extractedData && typeof extractedData.image_url === 'string') {
        imageUrl = extractedData.image_url as string;
      } 
      else if ('imageUrl' in extractedData && typeof extractedData.imageUrl === 'string') {
        imageUrl = extractedData.imageUrl as string;
      }
    }
    
    // Use the image URL directly if available
    if (imageUrl) {
      console.log("Using image URL from webhook:", imageUrl);
      blogPostData.image = imageUrl;
    } else {
      console.log("No image URL found in webhook response");
      blogPostData.image = "https://via.placeholder.com/800x400";
    }
    
    // Save blog post to database
    console.log("Saving blog post to database:", blogPostData);
    const savedPost = await saveBlogPost(blogPostData);
    
    return savedPost;
  } catch (error) {
    console.error("Error processing webhook response:", error);
    throw error;
  }
};
