
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { translateBlogContent } from "./translationService";
import { toast } from "sonner";

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
      if (language !== 'en') {
        console.log(`No content found for ${language}, trying English as fallback`);
        return getPageContent(page, section, 'en');
      }
      
      // For serious errors, return default content
      const defaultContent = `<h2>Content for ${section} on ${page} page</h2>`;
      return defaultContent;
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
    try {
      const { error: insertError } = await supabase
        .from('page_content')
        .insert({
          page,
          section_name: section,
          content: defaultContent,
          language: language
        });
      
      if (insertError) {
        console.error('Error inserting default content:', insertError);
      }
    } catch (insertErr) {
      console.error('Error in insert operation:', insertErr);
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
      console.error('Error updating page content in Supabase:', error);
      toast.error(handleSupabaseError(error, "Failed to update content"));
      return;
    }
    
    console.log(`Content updated successfully for ${page}/${section} in ${language}`);
    
    // If the updated language is English, auto-translate to other languages
    if (language === 'en') {
      autoTranslatePageContent(page, section, content);
    }
  } catch (error) {
    console.error('Error updating page content in Supabase:', error);
    toast.error(handleSupabaseError(error, "Failed to update content"));
  }
};

// Auto-translate content from English to other languages
const autoTranslatePageContent = async (page: string, section: string, englishContent: string): Promise<void> => {
  try {
    console.log(`Auto-translating content for ${page}/${section}...`);
    const languages = ['fr', 'es'];
    
    // Create a fake title and excerpt for the translation function which expects these fields
    const dummyTitle = `${page}-${section}`;
    const dummyExcerpt = "Placeholder excerpt";
    
    // Translate to each language and store in the database
    for (const targetLang of languages) {
      try {
        console.log(`Translating content to ${targetLang}`);
        toast.info(`Translating content to ${targetLang === 'fr' ? 'French' : 'Spanish'}...`, {
          id: `translate-${page}-${section}-${targetLang}`,
          duration: 3000
        });
        
        const translated = await translateBlogContent(
          englishContent,
          dummyTitle,
          dummyExcerpt,
          targetLang as 'fr' | 'es'
        );
        
        console.log(`Translation to ${targetLang} completed. Storing in database...`);
        
        // Store the translated content
        const { error } = await supabase
          .from('page_content')
          .upsert({
            page,
            section_name: section,
            content: translated.content,
            language: targetLang,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'page,section_name,language'
          });
        
        if (error) {
          console.error(`Error storing ${targetLang} translation for ${page}/${section}:`, error);
          toast.error(`Failed to save ${targetLang === 'fr' ? 'French' : 'Spanish'} translation`);
        } else {
          console.log(`${targetLang} translation stored successfully for ${page}/${section}`);
          toast.success(`${targetLang === 'fr' ? 'French' : 'Spanish'} translation saved successfully`, {
            id: `translate-${page}-${section}-${targetLang}`
          });
        }
      } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        toast.error(`Failed to translate to ${targetLang === 'fr' ? 'French' : 'Spanish'}`);
      }
    }
  } catch (error) {
    console.error('Error in autoTranslatePageContent:', error);
    toast.error('An error occurred during auto-translation');
  }
};
