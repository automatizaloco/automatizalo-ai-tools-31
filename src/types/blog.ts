
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
