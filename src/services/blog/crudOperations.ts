
import { supabase } from '@/integrations/supabase/client';
import { NewBlogPost, BlogPost } from '@/types/blog';
import { transformDatabasePost } from './transformers';

/**
 * Save a blog post to the database
 */
export const saveBlogPost = async (data: NewBlogPost): Promise<BlogPost> => {
  try {
    // Map readTime to read_time for database compatibility
    const dbData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags,
      author: data.author,
      date: data.date,
      read_time: data.readTime,
      image: data.image,
      featured: data.featured,
      status: data.status
      // Do not include url field if not in schema
    };
    
    const { data: savedPost, error } = await supabase
      .from('blog_posts')
      .insert(dbData)
      .select('*')
      .single();
    
    if (error) {
      console.error("Error saving blog post:", error);
      throw error;
    }
    
    return transformDatabasePost(savedPost);
  } catch (error) {
    console.error("Database error when saving blog post:", error);
    throw error;
  }
};

/**
 * Update a blog post in the database
 */
export const updateBlogPost = async (id: string, data: Partial<NewBlogPost>): Promise<BlogPost> => {
  // Map readTime to read_time for database compatibility
  const dbData: any = { ...data };
  
  if (data.readTime) {
    dbData.read_time = data.readTime;
    delete dbData.readTime;
  }
  
  const { data: updatedPost, error } = await supabase
    .from('blog_posts')
    .update(dbData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
  
  return transformDatabasePost(updatedPost);
};

/**
 * Delete a blog post from the database
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
    
    // Also delete any translations for this post
    const { error: translationError } = await supabase
      .from('blog_translations')
      .delete()
      .eq('blog_post_id', id);
    
    if (translationError) {
      console.error("Error deleting blog translations:", translationError);
      // Don't throw here, as the main post was already deleted
    }
    
    // Dispatch an event to notify components of the deletion
    const event = new Event('blogPostDeleted');
    window.dispatchEvent(event);
    
  } catch (error) {
    console.error("Database error when deleting blog post:", error);
    throw error;
  }
};

/**
 * Update a blog post's status (draft/published)
 */
export const updateBlogPostStatus = async (id: string, status: 'draft' | 'published'): Promise<BlogPost> => {
  const { data: updatedPost, error } = await supabase
    .from('blog_posts')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating blog post status:", error);
    throw error;
  }
  
  return transformDatabasePost(updatedPost);
};
