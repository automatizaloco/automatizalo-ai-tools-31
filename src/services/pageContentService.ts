
import { supabase } from "@/integrations/supabase/client";

export interface PageSection {
  id: string;
  page: string;
  section_name: string;
  content: string;
  updated_at: string;
  language?: string;
}

export const getPageContent = async (page: string, section: string, language: string = 'en'): Promise<string> => {
  try {
    console.log(`Fetching content for ${page}/${section} in language ${language}`);
    
    // Get content from Supabase for the specified language
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page', page)
      .eq('section_name', section)
      .eq('language', language)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching page content:', error);
      
      // If no content exists in database for this language, check if we have it in English
      if (error.message.includes('No rows found') && language !== 'en') {
        console.log(`No content found for ${language}, trying English as fallback`);
        return getPageContent(page, section, 'en');
      }
      
      throw error;
    }
    
    // If content exists in the database, return it
    if (data?.content) {
      console.log(`Found content in database for ${page}/${section} in ${language}`);
      return data.content;
    }
    
    // If no content exists for the requested language but it's not English, try English
    if (language !== 'en') {
      console.log(`No content found for ${language}, falling back to English`);
      return getPageContent(page, section, 'en');
    }
    
    // Return default content for English if nothing is found
    const defaultContent = `<h2>Content for ${section} on ${page} page</h2>`;
    
    // Store the default content in Supabase
    const { error: insertError } = await supabase.from('page_content').insert({
      page,
      section_name: section,
      content: defaultContent,
      language: language
    });
    
    if (insertError) {
      console.error('Error inserting default content:', insertError);
    }
    
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
    console.log(`Updating content for ${page}/${section} in language ${language}`);
    
    const { error } = await supabase.from('page_content')
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
      console.error('Error updating page content in Supabase:', error);
      throw error;
    }
    
    console.log(`Content updated successfully for ${page}/${section} in ${language}`);
  } catch (error) {
    console.error('Error updating page content in Supabase:', error);
    throw error;
  }
};
