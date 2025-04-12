
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureContentBucket } from './blog/ensureBucket';

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
      
      // If error is related to bucket/permissions, try to simply return a generic URL
      if (uploadError.message?.includes('permission denied') || uploadError.message?.includes('row-level security')) {
        toast.error("Storage permission denied. Please check your Supabase permissions.");
        return null;
      }
      
      throw uploadError;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('content')
      .getPublicUrl(filePath);
    
    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error("Could not get public URL");
    }
    
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
    return null;
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
    
    if (!data) {
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
