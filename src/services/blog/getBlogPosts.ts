
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { transformDatabasePost } from "./utils";

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_translations (
        language,
        title,
        excerpt,
        content
      )
    `);

  if (error) throw error;
  return posts.map(transformDatabasePost);
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_translations (
        language,
        title,
        excerpt,
        content
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!post) return undefined;
  
  return transformDatabasePost(post);
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_translations (
        language,
        title,
        excerpt,
        content
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  if (!post) return undefined;

  return transformDatabasePost(post);
};

// Get featured posts
export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_translations (
        language,
        title,
        excerpt,
        content
      )
    `)
    .eq('featured', true)
    .limit(3);

  if (error) throw error;
  return posts.map(transformDatabasePost);
};

// Get posts by category
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_translations (
        language,
        title,
        excerpt,
        content
      )
    `)
    .eq('category', category);

  if (error) throw error;
  return posts.map(transformDatabasePost);
};

// Search posts
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_translations (
        language,
        title,
        excerpt,
        content
      )
    `)
    .or(`title.ilike.%${query}%, content.ilike.%${query}%, excerpt.ilike.%${query}%`);

  if (error) throw error;
  return posts.map(transformDatabasePost);
};
