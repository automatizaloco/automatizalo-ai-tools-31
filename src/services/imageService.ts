
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureContentBucket } from './blog/ensureBucket';

// Constants for Supabase access - already defined in client.ts
const SUPABASE_URL = "https://juwbamkqkawyibcvllvo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1d2JhbWtxa2F3eWliY3ZsbHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDUxMDIsImV4cCI6MjA1NzI4MTEwMn0.uqwyR5lwp8JXa7qAZu6nZcCEdaoKOxX0XxQls2vg7Fk";

/**
 * Uploads an image to storage and saves its reference in the database
 */
export const uploadPageSectionImage = async (
  file: File,
  pageName: string,
  sectionName: string,
  sectionId: string
): Promise<string | null> => {
  try {
    // Ensure the content bucket exists before uploading
    await ensureContentBucket();
    
    // Upload image to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${pageName}-${sectionName}-${sectionId}-${Date.now()}.${fileExt}`;
    const filePath = `content-images/${fileName}`;
    
    console.log("Uploading file to path:", filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('content')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('content')
      .getPublicUrl(filePath);
    
    const imageUrl = publicUrlData.publicUrl;
    console.log("Image uploaded successfully. URL:", imageUrl);
    
    // Save to database
    const { data, error } = await supabase
      .from('page_images')
      .upsert({
        page: pageName,
        section_name: sectionName,
        section_id: sectionId,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page,section_name,section_id'
      });
    
    if (error) {
      console.error("Error saving image reference:", error);
      toast.error("Image uploaded but reference not saved. Please try again.");
    }
    
    return imageUrl;
  } catch (error) {
    console.error("Error uploading page section image:", error);
    toast.error("Failed to upload image");
    throw error;
  }
};

/**
 * Gets all images for a specific page
 */
export const getPageImages = async (pageName: string): Promise<Record<string, string>> => {
  try {
    const { data: pageImages, error } = await supabase
      .from('page_images')
      .select('*')
      .eq('page', pageName);
    
    if (error) {
      console.error("Error fetching page images:", error);
      return {};
    }
    
    // Convert to a map for easy access
    const imageMap: Record<string, string> = {};
    
    if (pageImages) {
      pageImages.forEach(image => {
        const key = `${image.page}-${image.section_name}-${image.section_id}`;
        imageMap[key] = image.image_url;
      });
    }
    
    console.log("Retrieved images for page", pageName, ":", imageMap);
    return imageMap;
  } catch (error) {
    console.error("Error getting page images:", error);
    return {};
  }
};

/**
 * Get all available images from the content bucket
 */
export const getAllContentImages = async (): Promise<string[]> => {
  try {
    // Ensure the bucket exists
    await ensureContentBucket();
    
    // List all files in the content-images folder
    const { data, error } = await supabase.storage
      .from('content')
      .list('content-images');
    
    if (error) {
      console.error("Error listing content images:", error);
      return [];
    }
    
    // Get public URLs for all files
    const imageUrls = data.map(file => {
      const { data } = supabase.storage
        .from('content')
        .getPublicUrl(`content-images/${file.name}`);
      return data.publicUrl;
    });
    
    return imageUrls;
  } catch (error) {
    console.error("Error getting all content images:", error);
    return [];
  }
};
