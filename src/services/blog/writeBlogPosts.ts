
import { NewBlogPost, BlogPost } from '@/types/blog';
import { extractBlogPostFromResponse, processImage, saveBlogPost } from './utils';
import { useWebhookStore } from '@/stores/webhookStore';

/**
 * Send post data to N8N webhook
 */
export const sendPostToN8N = async (blogPostData: NewBlogPost): Promise<string> => {
  try {
    // Get webhook URL from store or use fallback
    const webhookUrl = useWebhookStore.getState().getActiveBlogCreationUrl() || 
      'https://automatizalo-n8n.automatizalo.co/webhook/blog-creation';

    console.log("Using webhook URL:", webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blogPostData)
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status: ${response.status}`);
    }

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
      // Don't include url field if not supported by the database
      image: "https://via.placeholder.com/800x400" // Default placeholder, will be updated below
    };
    
    // Process image if present
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
    
    if (imageUrl) {
      console.log("Processing Image");
      console.log("Downloading and storing image from webhook...");
      try {
        const processedImageUrl = await processImage(imageUrl, blogPostData.title);
        blogPostData.image = processedImageUrl;
      } catch (imageError) {
        console.error("Image Processing Failed:", imageError);
        console.error("Using direct image URL instead");
        blogPostData.image = imageUrl;
      }
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
