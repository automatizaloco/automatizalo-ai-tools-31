
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileUploader } from '@/components/admin/FileUploader';
import { uploadPageSectionImage, getPageSectionImage } from '@/services/imageService';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface EditableImageProps {
  src: string;
  alt: string;
  pageName: string;
  sectionName: string;
  imageId: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  onLoad?: () => void;
}

const EditableImage = ({
  src,
  alt,
  pageName,
  sectionName,
  imageId,
  className = '',
  width,
  height,
  onLoad,
}: EditableImageProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load image from database when component mounts
  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImage = await getPageSectionImage(pageName, sectionName, imageId);
        
        if (storedImage) {
          console.log(`Loaded image from database for ${pageName}/${sectionName}/${imageId}:`, storedImage);
          setCurrentSrc(storedImage);
        } else {
          console.log(`No stored image found for ${pageName}/${sectionName}/${imageId}, using default:`, src);
          setCurrentSrc(src);
        }
      } catch (error) {
        console.error(`Error loading image for ${pageName}/${sectionName}/${imageId}:`, error);
        setCurrentSrc(src);
      } finally {
        setIsLoaded(true);
      }
    };
    
    if (pageName && sectionName && imageId) {
      loadImage();
    } else {
      setCurrentSrc(src);
      setIsLoaded(true);
    }
  }, [pageName, sectionName, imageId, src]);

  const handleImageLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  // If user is not authenticated, just render the regular image
  if (!user) {
    return (
      <img 
        src={isLoaded ? currentSrc : src} 
        alt={alt} 
        className={className} 
        width={width} 
        height={height} 
        onLoad={handleImageLoad}
      />
    );
  }

  const handleUpload = async (file: File) => {
    if (!pageName || !sectionName || !imageId) {
      toast.error("Missing required image parameters");
      return null;
    }

    setIsUploading(true);
    try {
      console.log(`Uploading image for ${pageName}/${sectionName}/${imageId}`);
      const newImageUrl = await uploadPageSectionImage(file, pageName, sectionName, imageId);
      
      if (newImageUrl) {
        setCurrentSrc(newImageUrl);
        toast.success("Image updated successfully!");
        return newImageUrl;
      }
      throw new Error("Failed to upload image");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update image");
      return null;
    } finally {
      setIsUploading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group">
      <img 
        src={isLoaded ? currentSrc : src} 
        alt={alt} 
        className={`${className} ${isEditing ? 'opacity-50' : ''}`} 
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={(e) => {
          console.error(`Image failed to load: ${currentSrc}`);
          e.currentTarget.src = src; // Fallback to default
        }}
      />
      
      {/* Edit overlay button */}
      {!isEditing && pageName && sectionName && imageId && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Replace image"
        >
          <Pencil size={16} />
        </button>
      )}
      
      {/* Upload panel */}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm w-full">
            <h3 className="font-medium mb-2">Replace Image</h3>
            <FileUploader
              onUpload={handleUpload}
              label={isUploading ? "Uploading..." : "Select new image"}
              buttonVariant="default"
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              maxSizeMB={5}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 w-full py-1 text-sm text-gray-600 hover:text-gray-900"
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
