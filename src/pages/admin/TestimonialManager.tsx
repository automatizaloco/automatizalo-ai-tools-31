
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { AlertTriangle, Loader2 } from "lucide-react";
import { 
  fetchTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  fetchTestimonialTranslations,
  updateTestimonialTranslation,
  Testimonial,
  TestimonialTranslation
} from "@/services/testimonialService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import TestimonialItem from "@/components/admin/testimonials/TestimonialItem";
import { useIsMobile } from "@/hooks/use-mobile";

const TestimonialManager = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // State to track edited translations
  const [editedTranslations, setEditedTranslations] = useState<{[key: string]: {[lang: string]: string}}>({});

  // Fetch testimonials from Supabase
  const { data: testimonials = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    // Only attempt to fetch if the user is authenticated
    enabled: isAuthenticated,
  });
  
  // Fetch translations
  const { data: translations = [], isLoading: translationsLoading } = useQuery({
    queryKey: ['testimonial-translations'],
    queryFn: fetchTestimonialTranslations,
    enabled: isAuthenticated && testimonials.length > 0,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (testimonial: Omit<Testimonial, 'id'>) => createTestimonial(testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial-translations'] });
      toast.success("Testimonial added successfully!");
    },
    onError: (error: any) => {
      console.error('Error creating testimonial:', error);
      toast.error(`Failed to add testimonial: ${error.message || "Unknown error"}`);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Testimonial> }) => 
      updateTestimonial(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial-translations'] });
      toast.success("Testimonial updated successfully!");
    },
    onError: (error: any) => {
      console.error('Error updating testimonial:', error);
      toast.error(`Failed to update testimonial: ${error.message || "Unknown error"}`);
    }
  });

  // Update translation mutation
  const updateTranslationMutation = useMutation({
    mutationFn: ({ testimonialId, language, text }: { testimonialId: string; language: string; text: string }) => 
      updateTestimonialTranslation(testimonialId, language, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonial-translations'] });
    },
    onError: (error: any) => {
      console.error('Error updating translation:', error);
      toast.error(`Failed to update translation: ${error.message || "Unknown error"}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial-translations'] });
      toast.success("Testimonial deleted successfully!");
    },
    onError: (error: any) => {
      console.error('Error deleting testimonial:', error);
      toast.error(`Failed to delete testimonial: ${error.message || "Unknown error"}`);
    }
  });

  const handleTestimonialChange = (id: string, field: keyof Testimonial, value: string) => {
    updateMutation.mutate({ 
      id, 
      updates: { [field]: value } 
    });
  };

  const handleTranslationChange = (testimonialId: string, language: string, text: string) => {
    // Store the edited translation in state
    setEditedTranslations(prev => ({
      ...prev,
      [testimonialId]: {
        ...prev[testimonialId],
        [language]: text
      }
    }));
  };

  const handleSaveTranslation = (testimonialId: string, language: string) => {
    const translationText = editedTranslations[testimonialId]?.[language];
    if (!translationText) return;
    
    updateTranslationMutation.mutate({
      testimonialId,
      language,
      text: translationText
    });
  };

  const handleAddTestimonial = (newTestimonial: Omit<Testimonial, 'id'>) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to add testimonials");
      return;
    }

    if (!newTestimonial.name || !newTestimonial.text) {
      toast.error("Please fill in at least name and testimonial text");
      return;
    }
    
    createMutation.mutate(newTestimonial);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to delete testimonials");
      return;
    }
    
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Please login to access the testimonial manager");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Testimonial Manager</h1>
        <p className="text-gray-600 mt-2">Add and edit client testimonials</p>
        
        {user && (
          <div className="mt-2 text-sm text-green-600">
            Logged in as: {user.email}
          </div>
        )}
      </div>
      
      <div className={`grid grid-cols-1 gap-8 ${isMobile ? 'mx-0' : 'max-w-4xl mx-auto'}`}>
        <TestimonialForm 
          onSubmit={handleAddTestimonial} 
          isPending={createMutation.isPending} 
        />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing Testimonials</h2>
          
          {fetchError ? (
            <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Error loading testimonials</p>
                <p className="text-sm">{(fetchError as Error).message}</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              {testimonials.length > 0 ? (
                <div className="space-y-6">
                  {testimonials.map((testimonial) => (
                    <TestimonialItem 
                      key={testimonial.id}
                      testimonial={testimonial}
                      translations={translations}
                      onTestimonialChange={handleTestimonialChange}
                      onTranslationChange={handleTranslationChange}
                      onSaveTranslation={handleSaveTranslation}
                      onDeleteTestimonial={handleDeleteTestimonial}
                      editedTranslations={editedTranslations}
                      isDeleting={deleteMutation.isPending}
                      isTranslationUpdating={updateTranslationMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No testimonials yet. Add your first one above.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialManager;
