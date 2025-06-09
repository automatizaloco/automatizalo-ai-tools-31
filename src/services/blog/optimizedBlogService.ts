
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogTranslation } from "@/types/blog";
import { transformDatabasePost } from "./utils";

// Cache en memoria para evitar llamadas repetidas
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Función optimizada para fetch de posts con cache agresivo
 */
export const fetchOptimizedBlogPosts = async (): Promise<BlogPost[]> => {
  const cacheKey = 'all_posts';
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    console.log("Returning cached blog posts");
    return cachedData;
  }

  // Query optimizada con menos datos
  const { data: postsWithTranslations, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      category,
      status,
      featured,
      image,
      author,
      date,
      read_time,
      created_at,
      updated_at,
      blog_translations!inner (
        language,
        title,
        excerpt
      )
    `)
    .order('date', { ascending: false })
    .limit(50); // Limitar resultados para mejor rendimiento

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  // Procesamiento optimizado
  const posts = (postsWithTranslations || []).map(post => {
    const transformedPost = transformDatabasePost(post);
    
    // Procesamiento más eficiente de traducciones
    if (post.blog_translations?.length > 0) {
      transformedPost.translations = {};
      
      for (const translation of post.blog_translations) {
        if (translation.language === 'fr' || translation.language === 'es') {
          transformedPost.translations[translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: '' // No cargar contenido completo aquí para mejor rendimiento
          };
        }
      }
    }
    
    return transformedPost;
  });

  setCachedData(cacheKey, posts);
  return posts;
};

/**
 * Función optimizada para fetch de post individual
 */
export const fetchOptimizedBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const cacheKey = `post_${slug}`;
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

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

  if (data.blog_translations?.length > 0) {
    post.translations = {};
    
    for (const translation of data.blog_translations) {
      if (translation.language === 'fr' || translation.language === 'es') {
        post.translations[translation.language] = {
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content
        };
      }
    }
  }

  setCachedData(cacheKey, post);
  return post;
};

/**
 * Featured posts con cache optimizado
 */
export const fetchOptimizedFeaturedPosts = async (): Promise<BlogPost[]> => {
  const cacheKey = 'featured_posts';
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      category,
      image,
      author,
      date,
      read_time,
      featured,
      blog_translations!inner (
        language,
        title,
        excerpt
      )
    `)
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured blog posts:", error);
    throw new Error(`Failed to fetch featured blog posts: ${error.message}`);
  }

  const posts = (data || []).map(post => {
    const transformedPost = transformDatabasePost(post);
    
    if (post.blog_translations?.length > 0) {
      transformedPost.translations = {};
      
      for (const translation of post.blog_translations) {
        if (translation.language === 'fr' || translation.language === 'es') {
          transformedPost.translations[translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: ''
          };
        }
      }
    }
    
    return transformedPost;
  });

  setCachedData(cacheKey, posts);
  return posts;
};

// Función para limpiar cache cuando sea necesario
export const clearBlogCache = () => {
  cache.clear();
};
