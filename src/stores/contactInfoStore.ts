
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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

export const useContactInfo = create<ContactInfoState>((set) => ({
  contactInfo: defaultContactInfo,
  loading: false,
  error: null,
  
  fetchContactInfo: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching contact info:', error);
        set({ error: error.message, loading: false });
        return;
      }
      
      if (data) {
        // Ensure website is set even if it's null in the database
        const contactInfo = {
          ...data as ContactInfo,
          website: data.website || defaultContactInfo.website,
          // Add whatsapp property which doesn't exist in the database
          whatsapp: defaultContactInfo.whatsapp
        };
        
        set({
          contactInfo,
          loading: false,
        });
      } else {
        // Set default values if no data found
        set({
          contactInfo: defaultContactInfo,
          loading: false,
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ 
        error: 'Failed to fetch contact info',
        loading: false,
        contactInfo: defaultContactInfo
      });
    }
  },
  
  updateContactInfo: async (info: ContactInfo) => {
    try {
      set({ loading: true, error: null });
      
      // Check if we have an existing record
      const { data: existingData } = await supabase
        .from('contact_info')
        .select('id')
        .maybeSingle();
      
      // Remove whatsapp from the data to be sent to the database
      const { whatsapp, ...contactInfoForDB } = info;
      
      let result;
      
      if (existingData?.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('contact_info')
          .update(contactInfoForDB)
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating contact info:', error);
          set({ error: error.message, loading: false });
          return;
        }
        
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('contact_info')
          .insert(contactInfoForDB)
          .select()
          .single();
        
        if (error) {
          console.error('Error creating contact info:', error);
          set({ error: error.message, loading: false });
          return;
        }
        
        result = data;
      }
      
      // Add whatsapp back to the result since it's not in the DB
      const updatedResult = {
        ...result as ContactInfo,
        whatsapp: info.whatsapp || defaultContactInfo.whatsapp
      };
      
      set({ contactInfo: updatedResult, loading: false });
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ error: 'Failed to update contact info', loading: false });
    }
  }
}));
