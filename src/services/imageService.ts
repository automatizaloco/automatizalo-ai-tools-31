
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ensureContentBucket } from './blog/ensureBucket';

// Upload an image for a page section
export const uploadPageSectionImage = async (
  file: File, 
  pageName: string, 
  sectionName: string, 
  imageId: string
): Promise<string | null> => {
  try {
    // Ensure the bucket exists
    await ensureContentBucket();
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `page-images/${pageName}/${sectionName}/${imageId}-${uuidv4()}.${fileExt}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('content')
      .getPublicUrl(filePath);
    
    // Update or insert the image record in the database
    const { error: dbError } = await supabase
      .from('page_images')
      .upsert({
        page: pageName,
        section_name: sectionName,
        section_id: imageId,
        image_url: publicUrl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page,section_name,section_id'
      });
    
    if (dbError) {
      console.error('Error saving image data to database:', dbError);
      toast.error('Failed to save image data to database');
      return null;
    }
    
    toast.success('Image uploaded successfully!');
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPageSectionImage:', error);
    toast.error('Failed to upload image');
    return null;
  }
};

// Get an image for a page section
export const getPageSectionImage = async (
  pageName: string,
  sectionName: string,
  imageId: string
): Promise<string | null> => {
  try {
    // Get the image record from the database
    const { data, error } = await supabase
      .from('page_images')
      .select('image_url')
      .eq('page', pageName)
      .eq('section_name', sectionName)
      .eq('section_id', imageId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching image:', error);
      return null;
    }
    
    if (data) {
      return data.image_url;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getPageSectionImage:', error);
    return null;
  }
};

// Get all images for a page
export const getPageImages = async (
  pageName: string
): Promise<Record<string, string>> => {
  try {
    // Get all image records for the page from the database
    const { data, error } = await supabase
      .from('page_images')
      .select('section_name, section_id, image_url')
      .eq('page', pageName);
    
    if (error) {
      console.error('Error fetching page images:', error);
      return {};
    }
    
    // Convert the array of records to a dictionary
    const images: Record<string, string> = {};
    if (data) {
      data.forEach((record) => {
        const key = `${record.section_name}-${record.section_id}`;
        images[key] = record.image_url;
      });
    }
    
    return images;
  } catch (error) {
    console.error('Error in getPageImages:', error);
    return {};
  }
};
