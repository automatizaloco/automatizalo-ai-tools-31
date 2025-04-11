
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensure the content bucket exists
 */
export const ensureContentBucket = async (): Promise<void> => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }
    
    // If bucket doesn't exist, create it
    const bucketExists = buckets.some(bucket => bucket.name === 'content');
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(
        'content',
        { public: true }
      );
      
      if (createError) {
        console.error("Error creating content bucket:", createError);
      } else {
        console.log("Created content bucket successfully");
      }
    }
  } catch (error) {
    console.error("Error ensuring content bucket exists:", error);
  }
};
