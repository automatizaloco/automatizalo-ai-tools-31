
-- Create a table for storing page images
CREATE TABLE IF NOT EXISTS public.page_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section_name TEXT NOT NULL,
  section_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page, section_name, section_id)
);

-- Add comment to table
COMMENT ON TABLE public.page_images IS 'Stores images for different page sections in the website content editor';
