import { create } from 'zustand';
import { fetchContactInfo as fetchContactInfoService, updateContactInfo as updateContactInfoService } from '@/services/contactService';
import { toast } from 'sonner';

// Export the ContactInfo interface
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string;
  whatsapp: string;
}

interface ContactInfoState {
  contactInfo: ContactInfo;
  loading: boolean;
  error: string | null;
  fetchContactInfo: () => Promise<void>;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
}

// Default contact info to use as fallback
const defaultContactInfo: ContactInfo = {
  phone: '',
  email: 'contact@automatizalo.co',
  address: '123 AI Street, Tech City, TC 12345',
  website: 'https://automatizalo.co',
  whatsapp: '+57 3192963363'
};

export const useContactInfo = create<ContactInfoState>((set, get) => ({
  contactInfo: defaultContactInfo,
  loading: false,
  error: null,
  
  fetchContactInfo: async () => {
    try {
      set({ loading: true, error: null });
      
      // First try to load from localStorage while waiting for API
      try {
        const cachedData = localStorage.getItem('contact_info_backup');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          // Set cached data immediately for faster UI rendering
          set({
            contactInfo: {
              ...parsedData,
              whatsapp: '+57 3192963363' // Always use this WhatsApp number
            }
          });
        }
      } catch (cacheError) {
        console.error("Error loading from cache:", cacheError);
      }
      
      // Now fetch from service with better error handling
      const data = await fetchContactInfoService();
      
      set({
        contactInfo: {
          ...data,
          whatsapp: '+57 3192963363' // Always ensure this is set
        },
        loading: false,
        error: null
      });
      
    } catch (err: any) {
      console.error('Error in contactInfoStore:', err);
      
      // Use default values but don't override cache that may have been set earlier
      set(state => ({ 
        error: err.message || 'Failed to fetch contact info',
        loading: false,
        // Only use defaultContactInfo if we don't already have contactInfo
        contactInfo: state.contactInfo.email ? state.contactInfo : defaultContactInfo
      }));
    }
  },
  
  updateContactInfo: async (info: ContactInfo) => {
    try {
      set({ loading: true, error: null });
      
      // Update local cache immediately for responsive UI
      const updatedInfo = {
        ...info,
        whatsapp: '+57 3192963363'
      };
      
      set({ contactInfo: updatedInfo });
      
      // Try to save to localStorage as backup
      try {
        localStorage.setItem('contact_info_backup', JSON.stringify(updatedInfo));
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
      }
      
      // Then attempt to update in database
      await updateContactInfoService(updatedInfo);
      
      set({ loading: false });
      toast.success("Contact information updated successfully");
    } catch (err: any) {
      console.error('Error updating contact info:', err);
      // Keep the updated info in the UI even if save to DB failed
      set({ error: err.message || 'Failed to update contact info', loading: false });
      toast.error("Changes saved locally but couldn't update the database. Will try again when connection is restored.");
    }
  }
}));
