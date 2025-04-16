
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
    console.log(`Fetching content for ${page}/${section}`);
    
    // Get content from Supabase
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page', page)
      .eq('section_name', section)
      .single();
    
    if (error) {
      console.error('Error fetching page content:', error);
      
      // If no content exists in database, use default/fallback
      if (error.message.includes('No rows found')) {
        // Store the default content in Supabase for future edits
        const defaultContent = getDefaultContent(page, section);
        
        const { error: insertError } = await supabase.from('page_content').insert({
          page,
          section_name: section,
          content: defaultContent
        });
        
        if (insertError) {
          console.error('Error inserting default content:', insertError);
        } else {
          console.log(`Default content inserted for ${page}/${section}`);
        }
        
        return defaultContent;
      }
      
      throw error;
    }
    
    // If content exists in the database, return it
    if (data?.content) {
      console.log(`Found content in database for ${page}/${section}`);
      return data.content;
    }
    
    // Fallback to default content
    const defaultContent = getDefaultContent(page, section);
    
    // Store the default content in Supabase if not already there
    const { error: insertError } = await supabase.from('page_content').upsert({
      page,
      section_name: section,
      content: defaultContent
    }, { onConflict: 'page,section_name' });
    
    if (insertError) {
      console.error('Error inserting default content:', insertError);
    }
    
    return defaultContent;
  } catch (error) {
    console.error('Error in getPageContent:', error);
    
    // Default content as last resort
    const defaultContent = getDefaultContent(page, section);
    
    // Try to save it to the database
    try {
      await supabase.from('page_content').upsert({
        page,
        section_name: section,
        content: defaultContent
      }, { onConflict: 'page,section_name' });
    } catch (insertError) {
      console.error('Error inserting default content after fetch error:', insertError);
    }
    
    return defaultContent;
  }
};

export const updatePageContent = async (page: string, section: string, content: string): Promise<void> => {
  try {
    console.log(`Updating content for ${page}/${section}`);
    
    // Always use upsert to ensure it works whether the entry exists or not
    const { error } = await supabase.from('page_content')
      .upsert({
        page,
        section_name: section,
        content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page,section_name'
      });
    
    if (error) {
      console.error('Error updating page content in Supabase:', error);
      throw error;
    }
    
    console.log(`Content updated successfully for ${page}/${section}`);
  } catch (error) {
    console.error('Error updating page content in Supabase:', error);
    
    // Re-throw the error so the UI can handle it
    throw error;
  }
};

// Default content for each section if nothing is stored yet
const getDefaultContent = (page: string, section: string): string => {
  const defaults: Record<string, Record<string, string>> = {
    home: {
      hero: '<h1 class="text-4xl font-bold">Welcome to Automatizalo</h1><p class="mt-4">Your trusted partner for AI and automation solutions</p>',
      about: '<h2 class="text-3xl font-bold">About Us</h2><p class="mt-4">We help businesses transform through intelligent automation</p>',
      "about-tagline": "Smart Automation",
      "about-title": "Transform Your Business with AI",
      "about-description": "We specialize in creating intelligent automation solutions that help businesses streamline operations, reduce costs, and improve customer experiences.",
      "about-mission": "Our mission is to make AI technology accessible to businesses of all sizes, helping them stay competitive in the digital age.",
      "about-feature1-title": "Personalized Solutions",
      "about-feature1-description": "Customized AI solutions tailored to your specific business needs.",
      "about-feature2-title": "Seamless Integration",
      "about-feature2-description": "Our solutions integrate smoothly with your existing systems and workflows.",
      "about-feature3-title": "Data-Driven Insights",
      "about-feature3-description": "Transform your raw data into actionable business intelligence.",
      "about-feature4-title": "Continuous Support",
      "about-feature4-description": "Ongoing assistance and updates to keep your solutions running optimally.",
      "about-feature-1-title": "Personalized Solutions",
      "about-feature-1-description": "Customized AI solutions tailored to your specific business needs.",
      "about-feature-2-title": "Seamless Integration",
      "about-feature-2-description": "Our solutions integrate smoothly with your existing systems and workflows.",
      "about-feature-3-title": "Data-Driven Insights",
      "about-feature-3-description": "Transform your raw data into actionable business intelligence.",
      "about-feature-4-title": "Continuous Support",
      "about-feature-4-description": "Ongoing assistance and updates to keep your solutions running optimally.",
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

  // Try to get the specific content or return a generic default
  return defaults[page]?.[section] || `<h2>Content for ${section} on ${page} page</h2>`;
};
