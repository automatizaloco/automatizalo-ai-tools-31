
import { supabase } from "@/integrations/supabase/client";

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, targetLang }
    });

    if (error) {
      console.error('Translation error:', error);
      throw error;
    }

    return data?.translatedText || text;
  } catch (error) {
    console.error('Translation service error:', error);
    return text;
  }
}

export async function translateBlogPost(content: {
  title: string;
  excerpt: string;
  content: string;
}, targetLang: string) {
  try {
    const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all([
      translateText(content.title, targetLang),
      translateText(content.excerpt, targetLang),
      translateText(content.content, targetLang)
    ]);

    return {
      title: translatedTitle,
      excerpt: translatedExcerpt,
      content: translatedContent
    };
  } catch (error) {
    console.error('Blog post translation error:', error);
    return content;
  }
}
