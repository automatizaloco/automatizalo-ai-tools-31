
import { supabase } from "@/integrations/supabase/client";

export interface PageSection {
  id: string;
  page: string;
  section_name: string;
  content: string;
  updated_at: string;
}

// In a real implementation, this would fetch from the database
// For now, we'll use localStorage to simulate persistence
export const getPageContent = async (page: string, section: string): Promise<string> => {
  const key = `page_content_${page}_${section}`;
  const storedContent = localStorage.getItem(key);
  
  if (storedContent) {
    return storedContent;
  }
  
  // Default content for each section
  const defaultContent = getDefaultContent(page, section);
  
  // Store the default content if nothing exists
  localStorage.setItem(key, defaultContent);
  
  return defaultContent;
};

export const updatePageContent = async (page: string, section: string, content: string): Promise<void> => {
  const key = `page_content_${page}_${section}`;
  localStorage.setItem(key, content);
  
  // In a real implementation, this would update the database:
  // await supabase.from('page_content').upsert({
  //   page,
  //   section_name: section, 
  //   content,
  //   updated_at: new Date().toISOString()
  // }).eq('page', page).eq('section_name', section);
  
  console.log(`Content updated for ${page} - ${section}`);
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
