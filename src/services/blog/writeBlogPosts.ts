
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation, NewBlogPost, NewBlogTranslation } from "@/types/blog";
import { toast } from "sonner";
import { downloadImage, transformDatabasePost } from "./utils";

/**
 * Create a new blog post
 */
export const createBlogPost = async (post: NewBlogPost): Promise<BlogPost> => {
  // Map readTime to read_time for database consistency
  const dbPost = {
    ...post,
    read_time: post.readTime,
    status: post.status || 'published'
  };
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(dbPost)
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    toast.error(`Failed to create blog post: ${error.message}`);
    throw new Error(`Failed to create blog post: ${error.message}`);
  }

  toast.success("Blog post created successfully");
  return transformDatabasePost(data);
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  id: string, 
  updates: Partial<BlogPost>
): Promise<BlogPost> => {
  // Map readTime to read_time for database consistency
  const dbUpdates = {
    ...updates
  } as any;
  
  if (updates.readTime !== undefined) {
    dbUpdates.read_time = updates.readTime;
    delete dbUpdates.readTime;
  }
  
  // Remove translations from updates as they are handled separately
  if (dbUpdates.translations) {
    delete dbUpdates.translations;
  }
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating blog post ${id}:`, error);
    toast.error(`Failed to update blog post: ${error.message}`);
    throw new Error(`Failed to update blog post: ${error.message}`);
  }

  toast.success("Blog post updated successfully");
  
  // Dispatch event to notify other components that blog data has changed
  window.dispatchEvent(new CustomEvent('blogPostUpdated', { detail: data }));
  
  return transformDatabasePost(data);
};

/**
 * Delete a blog post and its translations
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  // First delete all translations (they have a foreign key constraint)
  const { error: translationsError } = await supabase
    .from('blog_translations')
    .delete()
    .eq('blog_post_id', id);

  if (translationsError) {
    console.error(`Error deleting translations for blog post ${id}:`, translationsError);
    toast.error(`Failed to delete blog post translations: ${translationsError.message}`);
    throw new Error(`Failed to delete blog post translations: ${translationsError.message}`);
  }

  // Then delete the blog post
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting blog post ${id}:`, error);
    toast.error(`Failed to delete blog post: ${error.message}`);
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }

  toast.success("Blog post deleted successfully");
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('blogPostDeleted', { detail: { id } }));
};

/**
 * Helper function to format a blog post for N8N webhook
 */
export const formatPostForN8N = (post: BlogPost | NewBlogPost): any => {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
    featured: post.featured,
    translations: post.translations,
    url: (post as any).url || "" // Add the url field for source reference
  };
};

/**
 * Sends a blog post to the n8n webhook for automatic generation
 * and returns the response from the webhook
 */
export const sendPostToN8N = async (blogPostData: BlogPost | NewBlogPost) => {
  try {
    const response = await fetch('https://n8n.automatizalo.co/webhook-test/admin/blog/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formatPostForN8N(blogPostData)),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send post to webhook: ${errorText}`);
    }

    const result = await response.json();
    console.log('Webhook response:', result);
    return result;
  } catch (error) {
    console.error('Error sending post to webhook:', error);
    throw error;
  }
};

/**
 * Process and save blog post from N8N webhook response
 */
export const processAndSaveWebhookResponse = async (response: any, defaultTitle: string, defaultSlug: string): Promise<BlogPost> => {
  console.log("Received webhook response to process:", response);
  
  // First check if the response is valid
  if (!response) {
    console.error("Invalid webhook response: response is null or undefined");
    throw new Error("Invalid webhook response format");
  }
  
  // Handle array response format
  if (Array.isArray(response) && response.length > 0) {
    console.log("Processing array response format");
    const responseItem = response[0];
    
    if (!responseItem.output) {
      console.error("No output found in webhook response", responseItem);
      throw new Error("No output found in webhook response");
    }
    
    try {
      // Extract the JSON content from the output string (which contains a markdown code block)
      const jsonMatch = responseItem.output.match(/```json\n([\s\S]*?)\n```/);
      
      if (!jsonMatch || !jsonMatch[1]) {
        console.error("Could not extract JSON content from webhook response", responseItem.output);
        throw new Error("Could not extract JSON content from webhook response");
      }
      
      const jsonContent = jsonMatch[1].trim();
      console.log("Extracted JSON content:", jsonContent);
      
      // Parse the JSON content
      const generatedContent = JSON.parse(jsonContent);
      console.log("Parsed generated content:", generatedContent);
      
      // Handle image URL from response data
      let imageUrl = "https://via.placeholder.com/800x400";
      let imageData = null;
      
      // Check if there's an image URL in the response
      if (responseItem.data && Array.isArray(responseItem.data) && 
          responseItem.data.length > 0 && responseItem.data[0].url) {
        const tempImageUrl = responseItem.data[0].url;
        console.log("Temporary image URL found:", tempImageUrl);
        
        // Download the image and convert to base64
        imageData = await downloadImage(tempImageUrl);
        
        if (imageData) {
          console.log("Image successfully downloaded and converted to base64");
          imageUrl = imageData; // Use the base64 data as the image URL
        } else {
          console.warn("Failed to download image, using placeholder");
        }
      }
      
      // Create a new blog post with the generated content as a draft
      const newBlogPost: NewBlogPost = {
        title: generatedContent.title || defaultTitle,
        slug: generatedContent.slug || defaultSlug,
        excerpt: generatedContent.excerpt || "Auto-generated blog post",
        content: generatedContent.content || "",
        category: generatedContent.category || "Automatic",
        tags: generatedContent.tags || ["automatic", "ai-generated"],
        author: generatedContent.author || "AI Assistant",
        date: generatedContent.date || new Date().toISOString().split('T')[0],
        readTime: generatedContent.read_time || "3 min",
        image: imageUrl, // Use the downloaded image or placeholder
        featured: false,
        status: 'draft' as const
      };
      
      console.log("Creating new blog post with data:", newBlogPost);
      
      // Save the new blog post to the database
      const savedPost = await createBlogPost(newBlogPost);
      return savedPost;
    } catch (error) {
      console.error("Error processing webhook response:", error);
      throw new Error(`Failed to process webhook response: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // If response is not an array, try to process it directly
    console.error("Invalid webhook response format, not an array:", response);
    throw new Error("Invalid webhook response format");
  }
};

// Add a function to change blog post status
export const updateBlogPostStatus = async (id: string, status: 'draft' | 'published'): Promise<BlogPost> => {
  return await updateBlogPost(id, { status });
};
