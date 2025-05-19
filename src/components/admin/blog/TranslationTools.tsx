
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
      
      // Track if any translation failed
      let translationFailed = false;
      const updatedTranslations = { ...translationData };
      
      // Try French translation
      try {
        console.log("Starting French translation...");
        const frTranslation = await translateBlogContent(
          formData.content,
          formData.title,
          formData.excerpt,
          'fr'
        );
        
        // Only update if we didn't get an error response
        if (!frTranslation.title.startsWith('[Translation Error]')) {
          updatedTranslations.fr = {
            title: frTranslation.title,
            excerpt: frTranslation.excerpt,
            content: frTranslation.content
          };
        } else {
          translationFailed = true;
          console.error("French translation returned an error");
        }
      } catch (frError) {
        translationFailed = true;
        console.error("Error in French translation:", frError);
      }
      
      // Try Spanish translation
      try {
        console.log("Starting Spanish translation...");
        const esTranslation = await translateBlogContent(
          formData.content,
          formData.title,
          formData.excerpt,
          'es'
        );
        
        // Only update if we didn't get an error response
        if (!esTranslation.title.startsWith('[Translation Error]')) {
          updatedTranslations.es = {
            title: esTranslation.title,
            excerpt: esTranslation.excerpt,
            content: esTranslation.content
          };
        } else {
          translationFailed = true;
          console.error("Spanish translation returned an error");
        }
      } catch (esError) {
        translationFailed = true;
        console.error("Error in Spanish translation:", esError);
      }
      
      // Update states with the successful translations
      setTranslationData(updatedTranslations);
      setFormData(prev => ({
        ...prev,
        translations: updatedTranslations
      }));
      
      // Dismiss the loading toast and show appropriate message
      toast.dismiss(toastId);
      
      if (translationFailed) {
        toast.error("Some translations could not be completed. You can edit them manually.");
      } else {
        toast.success("Content translated to all languages");
      }
      
      // Save translations to database if in edit mode and at least one translation succeeded
      if (id && (updatedTranslations.fr.title || updatedTranslations.es.title)) {
        await saveTranslations(updatedTranslations);
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
