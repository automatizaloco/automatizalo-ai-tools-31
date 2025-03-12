
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Translates blog post content to the target language
 */
export const translateBlogContent = async (
  content: string,
  title: string,
  excerpt: string,
  targetLang: 'fr' | 'es'
): Promise<{
  title: string;
  excerpt: string;
  content: string;
}> => {
  try {
    console.log(`Starting translation to ${targetLang}...`);
    console.log(`Content length: ${content.length}, Title length: ${title.length}, Excerpt length: ${excerpt.length}`);
    
    const { data, error } = await supabase.functions.invoke('translate-blog', {
      body: {
        text: content,
        title: title,
        excerpt: excerpt,
        targetLang: targetLang
      },
    });

    if (error) {
      console.error(`Error translating content to ${targetLang}:`, error);
      throw new Error(`Translation failed: ${error.message}`);
    }

    if (!data) {
      console.error('No translation data received');
      throw new Error('No translation data received');
    }
    
    console.log(`Translation to ${targetLang} completed successfully:`, data);
    console.log(`Translated content length: ${data.content?.length || 0}`);

    if (!data.title || !data.content) {
      console.error('Incomplete translation data received:', data);
      throw new Error('Incomplete translation data received');
    }

    return {
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: data.content || ''
    };
  } catch (error: any) {
    console.error(`Error translating content to ${targetLang}:`, error);
    toast.error(`Failed to translate content: ${error.message}`);
    throw error;
  }
};
