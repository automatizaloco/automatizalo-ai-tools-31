
import { supabase } from "@/integrations/supabase/client";
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
