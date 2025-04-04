
import { BlogPost } from "@/types/blog";

// Utility function to transform database post to BlogPost type
export const transformDatabasePost = (post: any): BlogPost => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  image: post.image,
  category: post.category,
  tags: post.tags || [],
  date: post.date,
  readTime: post.read_time,
  author: post.author,
  featured: post.featured,
  status: post.status || 'published', // Default to published if status isn't present
  url: post.url,
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
});

// Utility function to transform BlogPost to database format
export const transformPostForDatabase = (postData: any) => {
  const { translations, readTime, ...rest } = postData;
  return {
    ...rest,
    read_time: readTime
  };
};
