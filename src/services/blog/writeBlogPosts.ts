
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation, NewBlogPost, NewBlogTranslation } from "@/types/blog";
import { toast } from "sonner";

/**
 * Create a new blog post
 */
export const createBlogPost = async (post: NewBlogPost): Promise<BlogPost> => {
  // Map readTime to read_time for database consistency
  const dbPost = {
    ...post,
    read_time: post.readTime
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
  return {
    ...data,
    readTime: data.read_time
  } as BlogPost;
};

/**
 * Create a new blog post translation
 */
export const createBlogTranslation = async (
  translation: NewBlogTranslation
): Promise<BlogTranslation> => {
  const { data, error } = await supabase
    .from('blog_translations')
    .insert(translation)
    .select()
    .single();

  if (error) {
    console.error("Error creating blog translation:", error);
    toast.error(`Failed to create translation: ${error.message}`);
    throw new Error(`Failed to create blog translation: ${error.message}`);
  }

  toast.success(`Translation for "${translation.language}" created successfully`);
  return data;
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
  
  return {
    ...data,
    readTime: data.read_time
  } as BlogPost;
};

/**
 * Update an existing blog translation
 */
export const updateBlogTranslation = async (
  id: string,
  updates: Partial<BlogTranslation>
): Promise<BlogTranslation> => {
  const { data, error } = await supabase
    .from('blog_translations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating blog translation ${id}:`, error);
    toast.error(`Failed to update translation: ${error.message}`);
    throw new Error(`Failed to update blog translation: ${error.message}`);
  }

  toast.success(`Translation updated successfully`);
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('blogTranslationUpdated', { detail: data }));
  
  return data;
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
 * Delete a specific blog translation
 */
export const deleteBlogTranslation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_translations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting blog translation ${id}:`, error);
    toast.error(`Failed to delete translation: ${error.message}`);
    throw new Error(`Failed to delete blog translation: ${error.message}`);
  }

  toast.success("Translation deleted successfully");
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('blogTranslationDeleted', { detail: { id } }));
};

// Add aliases for compatibility
export const createBlogTranslations = createBlogTranslation;
