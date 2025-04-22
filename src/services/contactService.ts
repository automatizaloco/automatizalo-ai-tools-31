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

// Local cache to store contact info with longer expiry
let contactInfoCache: ContactInfo | null = null;
let cacheTimestamp: number = 0;
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

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
 * Fetch contact information with improved error handling
 */
export const fetchContactInfo = async (): Promise<ContactInfo> => {
  try {
    // Check if we have a valid cached version
    if (contactInfoCache && (Date.now() - cacheTimestamp) < CACHE_EXPIRY) {
      console.log("Using cached contact info");
      return contactInfoCache;
    }
    
    console.log("Fetching contact info from Supabase...");
    
    // First try to fetch from Supabase with enhanced retries
    const { data, error } = await retryOperation(
      async () => await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle(),
      5,  // Increased retry attempts
      1000
    );

    if (error) {
      console.error("Error in Supabase query:", error);
      
      // Try to load from localStorage if available
      try {
        const localStorageData = localStorage.getItem('contact_info_backup');
        if (localStorageData) {
          const parsedData = JSON.parse(localStorageData);
          console.log("Using contact info from localStorage due to database error");
          toast.error(handleSupabaseError(error, "Database error. Using locally cached data."));
          
          // Still update the in-memory cache
          contactInfoCache = {
            ...parsedData,
            whatsapp: '+57 3192963363' // Always use this WhatsApp number
          };
          cacheTimestamp = Date.now();
          
          return contactInfoCache;
        }
      } catch (localStorageError) {
        console.error("Error accessing localStorage:", localStorageError);
      }
      
      // If no localStorage data, throw the original error to use defaults
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
        await retryOperation(async () => {
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
          return true;
        }, 3);
      } catch (insertError) {
        console.error("Error creating default contact info:", insertError);
      }
    }
    
    // Update cache and localStorage
    contactInfoCache = contactInfo;
    cacheTimestamp = Date.now();
    
    try {
      localStorage.setItem('contact_info_backup', JSON.stringify(contactInfo));
    } catch (storageError) {
      console.error("Error saving to localStorage:", storageError);
    }
    
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
    
    // Try to save default values to localStorage for future use
    try {
      localStorage.setItem('contact_info_backup', JSON.stringify(defaultContactInfo));
    } catch (storageError) {
      console.error("Error saving to localStorage:", storageError);
    }
    
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
