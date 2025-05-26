
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getPageContent = async (page: string, section: string, language: string = 'en'): Promise<string> => {
  try {
    console.log(`Getting page content for: ${page}.${section} in ${language}`);
    
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
      // If no content found for requested language, try English
      if (language !== 'en') {
        return getPageContent(page, section, 'en');
      }
      return `<h2>Content for ${section} on ${page} page</h2>`;
    }
    
    if (data?.content) {
      console.log(`Found content for ${page}.${section}:`, data.content.substring(0, 100) + '...');
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
    console.log(`Updating page content for: ${page}.${section} in ${language}`);
    console.log('Content preview:', content.substring(0, 100) + '...');
    
    const { error } = await supabase
      .from('page_content')
      .upsert({
        page,
        section_name: section,
        content,
        language,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page,section_name,language'
      });
    
    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }

    console.log(`Successfully updated content for ${page}.${section} in ${language}`);
    
    // Auto-translate to other languages if updating English content
    if (language === 'en') {
      try {
        // Trigger auto-translation for other languages
        const languages = ['es', 'fr', 'de'];
        for (const targetLang of languages) {
          if (targetLang !== language) {
            setTimeout(async () => {
              try {
                await supabase
                  .from('page_content')
                  .upsert({
                    page,
                    section_name: section,
                    content, // For now, just use the same content
                    language: targetLang,
                    updated_at: new Date().toISOString()
                  }, {
                    onConflict: 'page,section_name,language'
                  });
              } catch (translationError) {
                console.error(`Failed to auto-translate to ${targetLang}:`, translationError);
              }
            }, 1000); // Delay to avoid rate limiting
          }
        }
      } catch (translationError) {
        console.error('Error in auto-translation:', translationError);
      }
    }
    
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
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
