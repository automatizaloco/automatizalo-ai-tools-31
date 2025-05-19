
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { translateBlogContent } from "@/services/translationService";
import { Loader2, Globe } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { TranslationFormData } from "@/types/form";
import { saveBlogTranslations } from "@/services/blogService";

interface TranslationToolsProps {
  id?: string;
  post?: BlogPost | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  translationData: TranslationFormData;
  setTranslationData: React.Dispatch<React.SetStateAction<TranslationFormData>>;
}

const TranslationTools: React.FC<TranslationToolsProps> = ({ 
  id, 
  post, 
  formData, 
  setFormData,
  translationData,
  setTranslationData
}) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const autoTranslateAll = async () => {
    if (!formData.content || !formData.title || !formData.excerpt) {
      toast.error("Please add content to translate");
      return;
    }

    setIsTranslating(true);

    try {
      // Create a toast to indicate the translation is in progress
      const toastId = toast.loading("Translating content to all languages...");
      let errorOccurred = false;

      try {
        // French translation
        console.log("Starting French translation...");
        const frTranslation = await translateBlogContent(
          formData.content,
          formData.title,
          formData.excerpt,
          'fr'
        );

        // Spanish translation
        console.log("Starting Spanish translation...");
        const esTranslation = await translateBlogContent(
          formData.content,
          formData.title,
          formData.excerpt,
          'es'
        );

        // Check if any translations failed
        if (frTranslation.title.startsWith('[Translation Error]') ||
            esTranslation.title.startsWith('[Translation Error]')) {
          errorOccurred = true;
        }

        // Update the translation data state
        const updatedTranslations = {
          fr: {
            title: frTranslation.title,
            excerpt: frTranslation.excerpt,
            content: frTranslation.content
          },
          es: {
            title: esTranslation.title,
            excerpt: esTranslation.excerpt,
            content: esTranslation.content
          }
        };

        // Update both states to ensure consistency
        setTranslationData(updatedTranslations);
        
        // Also update the form data with the translations
        setFormData(prev => ({
          ...prev,
          translations: updatedTranslations
        }));

        console.log("Translations updated:", updatedTranslations);
      } finally {
        // Always dismiss the loading toast
        toast.dismiss(toastId);
        
        // Show appropriate toast based on result
        if (errorOccurred) {
          toast.warning("Some translations could not be completed. You can try again or edit them manually.");
        } else {
          toast.success("Content translated to all languages");
        }
      }
      
      // Save translations to database if in edit mode
      if (id) {
        await saveTranslations(translationData);
      }
    } catch (error) {
      console.error("Error auto-translating all content:", error);
      toast.error("Failed to translate content to all languages");
    } finally {
      setIsTranslating(false);
    }
  };

  const saveTranslations = async (translations: TranslationFormData) => {
    if (!id) {
      toast.error("Cannot save translations for a post that hasn't been created yet");
      return;
    }
    
    try {
      const savingToast = toast.loading("Saving translations...");
      await saveBlogTranslations(id, translations);
      toast.dismiss(savingToast);
      toast.success("Translations saved successfully");
    } catch (error) {
      console.error("Error saving translations:", error);
      toast.error(`Failed to save translations: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (!id || !post) return null;

  return (
    <Button
      variant="outline"
      onClick={autoTranslateAll}
      disabled={isTranslating}
      className="flex items-center gap-2"
    >
      {isTranslating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Translating...
        </>
      ) : (
        <>
          <Globe className="h-4 w-4" />
          Auto-translate All
        </>
      )}
    </Button>
  );
};

export default TranslationTools;
