
import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { updatePageContent, getPageContent } from '@/services/pageContentService';
import { useLanguage } from '@/context/LanguageContext';

interface EditableTextProps {
  id: string;
  defaultText: string;
  multiline?: boolean;
  onSave?: (value: string) => void;
  disabled?: boolean;
  pageName?: string;
  sectionName?: string;
}

const EditableText = ({ 
  id, 
  defaultText, 
  multiline = false, 
  onSave, 
  disabled = false,
  pageName,
  sectionName
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(defaultText);
  const [pendingText, setPendingText] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  
  useEffect(() => {
    if (pageName && sectionName) {
      const loadContent = async () => {
        setIsLoading(true);
        try {
          const content = await getPageContent(pageName, sectionName, language);
          if (content) {
            setText(content);
            setPendingText(content);
          }
        } catch (error) {
          console.error('Error loading content for', pageName, sectionName, error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadContent();
    } else {
      setIsLoading(false);
    }
  }, [pageName, sectionName, language]);

  const handleEdit = () => {
    if (disabled || isLoading) return;
    setIsEditing(true);
    setPendingText(text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingText(text);
  };

  const handleSave = async () => {
    setText(pendingText);
    setIsEditing(false);
    
    if (pageName && sectionName) {
      try {
        setIsTranslating(true);
        await updatePageContent(pageName, sectionName, pendingText, language);
        console.log(`Content updated for ${pageName}-${sectionName} in ${language}`);
        
        // If the current language is English, notify that auto-translation is occurring
        if (language === 'en') {
          toast.success("Content updated successfully. Auto-translating to other languages...");
        } else {
          toast.success("Content updated successfully");
        }
      } catch (error) {
        console.error('Error saving content:', error);
        toast.error("Failed to save content. Please try again.");
      } finally {
        setIsTranslating(false);
      }
    }
    
    if (onSave) {
      onSave(pendingText);
    }
    
    const customEvent = new CustomEvent('editableTextChanged', {
      detail: { id, newText: pendingText }
    });
    window.dispatchEvent(customEvent);
  };

  if (isLoading) {
    return <span className="text-gray-400">Loading...</span>;
  }

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <Textarea
            value={pendingText}
            onChange={(e) => setPendingText(e.target.value)}
            className="w-full min-h-[60px] p-2 border-2 border-blue-400 focus:border-blue-500 rounded"
            placeholder="Enter text..."
            disabled={disabled}
          />
        ) : (
          <Input
            value={pendingText}
            onChange={(e) => setPendingText(e.target.value)}
            className="w-full p-2 border-2 border-blue-400 focus:border-blue-500 rounded"
            placeholder="Enter text..."
            disabled={disabled}
          />
        )}
        <div className="flex mt-2 justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="p-1 h-8 w-8"
            onClick={handleCancel}
            disabled={disabled}
          >
            <XIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="p-1 h-8 w-8 bg-green-600 hover:bg-green-700"
            onClick={handleSave}
            disabled={disabled || isTranslating}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`group relative inline-block ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      onClick={handleEdit}
    >
      {text}
      {!disabled && (
        <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <PencilIcon className="h-4 w-4 text-blue-500" />
        </span>
      )}
    </span>
  );
};

export default EditableText;
