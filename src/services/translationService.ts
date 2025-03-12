
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
