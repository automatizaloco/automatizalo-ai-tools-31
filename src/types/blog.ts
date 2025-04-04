
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
  url?: string; // Added URL field for source reference
  status?: 'draft' | 'published'; // Added status field to track draft posts
  translations?: {
    fr?: {
      title?: string;
      excerpt?: string;
      content?: string;
    };
    es?: {
      title?: string;
      excerpt?: string;
      content?: string;
    };
  };
}

export interface BlogTranslation {
  id: string;
  blog_post_id: string;
  language: string;
  title: string;
  excerpt: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export type NewBlogPost = Omit<BlogPost, 'id'>;
export type NewBlogTranslation = Omit<BlogTranslation, 'id' | 'created_at' | 'updated_at'>;
