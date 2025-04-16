import { supabase } from "@/integrations/supabase/client";
import { translateBlogContent } from "./translationService";
import { toast } from "sonner";

/**
 * Interface for contact information
 */
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string;
  whatsapp: string;
}

/**
 * Fetch all testimonials
 */
export const fetchTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

/**
 * Fetch testimonial translations
 */
export const fetchTestimonialTranslations = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials_translations')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonial translations:', error);
    throw error;
  }
};

/**
 * Create a new testimonial with auto-translation
 */
export const createTestimonial = async (testimonial: { name: string; company: string | null; text: string; }) => {
  try {
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
      throw error;
    }
    
    // Auto-translate the testimonial to other languages
    if (data) {
      autoTranslateTestimonial(data.id, testimonial.text, testimonial.name);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
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
 * Fetch contact information
 */
export const fetchContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    console.log("Fetching contact info...");
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error("Error in fetchContactInfo:", error);
      throw error;
    }

    console.log("Fetched contact info:", data);
    
    if (!data) return null;
    
    // Create ContactInfo object with whatsapp added separately since it's not in the DB
    const contactInfo: ContactInfo = {
      phone: data.phone || '+1 (555) 123-4567',
      email: data.email || 'contact@automatizalo.co',
      address: data.address || '123 AI Street, Tech City, TC 12345',
      website: data.website || 'https://automatizalo.co',
      whatsapp: data.phone || '+1 (555) 123-4567' // Use phone number for whatsapp if not explicitly set
    };
    
    return contactInfo;
  } catch (error: any) {
    console.error("Error fetching contact information:", error);
    toast.error("Failed to load contact information. Using default values.");
    // Return default values on error
    return {
      phone: '+1 (555) 123-4567',
      email: 'contact@automatizalo.co',
      address: '123 AI Street, Tech City, TC 12345',
      website: 'https://automatizalo.co',
      whatsapp: '+1 (555) 123-4567'
    };
  }
};

/**
 * Update contact information
 */
export const updateContactInfo = async (info: ContactInfo): Promise<void> => {
  try {
    console.log("Updating contact info with:", info);
    
    // Create a new object without the whatsapp property for the database
    // This fixes the TypeScript error where whatsapp doesn't exist in DB schema
    const contactInfoForDB = {
      phone: info.phone,
      email: info.email,
      address: info.address,
      website: info.website
    };
    
    // Check if we have an existing record
    const { data: existingData } = await supabase
      .from('contact_info')
      .select('id')
      .maybeSingle();
    
    if (existingData?.id) {
      // Update the record
      const { error } = await supabase
        .from('contact_info')
        .update(contactInfoForDB)
        .eq('id', existingData.id);
      
      if (error) {
        console.error('Error updating contact info:', error);
        throw new Error(error.message);
      }
    } else {
      // Create a new record if none exists
      const { error } = await supabase
        .from('contact_info')
        .insert(contactInfoForDB);
      
      if (error) {
        console.error('Error inserting contact info:', error);
        throw new Error(error.message);
      }
    }
    
    console.log("Contact info updated successfully");
  } catch (err) {
    console.error('Failed to update contact info:', err);
    toast.error("Failed to update contact information.");
    throw err;
  }
};
