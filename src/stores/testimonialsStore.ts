
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  text: string;
}

// React hook to use testimonials
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load testimonials from Supabase
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching testimonials in useTestimonials hook...");
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error in Supabase query:", error);
          throw error;
        }
        
        console.log("Testimonials loaded from database:", data);
        setTestimonials(data || []);
      } catch (error: any) {
        console.error("Error loading testimonials:", error);
        setError("Failed to load testimonials");
        toast.error("Failed to load testimonials. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
    
    // Listen for testimonial updates
    const handleTestimonialUpdated = (event: CustomEvent) => {
      setTestimonials(prev => 
        prev.map(item => item.id === event.detail.id ? event.detail : item)
      );
    };
    
    window.addEventListener('testimonialUpdated', handleTestimonialUpdated as EventListener);
    
    return () => {
      window.removeEventListener('testimonialUpdated', handleTestimonialUpdated as EventListener);
    };
  }, []);

  // Create a new testimonial
  const createTestimonial = async (newTestimonial: Omit<Testimonial, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(newTestimonial)
        .select();
      
      if (error) throw error;
      
      setTestimonials(prev => [data[0], ...prev]);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('testimonialCreated', { detail: data[0] }));
      
      toast.success("Testimonial added successfully");
      return data[0];
    } catch (error: any) {
      console.error("Error creating testimonial:", error);
      toast.error("Failed to add testimonial");
      throw error;
    }
  };

  // Update an existing testimonial
  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setTestimonials(prev => 
        prev.map(testimonial => testimonial.id === id ? data[0] : testimonial)
      );
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('testimonialUpdated', { detail: data[0] }));
      
      toast.success("Testimonial updated successfully");
      return data[0];
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      toast.error("Failed to update testimonial");
      throw error;
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('testimonialDeleted', { detail: { id } }));
      
      toast.success("Testimonial deleted successfully");
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
      throw error;
    }
  };

  return { 
    testimonials, 
    loading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
};
