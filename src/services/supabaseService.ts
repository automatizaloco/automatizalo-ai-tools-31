
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
    
    if (!data) return null;
    
    // Set default values for missing fields
    const contactInfo: ContactInfo = {
      phone: data.phone || '+1 (555) 123-4567',
      email: data.email || 'contact@automatizalo.co',
      address: data.address || '123 AI Street, Tech City, TC 12345',
      website: data.website || 'https://automatizalo.co',
      whatsapp: data.whatsapp || '+1 (555) 123-4567'
    };
    
    return contactInfo;
  } catch (error: any) {
    console.error("Error fetching contact information:", error);
    throw new Error(`Failed to fetch contact information: ${error.message}`);
  }
};

/**
 * Update contact information
 */
export const updateContactInfo = async (info: ContactInfo): Promise<ContactInfo> => {
  try {
    console.log("Updating contact info with:", info);
    
    const { data: existingData, error: fetchError } = await supabase
      .from('contact_info')
      .select('id')
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing contact info:", fetchError);
      throw fetchError;
    }
    
    // Prepare the data to match the database schema
    const contactData = {
      phone: info.phone,
      email: info.email,
      address: info.address,
      website: info.website || 'https://automatizalo.co' // Ensure website is never null
    };
    
    let result;
    
    if (existingData?.id) {
      // Update existing record
      console.log("Updating existing record with ID:", existingData.id);
      const { data, error } = await supabase
        .from('contact_info')
        .update(contactData)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating contact info:", error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new record
      console.log("Inserting new contact info:", contactData);
      const { data, error } = await supabase
        .from('contact_info')
        .insert(contactData)
        .select()
        .single();
      
      if (error) {
        console.error("Error inserting contact info:", error);
        throw error;
      }
      
      result = data;
    }
    
    // Add whatsapp back to the result since it's not in the DB
    return {
      ...result as ContactInfo,
      whatsapp: info.whatsapp || '+1 (555) 123-4567'
    };
  } catch (error: any) {
    console.error("Error updating contact information:", error);
    throw new Error(`Failed to update contact information: ${error.message}`);
  }
};
