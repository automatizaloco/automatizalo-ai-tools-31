
import { NewBlogPost, BlogPost } from '@/types/blog';
import { extractBlogPostFromResponse, processImage, saveBlogPost } from './utils';

/**
 * Send post data to N8N webhook
 */
export const sendPostToN8N = async (blogPostData: NewBlogPost): Promise<string> => {
  try {
    const response = await fetch('https://automatizalo-n8n.automatizalo.co/webhook/blog-creation', {
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
    
    // Prepare blog post data
    const blogPostData: NewBlogPost = {
      title: extractedData.title || originalTitle,
      slug: extractedData.slug || originalSlug,
      excerpt: extractedData.excerpt || "Generated blog post",
      content: extractedData.content || "Content not available",
      category: extractedData.category || "Automatic",
      tags: extractedData.tags || ["automatic", "ai-generated"],
      author: extractedData.author || "AI Assistant",
      date: extractedData.date || new Date().toISOString().split('T')[0],
      readTime: extractedData.readTime || extractedData.read_time || "5 min",
      status: 'draft',
      featured: false,
      url: extractedData.url || "",
    };
    
    // Process image if present
    let imageUrl = extractedData.image || extractedData.image_url || extractedData.imageUrl;
    
    if (imageUrl) {
      console.log("Processing Image");
      console.log("Downloading and storing image from webhook...");
      try {
        const processedImageUrl = await processImage(imageUrl, blogPostData.title);
        blogPostData.image = processedImageUrl;
      } catch (imageError) {
        console.error("Image Download Failed");
        console.error("Failed to download image, using original URL");
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
