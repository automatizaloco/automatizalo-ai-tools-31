
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
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
    console.log("Fetching contact info from Supabase...");
    
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned by query"
      console.error("Error in Supabase query:", error);
      throw error;
    }

    console.log("Fetched contact info:", data);
    
    // Default contact info
    const defaultInfo: ContactInfo = {
      phone: '+57 3192963363',
      email: 'contact@automatizalo.co',
      address: '123 AI Street, Tech City, TC 12345',
      website: 'https://automatizalo.co',
      whatsapp: '+57 3192963363'
    };
    
    if (!data) {
      console.log("No contact info found in database, using defaults");
      // Try to create a default record if one doesn't exist
      try {
        const { error: insertError } = await supabase
          .from('contact_info')
          .insert({
            phone: defaultInfo.phone,
            email: defaultInfo.email,
            address: defaultInfo.address,
            website: defaultInfo.website
          });
        
        if (insertError) {
          console.error("Error creating default contact info:", insertError);
        }
      } catch (insertError) {
        console.error("Error creating default contact info:", insertError);
      }
      
      return defaultInfo;
    }
    
    // Create ContactInfo object with whatsapp added separately since it's not in the DB
    return {
      phone: data.phone || defaultInfo.phone,
      email: data.email || defaultInfo.email,
      address: data.address || defaultInfo.address,
      website: data.website || defaultInfo.website,
      whatsapp: '+57 3192963363' // Always use this WhatsApp number
    };
  } catch (error: any) {
    console.error("Error fetching contact information:", error);
    // Return default values on error
    toast.error(handleSupabaseError(error, "Failed to load contact information. Using default values."));
    return {
      phone: '+57 3192963363',
      email: 'contact@automatizalo.co',
      address: '123 AI Street, Tech City, TC 12345',
      website: 'https://automatizalo.co',
      whatsapp: '+57 3192963363'
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
    const { data: existingData, error: queryError } = await supabase
      .from('contact_info')
      .select('id')
      .maybeSingle();
    
    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Error checking existing contact info:', queryError);
      throw new Error(queryError.message);
    }
    
    let result;
    
    if (existingData?.id) {
      // Update the record
      result = await supabase
        .from('contact_info')
        .update(contactInfoForDB)
        .eq('id', existingData.id);
    } else {
      // Create a new record if none exists
      result = await supabase
        .from('contact_info')
        .insert(contactInfoForDB);
    }
    
    if (result.error) {
      console.error('Error updating contact info:', result.error);
      throw new Error(result.error.message);
    }
    
    console.log("Contact info updated successfully");
  } catch (err) {
    console.error('Failed to update contact info:', err);
    toast.error(handleSupabaseError(err, "Failed to update contact information."));
    throw err;
  }
};
