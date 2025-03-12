
import { supabase } from '@/integrations/supabase/client';
import { ContactInfo } from '@/stores/contactInfoStore';
import { toast } from 'sonner';

/**
 * Fetch all testimonials
 */
export const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    throw new Error(`Failed to fetch testimonials: ${error.message}`);
  }

  return data || [];
};

/**
 * Create a new testimonial
 */
export const createTestimonial = async (testimonial: { name: string; company: string | null; text: string }) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();

  if (error) {
    console.error("Error creating testimonial:", error);
    throw new Error(`Failed to create testimonial: ${error.message}`);
  }

  return data;
};

/**
 * Update an existing testimonial
 */
export const updateTestimonial = async (id: string, updates: Partial<{ name: string; company: string | null; text: string }>) => {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating testimonial ${id}:`, error);
    throw new Error(`Failed to update testimonial: ${error.message}`);
  }

  return data;
};

/**
 * Delete a testimonial
 */
export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting testimonial ${id}:`, error);
    throw new Error(`Failed to delete testimonial: ${error.message}`);
  }

  return true;
};

/**
 * Fetch contact information
 */
export const fetchContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    // Fetch the first record from contact_info table
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching contact information:", error);
    throw new Error(`Failed to fetch contact information: ${error.message}`);
  }
};

/**
 * Update contact information
 */
export const updateContactInfo = async (info: Partial<ContactInfo>): Promise<ContactInfo> => {
  try {
    // Check if there's existing contact info
    const { data: existingData } = await supabase
      .from('contact_info')
      .select('id')
      .maybeSingle();

    let result;
    
    if (existingData?.id) {
      // Make sure all required fields are included when updating
      const { data: currentData, error: fetchError } = await supabase
        .from('contact_info')
        .select('*')
        .eq('id', existingData.id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      if (!currentData) throw new Error('Could not fetch current contact info');
      
      // Merge current data with updates to ensure all required fields are present
      const updatedInfo = { ...currentData, ...info };
      
      // Update existing record
      const { data, error } = await supabase
        .from('contact_info')
        .update(updatedInfo)
        .eq('id', existingData.id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned after update');
      
      result = data;
    } else {
      // For new records, ensure all required fields are present
      const requiredFields = ['phone', 'email', 'address', 'website'];
      const missingFields = requiredFields.filter(field => !info[field as keyof ContactInfo]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Insert new record
      const { data, error } = await supabase
        .from('contact_info')
        .insert(info as ContactInfo)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return result;
  } catch (error: any) {
    console.error("Error updating contact information:", error);
    throw new Error(`Failed to update contact information: ${error.message}`);
  }
};
