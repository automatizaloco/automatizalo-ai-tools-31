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
    console.log("Updating contact info with:", info);
    
    const { data: existingData, error: fetchError } = await supabase
      .from('contact_info')
      .select('*')
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error checking existing contact info:", fetchError);
      throw fetchError;
    }

    // Default contact information
    const defaultContactInfo = {
      phone: "+1 (555) 123-4567",
      email: "contact@automatizalo.co",
      address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
      website: "https://automatizalo.co"
    };

    let result;
    
    if (existingData) {
      // Update existing record with partial data
      console.log("Updating existing record with ID:", existingData.id);
      const { data, error } = await supabase
        .from('contact_info')
        .update(info)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating contact info:", error);
        throw error;
      }
      
      result = data;
    } else {
      // For new records, ensure all required fields are present
      const completeContactInfo = {
        ...defaultContactInfo,
        ...info
      };
      
      console.log("Inserting new contact info:", completeContactInfo);
      const { data, error } = await supabase
        .from('contact_info')
        .insert([completeContactInfo])
        .select()
        .single();
      
      if (error) {
        console.error("Error inserting contact info:", error);
        throw error;
      }
      
      result = data;
    }
    
    if (!result) {
      throw new Error('No data returned after operation');
    }
    
    return result as ContactInfo;
  } catch (error: any) {
    console.error("Error updating contact information:", error);
    throw new Error(`Failed to update contact information: ${error.message}`);
  }
};
