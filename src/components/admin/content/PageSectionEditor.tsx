
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { FileUploader } from '@/components/admin/FileUploader';
import { uploadPageSectionImage } from '@/services/imageService';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

interface PageSectionEditorProps {
  section: {
    id: string;
    pageName: string;
    sectionName: string;
    displayName: string;
  };
  content: string;
  images: Record<string, string>;
  onContentChange: (pageName: string, sectionName: string, content: string) => void;
  onSave: (pageName: string, sectionName: string) => Promise<void>;
  uploadingImage: string | null;
  setUploadingImage: (key: string | null) => void;
}

const PageSectionEditor: React.FC<PageSectionEditorProps> = ({
  section,
  content,
  images,
  onContentChange,
  onSave,
  uploadingImage,
  setUploadingImage
}) => {
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      await onSave(section.pageName, section.sectionName);
      // We don't need to check return value anymore since it's void
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, imageId: string) => {
    const imageKey = `${section.pageName}-${section.sectionName}-${imageId}`;
    setUploadingImage(imageKey);
    
    try {
      const imageUrl = await uploadPageSectionImage(file, section.pageName, section.sectionName, imageId);
      
      if (imageUrl) {
        toast.success("Image updated successfully!");
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div key={section.id} className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg md:text-xl font-semibold truncate max-w-full">{section.displayName}</h2>
        <Button 
          onClick={handleSaveContent}
          disabled={saving}
          size={isMobile ? "sm" : "default"}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 overflow-hidden">
        <h3 className="text-sm font-medium mb-2">Section Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {['main', 'header', 'background'].map(imageId => {
            const imageKey = `${section.pageName}-${section.sectionName}-${imageId}`;
            const imageUrl = images[imageKey];
            const isUploading = uploadingImage === imageKey;
            
            return (
              <div key={imageKey} className="bg-white p-2 md:p-3 border rounded-lg">
                <p className="text-xs text-gray-500 mb-2">
                  {imageId.charAt(0).toUpperCase() + imageId.slice(1)} Image:
                </p>
                {imageUrl ? (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt={`${imageId} for ${section.displayName}`} 
                      className="w-full h-32 md:h-40 object-cover rounded-lg mb-2"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 md:h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <p className="text-gray-500 text-sm">No image</p>
                  </div>
                )}
                
                <FileUploader
                  onUpload={(file) => handleImageUpload(file, imageId)}
                  label={isUploading ? "Uploading..." : "Change image"}
                  buttonVariant="outline"
                  buttonSize="sm"
                  acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 overflow-hidden">
        <div className="text-xs text-gray-500 mb-2">
          Preview:
        </div>
        <div 
          className="prose max-w-none overflow-x-auto" 
          dangerouslySetInnerHTML={{ 
            __html: content || '' 
          }} 
        />
      </div>
      
      <RichTextEditor
        value={content || ''}
        onChange={(newContent) => 
          onContentChange(section.pageName, section.sectionName, newContent)
        }
      />
    </div>
  );
};

export default PageSectionEditor;
