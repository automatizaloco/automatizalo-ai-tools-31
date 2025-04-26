
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getPageContent = async (page: string, section: string, language: string = 'en'): Promise<string> => {
  try {
    // Try to get content from localStorage first
    const cacheKey = `page_content_${page}_${section}_${language}`;
    const cachedContent = localStorage.getItem(cacheKey);
    
    // Get content from Supabase
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page', page)
      .eq('section_name', section)
      .eq('language', language)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching content:', error);
      // Return cached content if available
      if (cachedContent) return cachedContent;
      return `<h2>Content for ${section} on ${page} page</h2>`;
    }
    
    if (data?.content) {
      // Update cache
      localStorage.setItem(cacheKey, data.content);
      return data.content;
    }
    
    // If no content found for requested language, try English
    if (language !== 'en') {
      return getPageContent(page, section, 'en');
    }
    
    const defaultContent = `<h2>Content for ${section} on ${page} page</h2>`;
    return defaultContent;
    
  } catch (error) {
    console.error('Error in getPageContent:', error);
    const defaultContent = `<h2>Content for ${section} on ${page} page</h2>`;
    return defaultContent;
  }
};

export const updatePageContent = async (
  page: string, 
  section: string, 
  content: string, 
  language: string = 'en'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('page_content')
      .upsert({
        page,
        section_name: section,
        content,
        language,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;

    // Update cache
    const cacheKey = `page_content_${page}_${section}_${language}`;
    localStorage.setItem(cacheKey, content);
    
    toast.success("Content updated successfully");
  } catch (error) {
    console.error('Error updating content:', error);
    toast.error("Failed to update content");
  }
};

// Simple function to clear cache if needed
export const clearContentCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('page_content_')) {
      localStorage.removeItem(key);
    }
  });
};
