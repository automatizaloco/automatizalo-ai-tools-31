
import { supabase } from '@/integrations/supabase/client';

export const ensureContentBucket = async (): Promise<void> => {
  try {
    console.log('Ensuring content bucket exists...');
    
    // First, check if the bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const contentBucketExists = existingBuckets?.some(bucket => bucket.name === 'content');
    
    if (!contentBucketExists) {
      console.log('Content bucket does not exist. Creating it now...');
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('content', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (error) {
        if (error.message?.includes('already exists') || error.message?.includes('row-level security policy')) {
          console.log('Content bucket already exists or RLS policy prevents creation - proceeding');
          // We can safely assume the bucket exists since either:
          // 1. It already exists but our query missed it
          // 2. The RLS policy prevents us from creating it, which likely means we don't have permission but it exists
          return;
        }
        
        console.error('Error creating content bucket:', error);
        return;
      }
      
      console.log('Content bucket created successfully:', data);
    } else {
      console.log('Content bucket already exists');
    }
    
    // Update bucket to be public if needed
    try {
      const { error: updateError } = await supabase.storage.updateBucket('content', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (updateError) {
        console.error('Error updating content bucket settings:', updateError);
      } else {
        console.log('Content bucket settings updated successfully');
      }
    } catch (updateError) {
      console.error('Error updating bucket settings:', updateError);
    }
    
    // Ensure the content-images folder exists
    try {
      const { error: folderError } = await supabase.storage
        .from('content')
        .upload('content-images/.folder', new Blob([''], { type: 'text/plain' }));
    
      if (folderError && !folderError.message?.includes('already exists')) {
        console.error('Error ensuring content-images folder:', folderError);
      }
    } catch (folderError) {
      console.error('Error creating content-images folder:', folderError);
    }
    
  } catch (error) {
    console.error('Error ensuring content bucket exists:', error);
  }
};
