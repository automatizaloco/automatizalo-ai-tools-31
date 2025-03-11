import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '@/types/blog';
import { generateTranslations } from './translationService';
import { supabase } from "@/integrations/supabase/client";

// Check authentication status
const checkAuth = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("User must be authenticated to perform this operation");
  }
};

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
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
      if (trans) {
        acc[trans.language] = {
          title: trans.title,
          excerpt: trans.excerpt,
          content: trans.content
        };
      }
      return acc;
    }, {}) : {}
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
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
      if (trans) {
        acc[trans.language] = {
          title: trans.title,
          excerpt: trans.excerpt,
          content: trans.content
        };
      }
      return acc;
    }, {}) : {}
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
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
      if (trans) {
        acc[trans.language] = {
          title: trans.title,
          excerpt: trans.excerpt,
          content: trans.content
        };
      }
      return acc;
    }, {}) : {}
  };
};

// Create a new blog post
export const createBlogPost = async (postData: any): Promise<BlogPost> => {
  await checkAuth();
  
  console.log("Creating blog post with data:", postData);
  
  const { translations, ...blogPostData } = postData;
  
  // Prepare data for Supabase
  const supabaseData = {
    ...blogPostData,
    read_time: blogPostData.readTime, // Map from readTime to read_time
  };
  
  // Insert blog post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .insert([supabaseData])
    .select()
    .single();

  if (postError) {
    console.error("Error creating blog post:", postError);
    throw postError;
  }

  console.log("Blog post created:", post);

  // Insert translations if provided
  if (translations) {
    const translationsArray = Object.entries(translations)
      .filter(([language, content]: [string, any]) => 
        content && (content.title || content.excerpt || content.content))
      .map(([language, content]: [string, any]) => ({
        blog_post_id: post.id,
        language,
        title: content.title || "",
        excerpt: content.excerpt || "",
        content: content.content || ""
      }));

    if (translationsArray.length > 0) {
      console.log("Inserting translations:", translationsArray);
      
      const { error: translationError } = await supabase
        .from('blog_translations')
        .insert(translationsArray);

      if (translationError) {
        console.error("Error inserting translations:", translationError);
        throw translationError;
      }
    }
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: translations || {}
  };
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: any): Promise<BlogPost | undefined> => {
  await checkAuth();
  
  console.log("Updating blog post with data:", postData);
  
  const { translations, ...blogPostData } = postData;
  
  // Prepare data for Supabase
  const supabaseData = {
    ...blogPostData,
    read_time: blogPostData.readTime, // Map from readTime to read_time
  };
  
  // Update blog post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .update(supabaseData)
    .eq('id', id)
    .select()
    .single();

  if (postError) {
    console.error("Error updating blog post:", postError);
    throw postError;
  }

  console.log("Blog post updated:", post);

  // Update translations
  if (translations) {
    // Delete existing translations
    const { error: deleteError } = await supabase
      .from('blog_translations')
      .delete()
      .eq('blog_post_id', id);

    if (deleteError) {
      console.error("Error deleting existing translations:", deleteError);
      throw deleteError;
    }

    // Insert new translations
    const translationsArray = Object.entries(translations)
      .filter(([language, content]: [string, any]) => 
        content && (content.title || content.excerpt || content.content))
      .map(([language, content]: [string, any]) => ({
        blog_post_id: id,
        language,
        title: content.title || "",
        excerpt: content.excerpt || "",
        content: content.content || ""
      }));

    if (translationsArray.length > 0) {
      console.log("Inserting updated translations:", translationsArray);
      
      const { error: translationError } = await supabase
        .from('blog_translations')
        .insert(translationsArray);

      if (translationError) {
        console.error("Error inserting updated translations:", translationError);
        throw translationError;
      }
    }
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: translations || {}
  };
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  await checkAuth();
  
  console.log("Deleting blog post:", id);
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
  
  console.log("Blog post deleted successfully");
  return true;
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
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
      if (trans) {
        acc[trans.language] = {
          title: trans.title,
          excerpt: trans.excerpt,
          content: trans.content
        };
      }
      return acc;
    }, {}) : {}
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
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
      if (trans) {
        acc[trans.language] = {
          title: trans.title,
          excerpt: trans.excerpt,
          content: trans.content
        };
      }
      return acc;
    }, {}) : {}
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
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    category: post.category,
    tags: post.tags || [],
    date: post.date,
    readTime: post.read_time, // Map from read_time to readTime
    author: post.author,
    featured: post.featured,
    translations: post.blog_translations ? post.blog_translations.reduce((acc: any, trans: any) => {
      if (trans) {
        acc[trans.language] = {
          title: trans.title,
          excerpt: trans.excerpt,
          content: trans.content
        };
      }
      return acc;
    }, {}) : {}
  }));
};
