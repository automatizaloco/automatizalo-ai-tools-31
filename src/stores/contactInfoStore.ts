
import { useState, useEffect, useCallback } from 'react';
import { fetchContactInfo, updateContactInfo } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string;
}

// Default contact information
const defaultContactInfo: ContactInfo = {
  phone: "+1 (555) 123-4567",
  email: "contact@automatizalo.co",
  address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
  website: "https://automatizalo.co"
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load contact information from Supabase
  const loadContactInfo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchContactInfo();
      
      if (data) {
        console.log("Contact info loaded from database:", data);
        setContactInfo(data);
      } else {
        console.log("No contact info found in database, using defaults");
        // If no data exists, create initial record with defaults
        try {
          const initialData = await updateContactInfo(defaultContactInfo);
          setContactInfo(initialData);
        } catch (initError) {
          console.error("Error creating initial contact info:", initError);
          // Still use default values even if we couldn't save them
          setContactInfo(defaultContactInfo);
        }
      }
      setError(null);
    } catch (error) {
      console.error("Error loading contact information:", error);
      setError("Failed to load contact information");
      // Use default values as fallback
      setContactInfo(defaultContactInfo);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load contact info on component mount
  useEffect(() => {
    loadContactInfo();
  }, [loadContactInfo]);

  // Update contact information in Supabase
  const updateContactInfoData = async (newInfo: ContactInfo) => {
    if (updating) {
      console.log("Update already in progress, skipping");
      toast.info("Update in progress, please wait...");
      return;
    }
    
    try {
      setUpdating(true);
      console.log("Updating contact info with:", newInfo);
      
      const updatedInfo = await updateContactInfo(newInfo);
      
      setContactInfo(updatedInfo);
      
      window.dispatchEvent(new CustomEvent('contactInfoUpdated', { detail: updatedInfo }));
      toast.success("Contact information updated successfully");
      
      return updatedInfo;
    } catch (error: any) {
      console.error("Error saving contact information:", error);
      toast.error(`Failed to update contact information: ${error.message}`);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return { 
    contactInfo, 
    updateContactInfo: updateContactInfoData,
    loadContactInfo,
    loading,
    updating,
    error 
  };
};
