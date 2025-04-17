import { create } from 'zustand';
import { fetchContactInfo as fetchContactInfoService, updateContactInfo as updateContactInfoService, ContactInfo } from '@/services/contactService';
import { toast } from 'sonner';

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
      
      const data = await fetchContactInfoService();
      
      if (data) {
        // Make sure whatsapp is set, defaulting to the new WhatsApp number if it's not
        const contactInfo: ContactInfo = {
          ...data,
          whatsapp: '+57 3192963363' // Always use this WhatsApp number
        };
        
        set({
          contactInfo,
          loading: false,
        });
        
        console.log('Contact info fetched successfully:', contactInfo);
      } else {
        // Set default values if no data found
        set({
          contactInfo: defaultContactInfo,
          loading: false,
        });
        console.log('No contact info found, using defaults:', defaultContactInfo);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ 
        error: 'Failed to fetch contact info',
        loading: false,
        contactInfo: defaultContactInfo
      });
      toast.error("Failed to load contact information. Using default values.");
    }
  },
  
  updateContactInfo: async (info: ContactInfo) => {
    try {
      set({ loading: true, error: null });
      
      // Always ensure WhatsApp is set to the correct number
      const updatedInfo = {
        ...info,
        whatsapp: '+57 3192963363'
      };
      
      await updateContactInfoService(updatedInfo);
      
      set({ 
        contactInfo: updatedInfo, 
        loading: false 
      });

      console.log('Contact info updated successfully in the store:', updatedInfo);
      toast.success("Contact information updated successfully");
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ error: 'Failed to update contact info', loading: false });
      toast.error("Failed to update contact information");
    }
  }
}));
