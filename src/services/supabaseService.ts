
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";

// Blog posts
export const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match our app's data model
  return data.map(post => ({
    ...post,
    readTime: post.read_time
  }));
};

export const fetchBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  
  // Transform to match our app's data model
  return {
    ...data,
    readTime: data.read_time
  };
};

// Contact info
export const fetchContactInfo = async () => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

export const updateContactInfo = async (updates: {
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}) => {
  const { data, error } = await supabase
    .from('contact_info')
    .update(updates)
    .eq('id', (await fetchContactInfo()).id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Testimonials
export const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
  
  return data;
};

export const createTestimonial = async (testimonial: {
  name: string;
  company?: string;
  text: string;
}) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTestimonial = async (
  id: string,
  updates: {
    name?: string;
    company?: string;
    text?: string;
  }
) => {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
