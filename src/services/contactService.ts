
import { supabase, handleSupabaseError, retryOperation } from "@/integrations/supabase/client";
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

// Local cache to store contact info
let contactInfoCache: ContactInfo | null = null;
let cacheTimestamp: number = 0;
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

/**
 * Default contact info to use as fallback
 */
const defaultContactInfo: ContactInfo = {
  phone: '+57 3192963363',
  email: 'contact@automatizalo.co',
  address: '123 AI Street, Tech City, TC 12345',
  website: 'https://automatizalo.co',
  whatsapp: '+57 3192963363'
};

/**
 * Fetch contact information
 */
export const fetchContactInfo = async (): Promise<ContactInfo> => {
  try {
    // Check if we have a valid cached version
    if (contactInfoCache && (Date.now() - cacheTimestamp) < CACHE_EXPIRY) {
      console.log("Using cached contact info");
      return contactInfoCache;
    }
    
    console.log("Fetching contact info from Supabase...");
    
    // First try to fetch from Supabase with retries
    const { data, error } = await retryOperation(
      async () => await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle(),
      3,
      1000
    );

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned by query"
      console.error("Error in Supabase query:", error);
      throw error;
    }

    console.log("Fetched contact info:", data);
    
    // Create ContactInfo object with fetched data or defaults
    const contactInfo: ContactInfo = {
      phone: data?.phone || defaultContactInfo.phone,
      email: data?.email || defaultContactInfo.email,
      address: data?.address || defaultContactInfo.address,
      website: data?.website || defaultContactInfo.website,
      whatsapp: '+57 3192963363' // Always use this WhatsApp number
    };
    
    if (!data) {
      console.log("No contact info found in database, using defaults and creating record");
      // Try to create a default record if one doesn't exist
      try {
        const { error: insertError } = await supabase
          .from('contact_info')
          .insert({
            phone: defaultContactInfo.phone,
            email: defaultContactInfo.email,
            address: defaultContactInfo.address,
            website: defaultContactInfo.website
          });
        
        if (insertError) {
          console.error("Error creating default contact info:", insertError);
        }
      } catch (insertError) {
        console.error("Error creating default contact info:", insertError);
      }
    }
    
    // Update cache
    contactInfoCache = contactInfo;
    cacheTimestamp = Date.now();
    
    return contactInfo;
  } catch (error: any) {
    console.error("Error fetching contact information:", error);
    
    // Return cached version if available, even if expired
    if (contactInfoCache) {
      console.log("Using expired cached contact info due to error");
      toast.error(handleSupabaseError(error, "Failed to update contact information. Using cached values."));
      return contactInfoCache;
    }
    
    // Return default values on error
    toast.error(handleSupabaseError(error, "Failed to load contact information. Using default values."));
    return defaultContactInfo;
  }
};

/**
 * Update contact information
 */
export const updateContactInfo = async (info: ContactInfo): Promise<void> => {
  try {
    console.log("Updating contact info with:", info);
    
    // Update cache immediately for responsive UI
    contactInfoCache = info;
    cacheTimestamp = Date.now();
    
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

/**
 * Clear the contact info cache
 */
export const clearContactInfoCache = (): void => {
  contactInfoCache = null;
  cacheTimestamp = 0;
  console.log("Contact info cache cleared");
};
