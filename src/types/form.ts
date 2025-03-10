
import { BlogPost } from "./blog";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  translations: {
    fr: { title: string; excerpt: string; content: string; };
    es: { title: string; excerpt: string; content: string; };
  }
}

export interface TranslationFormData {
  fr: { title: string; excerpt: string; content: string; };
  es: { title: string; excerpt: string; content: string; };
}
