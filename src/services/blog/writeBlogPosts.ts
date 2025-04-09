
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation, NewBlogPost, NewBlogTranslation } from "@/types/blog";
import { toast } from "sonner";
import { downloadImage, parseWebhookJsonResponse, transformDatabasePost, uploadImageToStorage } from "./utils";

/**
 * Create a new blog post
 */
export const createBlogPost = async (post: NewBlogPost): Promise<BlogPost> => {
  // Map the blog post object to match the database schema
  const dbPost = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags,
    author: post.author,
    date: post.date,
    read_time: post.readTime, // Map readTime to read_time for database
    image: post.image,
    featured: post.featured,
    status: post.status || 'published'
  };
  
  console.log("Creating blog post with data:", dbPost);
  
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

  console.log("Blog post created successfully, data:", data);
  toast.success("Blog post created successfully");
  return transformDatabasePost(data);
};

/**
 * Send post data to social media webhook
 */
export const sendPostToSocialMediaWebhook = async (post: BlogPost): Promise<void> => {
  try {
    // Format the data for the social media webhook
    const webhookData = {
      title: post.title,
      url: `${window.location.origin}/blog/${post.slug}`,
      image: post.image
    };
    
    console.log("Sending post to social media webhook:", webhookData);
    
    await fetch('https://n8n.automatizalo.co/webhook/blog-redes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    console.log("Post data sent to social media webhook successfully");
  } catch (error) {
    console.error("Error sending post to social media webhook:", error);
    // Don't throw error, just log it - we don't want to fail the update if webhook fails
  }
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  id: string, 
  updates: Partial<BlogPost>
): Promise<BlogPost> => {
  // If the image URL is temporary (from webhook), upload it to permanent storage
  if (updates.image && (
      updates.image.includes('ideogram.ai') || 
      updates.image.includes('ephemeral') || 
      updates.image.startsWith('data:image/')
    )) {
    try {
      console.log("Detected temporary image URL, uploading to permanent storage:", updates.image.substring(0, 50) + "...");
      const permanentImageUrl = await uploadImageToStorage(updates.image, updates.title || id);
      
      if (permanentImageUrl) {
        console.log("Image uploaded to permanent storage:", permanentImageUrl);
        updates.image = permanentImageUrl;
      } else {
        console.warn("Failed to upload image to permanent storage, keeping original URL");
      }
    } catch (imageError) {
      console.error("Error processing image for permanent storage:", imageError);
      toast.error("Failed to save image to permanent storage, but will continue with post update");
    }
  }
  
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
  
  // Get the complete post data to send to the social media webhook
  const transformedPost = transformDatabasePost(data);
  
  // Send post data to social media webhook after successful update
  // Only send if the post is published
  if (transformedPost.status === 'published') {
    await sendPostToSocialMediaWebhook(transformedPost);
  }
  
  return transformedPost;
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
    console.log("Sending post to n8n webhook:", formatPostForN8N(blogPostData));
    
    // Updated to use the production webhook URL
    const response = await fetch('https://n8n.automatizalo.co/webhook/admin/blog/create', {
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

    const responseText = await response.text();
    console.log('Webhook raw response:', responseText);
    return responseText;
  } catch (error) {
    console.error('Error sending post to webhook:', error);
    throw error;
  }
};

/**
 * Process and save blog post from N8N webhook response
 */
export const processAndSaveWebhookResponse = async (response: any, defaultTitle: string, defaultSlug: string): Promise<BlogPost> => {
  console.log("Processing webhook response:", response);
  
  try {
    // Parse the response using our enhanced utility function
    const parsedContent = parseWebhookJsonResponse(response);
    console.log("Parsed content from webhook:", parsedContent);
    
    if (!parsedContent) {
      throw new Error("Failed to parse content from webhook response");
    }
    
    // Get image URL from the parsed content or set a placeholder
    let imageUrl = parsedContent.image || parsedContent.image_url || "https://via.placeholder.com/800x400";
    console.log("Image URL extracted:", imageUrl);
    
    // Download the image if it has a URL (not a placeholder)
    let imageData = null;
    if (imageUrl && !imageUrl.includes("placeholder.com")) {
      console.log("Attempting to download image from:", imageUrl);
      try {
        imageData = await downloadImage(imageUrl);
        
        if (imageData) {
          console.log("Image successfully downloaded and converted to base64");
          imageUrl = imageData;
        } else {
          console.warn("Failed to download image, using original URL", imageUrl);
        }
      } catch (imgError) {
        console.error("Error downloading image:", imgError);
        console.warn("Using original image URL due to download failure");
      }
    }
    
    // Create a new blog post with the generated content as a draft
    const newBlogPost: NewBlogPost = {
      title: parsedContent.title || defaultTitle,
      slug: parsedContent.slug || defaultSlug,
      excerpt: parsedContent.excerpt || "Auto-generated blog post",
      content: parsedContent.content || "",
      category: parsedContent.category || "Automatic",
      tags: parsedContent.tags || ["automatic", "ai-generated"],
      author: parsedContent.author || "AI Assistant",
      date: parsedContent.date || new Date().toISOString().split('T')[0],
      readTime: parsedContent.readTime || parsedContent.read_time || "3 min",
      image: imageUrl,
      featured: false,
      status: 'draft' as const
    };
    
    console.log("Creating new blog post with data:", newBlogPost);
    
    // Save the new blog post to the database
    const savedPost = await createBlogPost(newBlogPost);
    console.log("Blog post saved successfully:", savedPost);
    
    return savedPost;
  } catch (error) {
    console.error("Error processing webhook response:", error);
    throw new Error(`Failed to process webhook response: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Add a function to change blog post status
export const updateBlogPostStatus = async (id: string, status: 'draft' | 'published'): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating blog post status ${id}:`, error);
    toast.error(`Failed to update blog post status: ${error.message}`);
    throw new Error(`Failed to update blog post status: ${error.message}`);
  }

  toast.success(`Blog post ${status === 'published' ? 'published' : 'moved to draft'} successfully`);
  
  // Dispatch event to notify other components that blog data has changed
  window.dispatchEvent(new CustomEvent('blogPostUpdated', { detail: data }));
  
  const transformedPost = transformDatabasePost(data);
  
  // Send post data to social media webhook if changing to published status
  if (status === 'published') {
    await sendPostToSocialMediaWebhook(transformedPost);
  }
  
  return transformedPost;
};
