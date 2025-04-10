
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation, NewBlogPost, NewBlogTranslation } from "@/types/blog";
import { toast } from "sonner";
import { downloadImage, parseWebhookJsonResponse, transformDatabasePost, uploadImageToStorage } from "./utils";
import { useWebhookStore } from "@/stores/webhookStore";

/**
 * Create a new blog post
 */
export const createBlogPost = async (post: NewBlogPost): Promise<BlogPost> => {
  // Always process the image to ensure it's stored in Supabase
  if (post.image) {
    try {
      console.log("Processing image for new blog post:", post.title);
      
      // First download the image if it's an external URL
      const downloadedImage = await downloadImage(post.image);
      
      if (!downloadedImage) {
        console.error("Failed to download image from URL");
        toast.error("Failed to download image from URL, using placeholder image");
        post.image = "https://via.placeholder.com/800x400";
      } else {
        // Then upload to Supabase storage
        const permanentImageUrl = await uploadImageToStorage(downloadedImage, post.title || 'blog-post');
        
        if (permanentImageUrl) {
          console.log("Image uploaded to Supabase storage:", permanentImageUrl);
          post.image = permanentImageUrl;
        } else {
          console.warn("Failed to upload image to Supabase storage");
          toast.error("Failed to save image to permanent storage, using original URL");
        }
      }
    } catch (imageError) {
      console.error("Error processing image for permanent storage:", imageError);
      toast.error("Failed to process image, but will continue with post creation");
    }
  }
  
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
    // Get the active webhook URL and method from the store
    const webhookStore = useWebhookStore.getState();
    const webhookUrl = webhookStore.getActiveBlogSocialShareUrl();
    const webhookMethod = webhookStore.getActiveBlogSocialShareMethod();
    const websiteDomain = webhookStore.getWebsiteDomain();
    
    // Format the data for the social media webhook with complete post data
    const postUrl = `${websiteDomain}/blog/${post.slug}`;
    
    // Send complete blog post data along with the formatted URL
    const webhookData = {
      ...post,
      url: postUrl,
      postUrl: postUrl, // Adding both formats for compatibility
      fullUrl: postUrl,
      websiteUrl: websiteDomain
    };
    
    console.log(`Sending post to social media webhook (${webhookUrl}) using ${webhookMethod}:`, webhookData);
    
    // Use fetch with a timeout to ensure it doesn't hang
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    
    try {
      let response;
      
      if (webhookMethod === "POST") {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: controller.signal
        });
      } else {
        // For GET requests, append params to the URL
        const params = new URLSearchParams();
        
        // Add essential fields for GET request
        params.append('title', String(webhookData.title));
        params.append('url', String(webhookData.url));
        params.append('image', String(webhookData.image));
        params.append('excerpt', String(webhookData.excerpt));
        params.append('author', String(webhookData.author));
        params.append('slug', String(webhookData.slug));
        params.append('category', String(webhookData.category));
        
        // Add tags as a string
        if (webhookData.tags && Array.isArray(webhookData.tags)) {
          params.append('tags', webhookData.tags.join(','));
        }
        
        const getUrl = `${webhookUrl}?${params.toString()}`;
        
        console.log(`Using GET request with URL: ${getUrl}`);
        
        response = await fetch(getUrl, {
          method: 'GET',
          signal: controller.signal
        });
      }
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook response error (${response.status}):`, errorText);
        toast.error(`Failed to send post to social media: ${response.statusText}`);
      } else {
        const responseText = await response.text();
        console.log("Post data sent to social media webhook successfully. Response:", responseText);
        toast.success("Post shared to social media channels");
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch error sending to webhook:", fetchError);
      if (fetchError.name === 'AbortError') {
        toast.error("Webhook request timed out");
      } else {
        toast.error(`Webhook error: ${fetchError.message}`);
      }
    }
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
  // Always process the image to ensure it's stored in Supabase
  if (updates.image) {
    try {
      console.log("Processing image for blog post update:", updates.title || id);
      
      // First download the image if it's an external URL
      const downloadedImage = await downloadImage(updates.image);
      
      if (!downloadedImage) {
        console.error("Failed to download image from URL");
        toast.error("Failed to download image, using original URL");
      } else {
        // Then upload to Supabase storage
        const permanentImageUrl = await uploadImageToStorage(downloadedImage, updates.title || id);
        
        if (permanentImageUrl) {
          console.log("Image uploaded to Supabase storage:", permanentImageUrl);
          updates.image = permanentImageUrl;
        } else {
          console.warn("Failed to upload image to Supabase storage");
          toast.error("Failed to save image to permanent storage, using original URL");
        }
      }
    } catch (imageError) {
      console.error("Error processing image for permanent storage:", imageError);
      toast.error("Failed to process image, but will continue with post update");
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
    // Get the active webhook URL and method from the store
    const webhookStore = useWebhookStore.getState();
    const webhookUrl = webhookStore.getActiveBlogCreationUrl();
    const webhookMethod = webhookStore.getActiveBlogCreationMethod();
    
    const formattedData = formatPostForN8N(blogPostData);
    console.log(`Sending post to blog creation webhook (${webhookUrl}) using ${webhookMethod}:`, formattedData);
    
    // Use fetch with a timeout to ensure it doesn't hang
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout for longer operations
    
    try {
      let response;
      
      if (webhookMethod === "POST") {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
          signal: controller.signal
        });
      } else {
        // For GET requests, append params to the URL
        const params = new URLSearchParams();
        Object.entries(formattedData).forEach(([key, value]) => {
          // Handle arrays and objects
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, String(value));
          }
        });
        const getUrl = `${webhookUrl}?${params.toString()}`;
        
        response = await fetch(getUrl, {
          method: 'GET',
          signal: controller.signal
        });
      }
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook response error (${response.status}):`, errorText);
        throw new Error(`Failed to send post to webhook: ${errorText}`);
      }
  
      const responseText = await response.text();
      console.log('Webhook raw response:', responseText);
      return responseText;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch error sending to webhook:", fetchError);
      if (fetchError.name === 'AbortError') {
        throw new Error("Webhook request timed out");
      }
      throw fetchError;
    }
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
    
    // Always process the image to ensure it's stored in Supabase
    if (imageUrl) {
      console.log("Processing image from webhook URL:", imageUrl);
      
      try {
        // First download the image to base64
        const imageData = await downloadImage(imageUrl);
        
        if (imageData) {
          console.log("Image downloaded successfully, now uploading to Supabase storage");
          // Then upload to Supabase storage
          const storedImageUrl = await uploadImageToStorage(
            imageData, 
            parsedContent.title || defaultTitle
          );
          
          if (storedImageUrl) {
            console.log("Image successfully stored in Supabase:", storedImageUrl);
            imageUrl = storedImageUrl;
          } else {
            console.warn("Failed to store image in Supabase, using original URL");
          }
        } else {
          console.warn("Failed to download image, using original URL");
        }
      } catch (imgError) {
        console.error("Error processing image:", imgError);
        console.warn("Using original image URL due to processing failure");
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
  console.log(`Updating blog post ${id} status to ${status}`);
  
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
    console.log("Status is 'published', sending to social media webhook");
    
    // IMPORTANT: Call the webhook function directly here to ensure it's triggered
    try {
      await sendPostToSocialMediaWebhook(transformedPost);
    } catch (webhookError) {
      console.error("Error sending to social media webhook:", webhookError);
      toast.error("Post published, but failed to share to social media");
    }
  } else {
    console.log("Status is not 'published', skipping webhook");
  }
  
  return transformedPost;
};
