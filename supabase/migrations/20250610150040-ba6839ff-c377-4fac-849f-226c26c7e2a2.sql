
-- Create integrations table for storing admin-configured integration settings
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('webhook', 'form', 'table', 'custom_prompt')),
  test_url TEXT,
  production_url TEXT,
  integration_code TEXT,
  prompt_webhook_url TEXT, -- New field for custom prompt webhook URL
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for integrations table
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Admin can manage all integrations
CREATE POLICY "Admins can manage integrations" 
  ON public.integrations 
  FOR ALL 
  USING (is_admin_secure());

-- Add updated_at trigger
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add prompt_webhook_url column to client_integration_settings table
ALTER TABLE public.client_integration_settings 
ADD COLUMN prompt_webhook_url TEXT;
