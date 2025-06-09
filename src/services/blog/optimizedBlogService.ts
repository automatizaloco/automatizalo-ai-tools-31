
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation } from "@/types/blog";
import { transformDatabasePost } from "./utils";

/**
 * Optimized function to fetch all blog posts with translations in a single query
 */
export const fetchOptimizedBlogPosts = async (): Promise<BlogPost[]> => {
  // Single query to get posts with all translations joined
  const { data: postsWithTranslations, error } = await supabase
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
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  // Transform and organize the data efficiently
  const posts = (postsWithTranslations || []).map(post => {
    const transformedPost = transformDatabasePost(post);
    
    // Process translations if they exist
    if (post.blog_translations && post.blog_translations.length > 0) {
      transformedPost.translations = {};
      
      post.blog_translations.forEach((translation: any) => {
        if (translation.language === 'fr' || translation.language === 'es') {
          transformedPost.translations![translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content
          };
        }
      });
    }
    
    return transformedPost;
  });

  return posts;
};

/**
 * Optimized function to fetch a single blog post by slug with translations
 */
export const fetchOptimizedBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
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
    .maybeSingle();

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  if (!data) return null;
  
  const post = transformDatabasePost(data);

  // Process translations efficiently
  if (data.blog_translations && data.blog_translations.length > 0) {
    post.translations = {};
    
    data.blog_translations.forEach((translation: any) => {
      if (translation.language === 'fr' || translation.language === 'es') {
        post.translations![translation.language] = {
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content
        };
      }
    });
  }

  return post;
};

/**
 * Get featured posts efficiently
 */
export const fetchOptimizedFeaturedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
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
    .order('date', { ascending: false })
    .limit(6); // Limit to improve performance

  if (error) {
    console.error("Error fetching featured blog posts:", error);
    throw new Error(`Failed to fetch featured blog posts: ${error.message}`);
  }

  return (data || []).map(post => {
    const transformedPost = transformDatabasePost(post);
    
    if (post.blog_translations && post.blog_translations.length > 0) {
      transformedPost.translations = {};
      
      post.blog_translations.forEach((translation: any) => {
        if (translation.language === 'fr' || translation.language === 'es') {
          transformedPost.translations![translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content
          };
        }
      });
    }
    
    return transformedPost;
  });
};
