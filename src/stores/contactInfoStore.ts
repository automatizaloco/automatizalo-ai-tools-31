import { useState, useEffect } from 'react';
import { fetchContactInfo, updateContactInfo } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string;
}

// Default contact information (used while loading)
const defaultContactInfo: ContactInfo = {
  phone: "+1 (555) 123-4567",
  email: "contact@automatizalo.co",
  address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
  website: "https://automatizalo.co"
};

// React hook to use contact information
export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load contact information from Supabase
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        setLoading(true);
        const data = await fetchContactInfo();
        
        // Only update state if we have valid data
        if (data && Object.keys(data).length > 0) {
          console.log("Contact info loaded from database:", data);
          setContactInfo(data);
        } else {
          console.log("No contact info found in database, using defaults");
        }
        setError(null);
      } catch (error) {
        console.error("Error loading contact information:", error);
        setError("Failed to load contact information");
        // Keep using default values on error
      } finally {
        setLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  // Update contact information in Supabase
  const updateContactInfoData = async (newInfo: Partial<ContactInfo>) => {
    try {
      setUpdating(true);
      
      // Then update the database
      const updatedInfo = await updateContactInfo(newInfo);
      
      // Update state with the returned data from the server
      setContactInfo(prevInfo => ({ ...prevInfo, ...updatedInfo }));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('contactInfoUpdated', { detail: updatedInfo }));
      toast.success("Contact information updated successfully");
      return updatedInfo;
    } catch (error) {
      console.error("Error saving contact information:", error);
      toast.error("Failed to update contact information");
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return { 
    contactInfo, 
    updateContactInfo: updateContactInfoData, 
    loading,
    updating,
    error
  };
};
