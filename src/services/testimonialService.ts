
import { supabase, handleSupabaseError, retryOperation } from "@/integrations/supabase/client";
import { translateBlogContent } from "./translation";
import { toast } from "sonner";

// Define proper types for testimonials and translations
export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  text: string;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TestimonialTranslation {
  id: string;
  testimonial_id: string;
  language: string;
  text: string;
  created_at?: string;
  updated_at?: string;
}

// Local cache for testimonials
let testimonialsCache: Testimonial[] = [];
let testimonialsCacheTimestamp = 0;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all testimonials
 */
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  try {
    // Use cache if available and not expired
    if (testimonialsCache.length > 0 && (Date.now() - testimonialsCacheTimestamp) < CACHE_EXPIRY) {
      console.log("Using cached testimonials");
      return testimonialsCache;
    }
    
    console.log("Fetching testimonials from Supabase...");
    const { data, error } = await retryOperation(
      async () => await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false }),
      3,
      1000
    );
    
    if (error) {
      console.error('Error fetching testimonials:', error);
      if (testimonialsCache.length > 0) {
        toast.error(handleSupabaseError(error, "Failed to refresh testimonials. Using cached data."));
        return testimonialsCache;
      }
      toast.error(handleSupabaseError(error, "Failed to load testimonials"));
      return [];
    }
    
    // Update cache
    testimonialsCache = data || [];
    testimonialsCacheTimestamp = Date.now();
    
    console.log(`Successfully fetched ${data?.length || 0} testimonials`);
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    
    if (testimonialsCache.length > 0) {
      toast.error(handleSupabaseError(error, "Error refreshing testimonials. Using cached data."));
      return testimonialsCache;
    }
    
    toast.error(handleSupabaseError(error, "Failed to load testimonials"));
    return [];
  }
};

/**
 * Fetch testimonial translations
 */
export const fetchTestimonialTranslations = async (): Promise<TestimonialTranslation[]> => {
  try {
    console.log("Fetching testimonial translations from Supabase...");
    const { data, error } = await retryOperation(
      async () => await supabase
        .from('testimonials_translations')
        .select('*'),
      2,
      1000
    );
    
    if (error) {
      console.error('Error fetching testimonial translations:', error);
      toast.error(handleSupabaseError(error, "Failed to load testimonial translations"));
      return [];
    }
    
    console.log(`Successfully fetched ${data?.length || 0} testimonial translations`);
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonial translations:', error);
    toast.error(handleSupabaseError(error, "Failed to load testimonial translations"));
    return [];
  }
};

/**
 * Create a new testimonial with auto-translation
 */
export const createTestimonial = async (testimonial: { name: string; company: string | null; text: string; }) => {
  try {
    console.log("Creating new testimonial:", testimonial);
    
    // First, create the testimonial in English
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: testimonial.name,
        company: testimonial.company,
        text: testimonial.text,
        language: 'en'
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating testimonial:', error);
      toast.error(handleSupabaseError(error, "Failed to create testimonial"));
      throw error;
    }
    
    console.log("Testimonial created successfully:", data);
    
    // Clear cache to ensure fresh data on next fetch
    testimonialsCache = [];
    
    // Auto-translate the testimonial to other languages
    if (data) {
      autoTranslateTestimonial(data.id, testimonial.text, testimonial.name);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    toast.error(handleSupabaseError(error, "Failed to create testimonial"));
    throw error;
  }
};

/**
 * Update an existing testimonial with auto-translation
 */
export const updateTestimonial = async (id: string, updates: Partial<{ name: string; company: string | null; text: string; }>) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .eq('language', 'en') // Only update the English version directly
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    // If text was updated, auto-translate to other languages
    if (updates.text) {
      autoTranslateTestimonial(id, updates.text, updates.name || '');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

/**
 * Update a testimonial translation directly
 */
export const updateTestimonialTranslation = async (
  testimonialId: string,
  language: string, 
  updatedText: string
) => {
  try {
    const { data, error } = await supabase
      .from('testimonials_translations')
      .update({
        text: updatedText,
        updated_at: new Date().toISOString()
      })
      .eq('testimonial_id', testimonialId)
      .eq('language', language)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success(`${language === 'fr' ? 'French' : 'Spanish'} translation updated successfully`);
    return data;
  } catch (error) {
    console.error(`Error updating ${language} translation:`, error);
    toast.error(`Failed to update translation: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Delete a testimonial and its translations
 */
export const deleteTestimonial = async (id: string) => {
  try {
    // First delete translations
    const { error: translationError } = await supabase
      .from('testimonials_translations')
      .delete()
      .eq('testimonial_id', id);
      
    if (translationError) {
      console.error('Error deleting testimonial translations:', translationError);
      // Continue with deleting the main testimonial even if translations deletion fails
    }
    
    // Then delete the main testimonial
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

/**
 * Helper function to auto-translate testimonials
 */
const autoTranslateTestimonial = async (id: string, text: string, name: string) => {
  try {
    const languages = ['fr', 'es'];
    
    for (const lang of languages) {
      try {
        console.log(`Translating testimonial ${id} to ${lang}...`);
        // Create dummy content for translation API
        const dummyTitle = `Testimonial by ${name}`;
        const dummyExcerpt = "Testimonial excerpt";
        
        const translated = await translateBlogContent(
          text,
          dummyTitle,
          dummyExcerpt,
          lang as 'fr' | 'es'
        );
        
        // Update or create the translated testimonial
        const { error } = await supabase
          .from('testimonials_translations')
          .upsert({
            testimonial_id: id,
            language: lang,
            text: translated.content,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'testimonial_id,language'
          });
          
        if (error) {
          console.error(`Error storing ${lang} translation:`, error);
          continue;
        }
        
        console.log(`Testimonial translated to ${lang} successfully`);
      } catch (error) {
        console.error(`Error translating testimonial to ${lang}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in autoTranslateTestimonial:', error);
  }
};

/**
 * Clear the testimonials cache
 */
export const clearTestimonialsCache = (): void => {
  testimonialsCache = [];
  testimonialsCacheTimestamp = 0;
  console.log("Testimonials cache cleared");
};
