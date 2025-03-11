
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '@/types/blog';
import { generateTranslations } from './translationService';
import { supabase } from "@/integrations/supabase/client";

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
  
  // Transform the data to match the BlogPost type
  return posts.map(post => ({
    ...post,
    translations: post.blog_translations.reduce((acc: any, trans: any) => {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
      return acc;
    }, {})
  }));
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

  return {
    ...post,
    translations: post.blog_translations.reduce((acc: any, trans: any) => {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
      return acc;
    }, {})
  };
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

  return {
    ...post,
    translations: post.blog_translations.reduce((acc: any, trans: any) => {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
      return acc;
    }, {})
  };
};

// Create a new blog post
export const createBlogPost = async (postData: any): Promise<BlogPost> => {
  const { translations, ...blogPostData } = postData;
  
  // Insert blog post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .insert([blogPostData])
    .select()
    .single();

  if (postError) throw postError;

  // Insert translations if provided
  if (translations) {
    const translationsArray = Object.entries(translations).map(([language, content]: [string, any]) => ({
      blog_post_id: post.id,
      language,
      ...content
    }));

    const { error: translationError } = await supabase
      .from('blog_translations')
      .insert(translationsArray);

    if (translationError) throw translationError;
  }

  return { ...post, translations };
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: any): Promise<BlogPost | undefined> => {
  const { translations, ...blogPostData } = postData;
  
  // Update blog post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .update(blogPostData)
    .eq('id', id)
    .select()
    .single();

  if (postError) throw postError;

  // Update translations
  if (translations) {
    // Delete existing translations
    const { error: deleteError } = await supabase
      .from('blog_translations')
      .delete()
      .eq('blog_post_id', id);

    if (deleteError) throw deleteError;

    // Insert new translations
    const translationsArray = Object.entries(translations).map(([language, content]: [string, any]) => ({
      blog_post_id: id,
      language,
      ...content
    }));

    const { error: translationError } = await supabase
      .from('blog_translations')
      .insert(translationsArray);

    if (translationError) throw translationError;
  }

  return { ...post, translations };
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  return !error;
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

  return posts.map(post => ({
    ...post,
    translations: post.blog_translations.reduce((acc: any, trans: any) => {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
      return acc;
    }, {})
  }));
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

  return posts.map(post => ({
    ...post,
    translations: post.blog_translations.reduce((acc: any, trans: any) => {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
      return acc;
    }, {})
  }));
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

  return posts.map(post => ({
    ...post,
    translations: post.blog_translations.reduce((acc: any, trans: any) => {
      acc[trans.language] = {
        title: trans.title,
        excerpt: trans.excerpt,
        content: trans.content
      };
      return acc;
    }, {})
  }));
};
