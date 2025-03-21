
import { create } from 'zustand';
import { fetchContactInfo as fetchContactInfoService, updateContactInfo as updateContactInfoService } from '@/services/supabaseService';
import { toast } from 'sonner';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string; // Required to match DB schema
  whatsapp?: string;
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
  phone: '+1 (555) 123-4567',
  email: 'contact@automatizalo.co',
  address: '123 AI Street, Tech City, TC 12345',
  website: 'https://automatizalo.co',
  whatsapp: '+1 (555) 123-4567'
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
        // Make sure whatsapp is set, defaulting to phone if it's not
        const contactInfo: ContactInfo = {
          ...data,
          whatsapp: data.whatsapp || data.phone
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
      
      // Make sure whatsapp is set, defaulting to phone if not explicitly set
      const updatedInfo = {
        ...info,
        whatsapp: info.whatsapp || info.phone
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
