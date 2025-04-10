
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensure the blog_images bucket exists
 */
export const ensureBlogImagesBucket = async (): Promise<void> => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }
    
    // If bucket doesn't exist, create it
    const bucketExists = buckets.some(bucket => bucket.name === 'blog_images');
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(
        'blog_images',
        { public: true }
      );
      
      if (createError) {
        console.error("Error creating blog_images bucket:", createError);
      } else {
        console.log("Created blog_images bucket successfully");
      }
    }
  } catch (error) {
    console.error("Error ensuring blog_images bucket exists:", error);
  }
};
