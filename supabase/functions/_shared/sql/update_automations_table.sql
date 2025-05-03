
-- Create automation_integrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.automation_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('webhook', 'form', 'table')),
  test_url TEXT,
  production_url TEXT,
  integration_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create automation_custom_prompts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.automation_custom_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add row level security policies to automation_integrations
ALTER TABLE public.automation_integrations ENABLE ROW LEVEL SECURITY;

-- Add row level security policies to automation_custom_prompts
ALTER TABLE public.automation_custom_prompts ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
CREATE POLICY "Allow authenticated users to read integrations" 
  ON public.automation_integrations 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert integrations" 
  ON public.automation_integrations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update integrations" 
  ON public.automation_integrations 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Custom prompts policies - clients can only see their own
CREATE POLICY "Allow clients to view their own prompts" 
  ON public.automation_custom_prompts 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = client_id);

CREATE POLICY "Allow clients to insert their own prompts" 
  ON public.automation_custom_prompts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Allow clients to update their own prompts" 
  ON public.automation_custom_prompts 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = client_id);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_automation_integrations_updated_at'
  ) THEN
    CREATE TRIGGER set_automation_integrations_updated_at
    BEFORE UPDATE ON public.automation_integrations
    FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_automation_custom_prompts_updated_at'
  ) THEN
    CREATE TRIGGER set_automation_custom_prompts_updated_at
    BEFORE UPDATE ON public.automation_custom_prompts
    FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
  END IF;
END $$;
