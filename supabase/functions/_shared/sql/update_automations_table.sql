
-- Add the missing columns to automations table
ALTER TABLE IF EXISTS public.automations
ADD COLUMN IF NOT EXISTS has_custom_prompt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_webhook BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_form_integration BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_table_integration BOOLEAN DEFAULT false;

-- Add new tables for automation features
CREATE TABLE IF NOT EXISTS public.automation_custom_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  automation_id UUID NOT NULL REFERENCES public.automations(id),
  prompt_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, automation_id)
);

-- Enable RLS on new table
ALTER TABLE public.automation_custom_prompts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY IF NOT EXISTS "Users can view their own custom prompts" 
  ON public.automation_custom_prompts 
  FOR SELECT 
  USING (auth.uid() = client_id);

CREATE POLICY IF NOT EXISTS "Users can update their own custom prompts" 
  ON public.automation_custom_prompts 
  FOR UPDATE 
  USING (auth.uid() = client_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own custom prompts" 
  ON public.automation_custom_prompts 
  FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

-- Admin can do anything
CREATE POLICY IF NOT EXISTS "Admins can do anything with custom prompts" 
  ON public.automation_custom_prompts 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create tables for integration data
CREATE TABLE IF NOT EXISTS public.automation_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES public.automations(id),
  integration_type TEXT NOT NULL CHECK (integration_type IN ('webhook', 'form', 'table')),
  test_url TEXT,
  production_url TEXT,
  integration_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(automation_id, integration_type)
);

-- Enable RLS
ALTER TABLE public.automation_integrations ENABLE ROW LEVEL SECURITY;

-- Only admins can manage integrations
CREATE POLICY IF NOT EXISTS "Admins can manage integrations" 
  ON public.automation_integrations 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Everyone can view integrations
CREATE POLICY IF NOT EXISTS "Everyone can view integrations" 
  ON public.automation_integrations 
  FOR SELECT 
  USING (true);

-- Ensure we have a storage bucket for automation images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('content', 'content', true, 5242880, '{image/jpeg,image/png,image/gif,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Add storage policy to allow public to view content
CREATE POLICY IF NOT EXISTS "Public Access to content bucket" 
  ON storage.objects 
  FOR SELECT 
  TO public 
  USING (bucket_id = 'content');

-- Add storage policy to allow authenticated users to upload content
CREATE POLICY IF NOT EXISTS "Authenticated users can upload content" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'content');

-- Add storage policy to allow users to update their own objects
CREATE POLICY IF NOT EXISTS "Authenticated users can update their own content" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner) AND bucket_id = 'content';

-- Add storage policy to allow users to delete their own objects
CREATE POLICY IF NOT EXISTS "Authenticated users can delete their own content" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner) AND bucket_id = 'content';
