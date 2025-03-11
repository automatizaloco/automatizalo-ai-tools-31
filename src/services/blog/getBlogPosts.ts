
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation } from "@/types/blog";

/**
 * Fetch all blog posts from the database
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetch a single blog post by ID
 */
export const fetchBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data;
};

/**
 * Fetch a single blog post by slug
 */
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data;
};

/**
 * Fetch all blog post translations for a specific post
 */
export const fetchBlogTranslations = async (postId: string): Promise<BlogTranslation[]> => {
  const { data, error } = await supabase
    .from('blog_translations')
    .select('*')
    .eq('blog_post_id', postId);

  if (error) {
    console.error(`Error fetching translations for post ${postId}:`, error);
    throw new Error(`Failed to fetch blog translations: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetch a specific translation by post ID and language
 */
export const fetchBlogTranslation = async (
  postId: string, 
  language: string
): Promise<BlogTranslation | null> => {
  const { data, error } = await supabase
    .from('blog_translations')
    .select('*')
    .eq('blog_post_id', postId)
    .eq('language', language)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching ${language} translation for post ${postId}:`, error);
    throw new Error(`Failed to fetch blog translation: ${error.message}`);
  }

  return data;
};

/**
 * Fetch featured blog posts
 */
export const fetchFeaturedBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('featured', true)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching featured blog posts:", error);
    throw new Error(`Failed to fetch featured blog posts: ${error.message}`);
  }

  return data || [];
};
