import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, retryOperation } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchTestimonials, fetchTestimonialTranslations } from '@/services/testimonialService';

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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Load testimonials from Supabase
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching testimonials in useTestimonials hook...");
        const data = await fetchTestimonials();
        
        if (data && data.length > 0) {
          console.log("Testimonials loaded from database:", data);
          setTestimonials(data);
          
          // Cache testimonials in localStorage for offline access
          try {
            localStorage.setItem('cached_testimonials', JSON.stringify(data));
          } catch (cacheError) {
            console.error("Error caching testimonials:", cacheError);
          }
        } else if (retryCount < maxRetries) {
          // Retry fetching after a delay
          const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(`No testimonials found, retrying in ${retryDelay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, retryDelay);
          
          // Try to load from cache while waiting for retry
          try {
            const cachedData = localStorage.getItem('cached_testimonials');
            if (cachedData) {
              const parsed = JSON.parse(cachedData);
              setTestimonials(parsed);
              console.log("Using cached testimonials while retrying");
              toast.info("Using cached testimonials while connecting to database");
            }
          } catch (cacheError) {
            console.error("Error loading cached testimonials:", cacheError);
          }
        } else {
          // Max retries reached, try to use cached data
          try {
            const cachedData = localStorage.getItem('cached_testimonials');
            if (cachedData) {
              const parsed = JSON.parse(cachedData);
              setTestimonials(parsed);
              toast.info("Using cached testimonials - couldn't connect to database");
            } else {
              // No cached data, show error
              setError("Failed to load testimonials after multiple attempts");
            }
          } catch (cacheError) {
            console.error("Error loading cached testimonials:", cacheError);
            setError("Failed to load testimonials");
          }
        }
      } catch (error: any) {
        console.error("Error loading testimonials:", error);
        setError(handleSupabaseError(error, "Failed to load testimonials"));
        
        // Try to use cached data on error
        try {
          const cachedData = localStorage.getItem('cached_testimonials');
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            setTestimonials(parsed);
            toast.info("Using cached testimonials due to connection error");
          }
        } catch (cacheError) {
          console.error("Error loading cached testimonials:", cacheError);
        }
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
  }, [retryCount]);

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

  // Refresh testimonials
  const refreshTestimonials = async () => {
    setLoading(true);
    setRetryCount(0);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error refreshing testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    testimonials, 
    loading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refreshTestimonials
  };
};
