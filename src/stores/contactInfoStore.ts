
import { useState, useEffect } from 'react';
import { fetchContactInfo, updateContactInfo } from '@/services/supabaseService';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string;
}

// Default contact information (used while loading)
const defaultContactInfo: ContactInfo = {
  phone: "",
  email: "",
  address: "",
  website: ""
};

// React hook to use contact information
export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);

  // Load contact information from Supabase
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await fetchContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error("Error loading contact information:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  // Update contact information in Supabase
  const updateContactInfoData = async (newInfo: Partial<ContactInfo>) => {
    try {
      const updatedInfo = await updateContactInfo(newInfo);
      setContactInfo(prevInfo => ({ ...prevInfo, ...updatedInfo }));
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('contactInfoUpdated', { detail: updatedInfo }));
    } catch (error) {
      console.error("Error saving contact information:", error);
      throw error;
    }
  };

  return { contactInfo, updateContactInfo: updateContactInfoData, loading };
};
