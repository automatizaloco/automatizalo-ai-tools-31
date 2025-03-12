
import { supabase } from "@/integrations/supabase/client";
import { BlogTranslation, NewBlogTranslation } from "@/types/blog";
import { TranslationFormData } from "@/types/form";
import { toast } from "sonner";

/**
 * Save or update blog translations for a post
 */
export const saveBlogTranslations = async (
  blogPostId: string,
  translations: TranslationFormData
): Promise<void> => {
  console.log("Saving translations for post:", blogPostId, translations);

  try {
    // Handle French translations
    if (translations.fr.title && translations.fr.content) {
      await upsertTranslation(blogPostId, "fr", translations.fr);
    }

    // Handle Spanish translations
    if (translations.es.title && translations.es.content) {
      await upsertTranslation(blogPostId, "es", translations.es);
    }

    toast.success("Translations saved successfully");
  } catch (error) {
    console.error("Error saving translations:", error);
    toast.error(`Failed to save translations: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Helper function to update or insert a translation
 */
const upsertTranslation = async (
  blogPostId: string,
  language: string,
  translationData: { title: string; excerpt: string; content: string }
): Promise<void> => {
  console.log(`Upserting ${language} translation for post ${blogPostId}:`, translationData);

  // First check if a translation already exists
  const { data: existingTranslation, error: fetchError } = await supabase
    .from('blog_translations')
    .select()
    .eq('blog_post_id', blogPostId)
    .eq('language', language)
    .maybeSingle();

  if (fetchError) {
    console.error(`Error checking for existing ${language} translation:`, fetchError);
    throw new Error(`Error checking for existing translation: ${fetchError.message}`);
  }

  const translationRecord: NewBlogTranslation = {
    blog_post_id: blogPostId,
    language,
    title: translationData.title,
    excerpt: translationData.excerpt,
    content: translationData.content
  };

  if (existingTranslation) {
    // Update existing translation
    console.log(`Updating existing ${language} translation with ID ${existingTranslation.id}`);
    const { error: updateError } = await supabase
      .from('blog_translations')
      .update(translationRecord)
      .eq('id', existingTranslation.id);

    if (updateError) {
      console.error(`Error updating ${language} translation:`, updateError);
      throw new Error(`Failed to update translation: ${updateError.message}`);
    }
  } else {
    // Insert new translation
    console.log(`Creating new ${language} translation for post ${blogPostId}`);
    const { error: insertError } = await supabase
      .from('blog_translations')
      .insert(translationRecord);

    if (insertError) {
      console.error(`Error creating ${language} translation:`, insertError);
      throw new Error(`Failed to create translation: ${insertError.message}`);
    }
  }
};

/**
 * Get all translations for a blog post
 */
export const getBlogTranslations = async (blogPostId: string): Promise<TranslationFormData> => {
  console.log("Fetching translations for post:", blogPostId);
  
  const result: TranslationFormData = {
    fr: { title: "", excerpt: "", content: "" },
    es: { title: "", excerpt: "", content: "" }
  };

  try {
    const { data, error } = await supabase
      .from('blog_translations')
      .select('*')
      .eq('blog_post_id', blogPostId);

    if (error) {
      console.error("Error fetching translations:", error);
      throw new Error(`Failed to fetch translations: ${error.message}`);
    }

    // Process the translations and organize them by language
    if (data && data.length > 0) {
      data.forEach((translation: BlogTranslation) => {
        if (translation.language === 'fr' || translation.language === 'es') {
          result[translation.language] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content
          };
        }
      });
    }

    return result;
  } catch (error) {
    console.error("Error in getBlogTranslations:", error);
    return result; // Return empty translations on error
  }
};
