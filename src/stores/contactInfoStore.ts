
import { useState, useEffect } from 'react';

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

// Get contact information from localStorage or use defaults
export const getContactInfo = (): ContactInfo => {
  try {
    const savedContactInfo = localStorage.getItem('contactInfo');
    if (savedContactInfo) {
      return JSON.parse(savedContactInfo);
    }
  } catch (error) {
    console.error("Error loading contact information:", error);
  }
  return defaultContactInfo;
};

// Save contact information to localStorage
export const saveContactInfo = (info: ContactInfo): void => {
  try {
    localStorage.setItem('contactInfo', JSON.stringify(info));
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('contactInfoUpdated', { detail: info }));
  } catch (error) {
    console.error("Error saving contact information:", error);
  }
};

// React hook to use contact information
export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(getContactInfo());

  // Update contact information and save to localStorage
  const updateContactInfo = (newInfo: Partial<ContactInfo>) => {
    const updatedInfo = { ...contactInfo, ...newInfo };
    setContactInfo(updatedInfo);
    saveContactInfo(updatedInfo);
  };

  // Listen for updates from other components
  useEffect(() => {
    const handleContactInfoUpdated = (event: CustomEvent<ContactInfo>) => {
      setContactInfo(event.detail);
    };

    window.addEventListener('contactInfoUpdated', handleContactInfoUpdated as EventListener);
    return () => {
      window.removeEventListener('contactInfoUpdated', handleContactInfoUpdated as EventListener);
    };
  }, []);

  return { contactInfo, updateContactInfo };
};
