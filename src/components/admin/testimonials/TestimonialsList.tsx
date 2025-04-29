
import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import TestimonialItem from '@/components/admin/testimonials/TestimonialItem';
import { Testimonial, TestimonialTranslation } from '@/services/testimonialService';

interface TestimonialsListProps {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: Error | null;
  translations: TestimonialTranslation[];
  onTestimonialChange: (id: string, field: keyof Testimonial, value: string) => void;
  onTranslationChange: (testimonialId: string, language: string, text: string) => void;
  onSaveTranslation: (testimonialId: string, language: string) => void;
  onDeleteTestimonial: (id: string) => void;
  editedTranslations: {[key: string]: {[lang: string]: string}};
  isDeleting: boolean;
  isTranslationUpdating: boolean;
}

const TestimonialsList: React.FC<TestimonialsListProps> = ({
  testimonials,
  isLoading,
  error,
  translations,
  onTestimonialChange,
  onTranslationChange,
  onSaveTranslation,
  onDeleteTestimonial,
  editedTranslations,
  isDeleting,
  isTranslationUpdating
}) => {
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <div>
          <p className="font-medium">Error loading testimonials</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Existing Testimonials</h2>
      
      {testimonials.length > 0 ? (
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <TestimonialItem 
              key={testimonial.id}
              testimonial={testimonial}
              translations={translations}
              onTestimonialChange={onTestimonialChange}
              onTranslationChange={onTranslationChange}
              onSaveTranslation={onSaveTranslation}
              onDeleteTestimonial={onDeleteTestimonial}
              editedTranslations={editedTranslations}
              isDeleting={isDeleting}
              isTranslationUpdating={isTranslationUpdating}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          No testimonials yet. Add your first one above.
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
