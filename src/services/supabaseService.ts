
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
    throw new Error(`Failed to fetch contact information: ${error.message}`);
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
    throw err;
  }
};
