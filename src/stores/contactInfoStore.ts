
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
}

interface ContactInfoState {
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
  fetchContactInfo: () => Promise<void>;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
}

export const useContactInfo = create<ContactInfoState>((set) => ({
  contactInfo: null,
  loading: false,
  error: null,
  
  fetchContactInfo: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'contact_info')
        .single();
      
      if (error) {
        console.error('Error fetching contact info:', error);
        set({ error: error.message, loading: false });
        return;
      }
      
      if (data && data.value) {
        set({
          contactInfo: typeof data.value === 'string' ? JSON.parse(data.value) : data.value,
          loading: false,
        });
      } else {
        // Set default values if no data found
        set({
          contactInfo: {
            phone: '+1 (555) 123-4567',
            email: 'contact@automatizalo.co',
            address: '123 AI Street, Tech City, TC 12345',
            whatsapp: '+1 (555) 123-4567'
          },
          loading: false,
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ 
        error: 'Failed to fetch contact info',
        loading: false,
        contactInfo: {
          phone: '+1 (555) 123-4567',
          email: 'contact@automatizalo.co',
          address: '123 AI Street, Tech City, TC 12345',
          whatsapp: '+1 (555) 123-4567'
        }
      });
    }
  },
  
  updateContactInfo: async (info: ContactInfo) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'contact_info',
          value: info
        });
      
      if (error) {
        console.error('Error updating contact info:', error);
        set({ error: error.message, loading: false });
        return;
      }
      
      set({ contactInfo: info, loading: false });
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ error: 'Failed to update contact info', loading: false });
    }
  }
}));
