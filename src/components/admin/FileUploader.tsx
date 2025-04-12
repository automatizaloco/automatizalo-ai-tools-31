
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<string | null>;
  label?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
}

export const FileUploader = ({
  onUpload,
  label = 'Upload file',
  buttonVariant = 'default',
  buttonSize = 'default',
  className,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeMB = 5
}: FileUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uniqueId = `file-upload-${Math.random().toString(36).substring(7)}`;
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("File selected:", file.name, file.type, file.size);
    
    setError(null);
    
    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      const errorMsg = `Invalid file type. Accepted types: ${acceptedFileTypes.map(type => type.split('/')[1]).join(', ')}`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `File too large. Maximum size: ${maxSizeMB}MB`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(10);
    
    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.floor(Math.random() * 10);
          return next >= 90 ? 90 : next;
        });
      }, 300);
      
      console.log("Uploading file:", file.name);
      const result = await onUpload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!result) {
        throw new Error('Upload failed');
      }
      
      console.log("Upload successful:", result);
      toast.success('File uploaded successfully');
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Upload failed. Please try again.');
      toast.error('Failed to upload file');
    } finally {
      setIsLoading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setError(null);
      }, 2000);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        id={uniqueId}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(',')}
        className="hidden"
        disabled={isLoading}
      />
      
      <Button
        type="button"
        variant={buttonVariant}
        size={buttonSize}
        className="w-full"
        disabled={isLoading}
        onClick={handleButtonClick}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
        ) : error ? (
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
            <span>Try again</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            <span>{label}</span>
          </div>
        )}
      </Button>
      
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div
            className={`h-1 rounded-full ${uploadProgress === 100 ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-blue-600'}`}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
