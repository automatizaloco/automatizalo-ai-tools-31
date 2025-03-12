
import { supabase } from "@/integrations/supabase/client";

export interface PageSection {
  id: string;
  page: string;
  section_name: string;
  content: string;
  updated_at: string;
}

export const getPageContent = async (page: string, section: string): Promise<string> => {
  try {
    // Try to fetch content from Supabase
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page', page)
      .eq('section_name', section)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching page content:', error);
      throw error;
    }
    
    // If content exists in the database, return it
    if (data) {
      return data.content;
    }
    
    // If not in the database, use default content
    const defaultContent = getDefaultContent(page, section);
    
    // Store the default content in Supabase for future use
    await supabase.from('page_content').insert({
      page,
      section_name: section,
      content: defaultContent,
      updated_at: new Date().toISOString()
    });
    
    return defaultContent;
  } catch (error) {
    console.error('Error in getPageContent:', error);
    
    // Fallback to localStorage if Supabase fails
    const key = `page_content_${page}_${section}`;
    const storedContent = localStorage.getItem(key);
    
    if (storedContent) {
      return storedContent;
    }
    
    // Default content as last resort
    const defaultContent = getDefaultContent(page, section);
    localStorage.setItem(key, defaultContent);
    
    return defaultContent;
  }
};

export const updatePageContent = async (page: string, section: string, content: string): Promise<void> => {
  try {
    // Check if content already exists
    const { data } = await supabase
      .from('page_content')
      .select('id')
      .eq('page', page)
      .eq('section_name', section)
      .maybeSingle();
    
    if (data) {
      // Update existing content
      const { error } = await supabase
        .from('page_content')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('page', page)
        .eq('section_name', section);
      
      if (error) {
        throw error;
      }
    } else {
      // Insert new content
      const { error } = await supabase
        .from('page_content')
        .insert({
          page,
          section_name: section,
          content,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
    }
    
    console.log(`Content updated for ${page} - ${section}`);
  } catch (error) {
    console.error('Error updating page content in Supabase:', error);
    
    // Fallback to localStorage if Supabase fails
    const key = `page_content_${page}_${section}`;
    localStorage.setItem(key, content);
  }
};

// Default content for each section if nothing is stored yet
const getDefaultContent = (page: string, section: string): string => {
  const defaults: Record<string, Record<string, string>> = {
    home: {
      hero: '<h1 class="text-4xl font-bold">Welcome to Automatizalo</h1><p class="mt-4">Your trusted partner for AI and automation solutions</p>',
      about: '<h2 class="text-3xl font-bold">About Us</h2><p class="mt-4">We help businesses transform through intelligent automation</p>',
      solutions: '<h2 class="text-3xl font-bold">Our Solutions</h2><p class="mt-4">Discover how our AI-powered tools can streamline your workflow</p>',
      cta: '<h2 class="text-3xl font-bold">Ready to transform your business?</h2><p class="mt-4">Contact us today to learn how we can help you automate and grow</p>'
    },
    about: {
      main: '<h1 class="text-4xl font-bold">About Automatizalo</h1><p class="mt-4">Learn about our mission, vision, and the team behind our innovative solutions</p>'
    },
    solutions: {
      overview: '<h1 class="text-4xl font-bold">Our Solutions</h1><p class="mt-4">Explore our comprehensive range of automation and AI solutions</p>'
    },
    contact: {
      main: '<h1 class="text-4xl font-bold">Contact Us</h1><p class="mt-4">Get in touch with our team to discuss how we can help your business</p>'
    }
  };

  return defaults[page]?.[section] || `<h2>Content for ${section} on ${page} page</h2>`;
};
