
import { supabase, handleSupabaseError, retryOperation } from "@/integrations/supabase/client";
import { translateBlogContent } from "./translationService";
import { toast } from "sonner";

// Cache for page content to reduce database queries and provide fallback
const contentCache: Record<string, Record<string, Record<string, { content: string, timestamp: number }>>> = {};

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
    
    // Check cache first
    const cacheKey = `${page}/${section}/${language}`;
    const cachedContent = contentCache[page]?.[section]?.[language];
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    
    if (cachedContent && (Date.now() - cachedContent.timestamp) < cacheExpiry) {
      console.log(`Using cached content for ${cacheKey}`);
      return cachedContent.content;
    }
    
    // Get content from Supabase for the specified language with retries
    try {
      const { data, error } = await retryOperation(
        async () => await supabase
          .from('page_content')
          .select('content')
          .eq('page', page)
          .eq('section_name', section)
          .eq('language', language)
          .maybeSingle(),
        2,
        1000
      );
      
      if (error) {
        throw error;
      }
      
      // If content exists in the database, cache and return it
      if (data?.content) {
        console.log(`Found content in database for ${page}/${section} in ${language}`);
        
        // Update cache
        if (!contentCache[page]) contentCache[page] = {};
        if (!contentCache[page][section]) contentCache[page][section] = {};
        contentCache[page][section][language] = {
          content: data.content,
          timestamp: Date.now()
        };
        
        return data.content;
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
      
      // If there's an error but we have cached content, use that
      if (cachedContent) {
        console.log(`Using expired cached content for ${cacheKey} due to error`);
        return cachedContent.content;
      }
      
      // If no content exists in database for this language, check if we have it in English
      if (language !== 'en') {
        console.log(`No content found for ${language}, trying English as fallback`);
        return getPageContent(page, section, 'en');
      }
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
          language
        });
      
      if (insertError) {
        console.error('Error inserting default content:', insertError);
      } else {
        // Update cache with the default content
        if (!contentCache[page]) contentCache[page] = {};
        if (!contentCache[page][section]) contentCache[page][section] = {};
        contentCache[page][section][language] = {
          content: defaultContent,
          timestamp: Date.now()
        };
      }
    } catch (insertErr) {
      console.error('Error in insert operation:', insertErr);
    }
    
    return defaultContent;
  } catch (error) {
    console.error('Error in getPageContent:', error);
    
    // If we have cached content, use that as a last resort
    const cachedContent = contentCache[page]?.[section]?.[language];
    if (cachedContent) {
      console.log(`Using cached content as fallback for ${page}/${section}/${language}`);
      return cachedContent.content;
    }
    
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
    
    // Update cache immediately for responsive UI
    if (!contentCache[page]) contentCache[page] = {};
    if (!contentCache[page][section]) contentCache[page][section] = {};
    contentCache[page][section][language] = {
      content,
      timestamp: Date.now()
    };
    
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
        
        // Update cache immediately
        if (!contentCache[page]) contentCache[page] = {};
        if (!contentCache[page][section]) contentCache[page][section] = {};
        contentCache[page][section][targetLang] = {
          content: translated.content,
          timestamp: Date.now()
        };
        
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

// Clear cache function that can be called to force reload data
export const clearContentCache = () => {
  Object.keys(contentCache).forEach(page => {
    delete contentCache[page];
  });
  console.log("Page content cache cleared");
};
