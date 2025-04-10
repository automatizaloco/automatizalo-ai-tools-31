
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation, NewBlogPost, NewBlogTranslation } from "@/types/blog";
import { toast } from "sonner";
import { downloadImage, parseWebhookJsonResponse, transformDatabasePost, uploadImageToStorage } from "./utils";
import { useWebhookStore } from "@/stores/webhookStore";

const createToastWithPersistence = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
  toast[type](title, { description: message });
  
  try {
    const existingToastsJson = localStorage.getItem("persistent-toasts");
    const existingToasts = existingToastsJson ? JSON.parse(existingToastsJson) : [];
    
    const newToast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: Date.now()
    };
    
    const updatedToasts = [newToast, ...existingToasts].slice(0, 50);
    localStorage.setItem("persistent-toasts", JSON.stringify(updatedToasts));
    
    // Dispatch event to notify the PersistentToastProvider
    window.dispatchEvent(new CustomEvent('persistentToastAdded', { 
      detail: newToast 
    }));
    
    console.log("Persistent toast created and saved:", newToast);
  } catch (error) {
    console.error("Failed to save persistent toast:", error);
  }
};

/**
 * Create a new blog post
 */
export const createBlogPost = async (post: NewBlogPost): Promise<BlogPost> => {
  if (post.image) {
    try {
      console.log("Processing image for new blog post:", post.title);
      createToastWithPersistence(
        "Processing Image", 
        `Downloading and uploading image for: ${post.title}`, 
        "info"
      );
      
      const downloadedImage = await downloadImage(post.image);
      
      if (!downloadedImage) {
        console.error("Failed to download image from URL");
        createToastWithPersistence(
          "Image Download Failed", 
          "Failed to download image from URL, using placeholder image", 
          "error"
        );
        post.image = "https://via.placeholder.com/800x400";
      } else {
        const permanentImageUrl = await uploadImageToStorage(downloadedImage, post.title || 'blog-post');
        
        if (permanentImageUrl) {
          console.log("Image uploaded to Supabase storage:", permanentImageUrl);
          createToastWithPersistence(
            "Image Stored", 
            "Image successfully uploaded to permanent storage", 
            "success"
          );
          post.image = permanentImageUrl;
        } else {
          console.warn("Failed to upload image to Supabase storage");
          createToastWithPersistence(
            "Storage Error", 
            "Failed to save image to permanent storage, using original URL", 
            "error"
          );
        }
      }
    } catch (imageError) {
      console.error("Error processing image for permanent storage:", imageError);
      createToastWithPersistence(
        "Image Processing Error", 
        "Failed to process image, but will continue with post creation", 
        "error"
      );
    }
  }

  // Check if a post with this slug already exists
  const { data: existingPost, error: existingError } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('slug', post.slug)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking for existing slug:", existingError);
  }

  // If post exists, make the slug unique by adding a timestamp
  if (existingPost) {
    const timestamp = new Date().getTime().toString().slice(-4);
    post.slug = `${post.slug}-${timestamp}`;
    console.log(`Post with slug already exists. Using new slug: ${post.slug}`);
    createToastWithPersistence(
      "Slug Modified", 
      `A post with this slug already exists. Using modified slug: ${post.slug}`, 
      "info"
    );
  }
  
  const dbPost = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags,
    author: post.author,
    date: post.date,
    read_time: post.readTime,
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
    createToastWithPersistence(
      "Blog Post Creation Failed", 
      `Error: ${error.message}`, 
      "error"
    );
    throw new Error(`Failed to create blog post: ${error.message}`);
  }

  console.log("Blog post created successfully, data:", data);
  createToastWithPersistence(
    "Blog Post Created", 
    "Your blog post was created successfully", 
    "success"
  );
  return transformDatabasePost(data);
};

/**
 * Send post data to social media webhook
 */
export const sendPostToSocialMediaWebhook = async (post: BlogPost): Promise<void> => {
  try {
    const webhookStore = useWebhookStore.getState();
    const webhookUrl = webhookStore.getActiveBlogSocialShareUrl();
    const webhookMethod = webhookStore.getActiveBlogSocialShareMethod();
    const websiteDomain = webhookStore.getWebsiteDomain();
    
    const postUrl = `${websiteDomain}/blog/${post.slug}`;
    
    const webhookData = {
      ...post,
      url: postUrl,
      postUrl: postUrl,
      fullUrl: postUrl,
      websiteUrl: websiteDomain,
      // Ensure we're sending complete content
      content: post.content,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image, // This should already be the permanent image URL
      author: post.author,
      category: post.category,
      tags: post.tags,
      slug: post.slug
    };
    
    console.log(`Sending post to social media webhook (${webhookUrl}) using ${webhookMethod}:`, webhookData);
    createToastWithPersistence(
      "Sharing to Social Media", 
      "Sending post to social media channels...", 
      "info"
    );
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
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
        const params = new URLSearchParams();
        
        // Ensure all essential fields are included
        params.append('title', String(webhookData.title));
        params.append('url', String(webhookData.url));
        params.append('image', String(webhookData.image));
        params.append('excerpt', String(webhookData.excerpt));
        params.append('content', String(webhookData.content));
        params.append('author', String(webhookData.author));
        params.append('slug', String(webhookData.slug));
        params.append('category', String(webhookData.category));
        
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
        createToastWithPersistence(
          "Social Media Sharing Failed", 
          `Status: ${response.status} - ${response.statusText}`, 
          "error"
        );
      } else {
        const responseText = await response.text();
        console.log("Post data sent to social media webhook successfully. Response:", responseText);
        createToastWithPersistence(
          "Shared Successfully", 
          "Post has been shared to social media channels", 
          "success"
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch error sending to webhook:", fetchError);
      if (fetchError.name === 'AbortError') {
        createToastWithPersistence("Webhook Timeout", "Social media webhook request timed out", "error");
      } else {
        createToastWithPersistence("Webhook Error", `Error: ${fetchError.message}`, "error");
      }
    }
  } catch (error) {
    console.error("Error sending post to social media webhook:", error);
    createToastWithPersistence(
      "Social Media Error", 
      `Failed to share post: ${error instanceof Error ? error.message : String(error)}`, 
      "error"
    );
  }
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  id: string, 
  updates: Partial<BlogPost>
): Promise<BlogPost> => {
  if (updates.image) {
    try {
      console.log("Processing image for blog post update:", updates.title || id);
      createToastWithPersistence(
        "Processing Image", 
        `Downloading and uploading image for: ${updates.title || id}`, 
        "info"
      );
      
      const downloadedImage = await downloadImage(updates.image);
      
      if (!downloadedImage) {
        console.error("Failed to download image from URL");
        createToastWithPersistence(
          "Image Download Failed", 
          "Failed to download image, using original URL", 
          "error"
        );
      } else {
        const permanentImageUrl = await uploadImageToStorage(downloadedImage, updates.title || id);
        
        if (permanentImageUrl) {
          console.log("Image uploaded to Supabase storage:", permanentImageUrl);
          createToastWithPersistence(
            "Image Stored", 
            "Image successfully uploaded to permanent storage", 
            "success"
          );
          updates.image = permanentImageUrl;
        } else {
          console.warn("Failed to upload image to Supabase storage");
          createToastWithPersistence(
            "Storage Error", 
            "Failed to save image to permanent storage, using original URL", 
            "error"
          );
        }
      }
    } catch (imageError) {
      console.error("Error processing image for permanent storage:", imageError);
      createToastWithPersistence(
        "Image Processing Error", 
        "Failed to process image, but will continue with post update", 
        "error"
      );
    }
  }
  
  const dbUpdates = {
    ...updates
  } as any;
  
  if (updates.readTime !== undefined) {
    dbUpdates.read_time = updates.readTime;
    delete dbUpdates.readTime;
  }
  
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
    createToastWithPersistence(
      "Blog Post Update Failed", 
      `Error: ${error.message}`, 
      "error"
    );
    throw new Error(`Failed to update blog post: ${error.message}`);
  }

  toast.success("Blog post updated successfully");
  
  window.dispatchEvent(new CustomEvent('blogPostUpdated', { detail: data }));
  
  const transformedPost = transformDatabasePost(data);
  
  if (transformedPost.status === 'published') {
    console.log("Status is 'published', sending to social media webhook");
    try {
      await sendPostToSocialMediaWebhook(transformedPost);
    } catch (webhookError) {
      console.error("Error sending to social media webhook:", webhookError);
      createToastWithPersistence(
        "Webhook Error", 
        "Post published, but failed to share to social media", 
        "error"
      );
    }
  } else {
    console.log("Status is not 'published', skipping webhook");
  }
  
  return transformedPost;
};

/**
 * Delete a blog post and its translations
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error: translationsError } = await supabase
    .from('blog_translations')
    .delete()
    .eq('blog_post_id', id);

  if (translationsError) {
    console.error(`Error deleting translations for blog post ${id}:`, translationsError);
    createToastWithPersistence(
      "Translation Deletion Failed", 
      `Failed to delete blog post translations: ${translationsError.message}`, 
      "error"
    );
    throw new Error(`Failed to delete blog post translations: ${translationsError.message}`);
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting blog post ${id}:`, error);
    createToastWithPersistence(
      "Blog Post Deletion Failed", 
      `Failed to delete blog post: ${error.message}`, 
      "error"
    );
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }

  toast.success("Blog post deleted successfully");
  
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
    url: (post as any).url || ""
  };
};

/**
 * Sends a blog post to the n8n webhook for automatic generation
 * and returns the response from the webhook
 */
export const sendPostToN8N = async (blogPostData: BlogPost | NewBlogPost) => {
  try {
    const webhookStore = useWebhookStore.getState();
    const webhookUrl = webhookStore.getActiveBlogCreationUrl();
    const webhookMethod = webhookStore.getActiveBlogCreationMethod();
    
    const formattedData = formatPostForN8N(blogPostData);
    console.log(`Sending post to blog creation webhook (${webhookUrl}) using ${webhookMethod}:`, formattedData);
    createToastWithPersistence(
      "Sending to N8N", 
      "Sending post to N8N webhook...", 
      "info"
    );
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
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
        const params = new URLSearchParams();
        Object.entries(formattedData).forEach(([key, value]) => {
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
  createToastWithPersistence(
    "Processing Response", 
    "Analyzing webhook response data...", 
    "info"
  );
  
  try {
    // Parse the response to extract content
    const parsedContent = parseWebhookJsonResponse(response);
    console.log("Parsed content from webhook:", parsedContent);
    
    if (!parsedContent) {
      throw new Error("Failed to parse content from webhook response");
    }
    
    // Enhanced image URL extraction with more priority to image_url
    let imageUrl = parsedContent.image_url || 
                  parsedContent.imageUrl || 
                  parsedContent.image || 
                  null;
    
    console.log("Initial image URL extraction:", imageUrl);
    
    // If still no image found, look in nested data structures
    if (!imageUrl) {
      if (parsedContent.data && Array.isArray(parsedContent.data) && parsedContent.data.length > 0) {
        imageUrl = parsedContent.data[0].url || 
                parsedContent.data[0].image_url || 
                parsedContent.data[0].imageUrl || 
                parsedContent.data[0].image;
      }
    }
    
    // Look for URLs in output field content
    if (!imageUrl && parsedContent.output) {
      try {
        // First try to find JSON in output
        const jsonMatch = parsedContent.output.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedData = JSON.parse(jsonMatch[1]);
          imageUrl = extractedData.image || extractedData.image_url || extractedData.imageUrl;
        }
        
        // If still no image, look for URLs directly in the output
        if (!imageUrl) {
          const urlMatch = parsedContent.output.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i);
          if (urlMatch) {
            imageUrl = urlMatch[0];
          }
        }
      } catch (err) {
        console.error("Error parsing JSON in output:", err);
      }
    }
    
    // Deep search in nested objects
    if (!imageUrl) {
      const searchForUrl = (obj: any): string | null => {
        if (!obj || typeof obj !== 'object') return null;
        
        for (const key in obj) {
          // Check if the key is related to an image and the value is a string URL
          if (typeof obj[key] === 'string' && 
              (key.includes('image') || key.includes('url')) && 
              obj[key].match(/^https?:\/\//)) {
            return obj[key];
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            const nestedUrl = searchForUrl(obj[key]);
            if (nestedUrl) return nestedUrl;
          }
        }
        return null;
      };
      
      imageUrl = searchForUrl(parsedContent);
    }
    
    // Fallback to placeholder if no image found
    if (!imageUrl) {
      imageUrl = "https://via.placeholder.com/800x400";
      console.log("No image URL found, using placeholder");
    } else {
      console.log("Final image URL extracted:", imageUrl);
      createToastWithPersistence(
        "Image Found", 
        "Found image URL in webhook response", 
        "info"
      );
    }
    
    // Process and store the image
    if (imageUrl && imageUrl !== "https://via.placeholder.com/800x400") {
      console.log("Processing image from webhook URL:", imageUrl);
      createToastWithPersistence(
        "Processing Image", 
        "Downloading and storing image from webhook...", 
        "info"
      );
      
      try {
        const imageData = await downloadImage(imageUrl);
        
        if (imageData) {
          console.log("Image downloaded successfully, now uploading to Supabase storage");
          createToastWithPersistence(
            "Image Downloaded", 
            "Image downloaded successfully, now uploading to storage", 
            "info"
          );
          
          const storedImageUrl = await uploadImageToStorage(
            imageData, 
            parsedContent.title || defaultTitle
          );
          
          if (storedImageUrl) {
            console.log("Image successfully stored in Supabase:", storedImageUrl);
            createToastWithPersistence(
              "Image Stored", 
              "Image successfully uploaded to permanent storage", 
              "success"
            );
            imageUrl = storedImageUrl;
          } else {
            console.warn("Failed to store image in Supabase, using original URL");
            createToastWithPersistence(
              "Storage Failed", 
              "Could not store image, using original URL", 
              "warning"
            );
          }
        } else {
          console.warn("Failed to download image, using original URL");
          createToastWithPersistence(
            "Image Download Failed", 
            "Failed to download image, using original URL", 
            "warning"
          );
        }
      } catch (imgError) {
        console.error("Error processing image:", imgError);
        createToastWithPersistence(
          "Image Processing Error", 
          `Error processing image from webhook: ${imgError instanceof Error ? imgError.message : String(imgError)}`, 
          "error"
        );
      }
    }
    
    // Create the blog post with all the extracted data
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
    
    const savedPost = await createBlogPost(newBlogPost);
    console.log("Blog post saved successfully:", savedPost);
    createToastWithPersistence(
      "Blog Created From Webhook", 
      "Successfully created blog post from webhook data", 
      "success"
    );
    
    return savedPost;
  } catch (error) {
    console.error("Error processing webhook response:", error);
    createToastWithPersistence(
      "Webhook Processing Error", 
      `Error: ${error instanceof Error ? error.message : String(error)}`, 
      "error"
    );
    throw new Error(`Failed to process webhook response: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Change blog post status
 */
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
    createToastWithPersistence(
      "Blog Post Status Update Failed", 
      `Error: ${error.message}`, 
      "error"
    );
    throw new Error(`Failed to update blog post status: ${error.message}`);
  }

  toast.success(`Blog post ${status === 'published' ? 'published' : 'moved to draft'} successfully`);
  
  window.dispatchEvent(new CustomEvent('blogPostUpdated', { detail: data }));
  
  const transformedPost = transformDatabasePost(data);
  
  if (status === 'published') {
    console.log("Status is 'published', sending to social media webhook");
    try {
      await sendPostToSocialMediaWebhook(transformedPost);
    } catch (webhookError) {
      console.error("Error sending to social media webhook:", webhookError);
      createToastWithPersistence(
        "Webhook Error", 
        "Post published, but failed to share to social media", 
        "error"
      );
    }
  } else {
    console.log("Status is not 'published', skipping webhook");
  }
  
  return transformedPost;
};
