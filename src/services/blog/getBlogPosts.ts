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

  // Map the database field read_time to readTime in our BlogPost type
  let posts = (data || []).map(post => ({
    ...post,
    readTime: post.read_time
  })) as BlogPost[];

  // Fetch translations for all posts
  for (const post of posts) {
    const { data: translations, error: translationsError } = await supabase
      .from('blog_translations')
      .select('*')
      .eq('blog_post_id', post.id);

    if (translationsError) {
      console.error(`Error fetching translations for post ${post.id}:`, translationsError);
      continue; // Continue with other posts if there's an error with this one
    }

    if (translations && translations.length > 0) {
      post.translations = {};
      
      // Group translations by language
      translations.forEach((translation: BlogTranslation) => {
        if (translation.language === 'fr' || translation.language === 'es') {
          post.translations![translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content
          };
        }
      });
    }
  }

  return posts;
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

  if (!data) return null;
  
  const post = {
    ...data,
    readTime: data.read_time
  } as BlogPost;

  // Fetch translations for this post
  const { data: translations, error: translationsError } = await supabase
    .from('blog_translations')
    .select('*')
    .eq('blog_post_id', id);

  if (translationsError) {
    console.error(`Error fetching translations for post ${id}:`, translationsError);
  } else if (translations && translations.length > 0) {
    post.translations = {};
    
    // Group translations by language
    translations.forEach((translation: BlogTranslation) => {
      if (translation.language === 'fr' || translation.language === 'es') {
        console.log(`Found ${translation.language} translation: content length = ${translation.content?.length || 0}`);
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

  if (!data) return null;
  
  const post = {
    ...data,
    readTime: data.read_time
  } as BlogPost;

  // Fetch translations for this post
  const { data: translations, error: translationsError } = await supabase
    .from('blog_translations')
    .select('*')
    .eq('blog_post_id', post.id);

  if (translationsError) {
    console.error(`Error fetching translations for post ${post.id}:`, translationsError);
  } else if (translations && translations.length > 0) {
    post.translations = {};
    
    // Log translation data for debugging
    console.log(`Found ${translations.length} translations for post ${post.id}`);
    
    // Group translations by language
    translations.forEach((translation: BlogTranslation) => {
      if (translation.language === 'fr' || translation.language === 'es') {
        console.log(`Processing ${translation.language} translation: title=${translation.title?.substring(0, 20)}..., content length=${translation.content?.length || 0}`);
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

  // Map the database field read_time to readTime in our BlogPost type
  let posts = (data || []).map(post => ({
    ...post,
    readTime: post.read_time
  })) as BlogPost[];

  // Fetch translations for all featured posts
  for (const post of posts) {
    const { data: translations } = await supabase
      .from('blog_translations')
      .select('*')
      .eq('blog_post_id', post.id);

    if (translations && translations.length > 0) {
      post.translations = {};
      
      // Group translations by language
      translations.forEach((translation: BlogTranslation) => {
        if (translation.language === 'fr' || translation.language === 'es') {
          post.translations![translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content
          };
        }
      });
    }
  }

  return posts;
};

// Add aliases for the blog pages that were using the old names
export const getBlogPosts = fetchBlogPosts;
export const getBlogPostById = fetchBlogPostById;
export const getBlogPostBySlug = fetchBlogPostBySlug;
