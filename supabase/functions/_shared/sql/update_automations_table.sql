
-- Add new fields to automations table
ALTER TABLE IF EXISTS public.automations
ADD COLUMN IF NOT EXISTS has_custom_prompt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_webhook BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_form_integration BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_table_integration BOOLEAN DEFAULT false;

-- Create client_automations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.client_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  automation_id UUID NOT NULL REFERENCES public.automations(id),
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, automation_id)
);

-- Add RLS policies for client_automations table
ALTER TABLE public.client_automations ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can do anything with client_automations"
ON public.client_automations
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Clients can read their own automations
CREATE POLICY "Clients can read their own automations"
ON public.client_automations
FOR SELECT
USING (
  client_id = auth.uid()
);

-- Clients can update their own automations status
CREATE POLICY "Clients can update their own automations"
ON public.client_automations
FOR UPDATE
USING (
  client_id = auth.uid()
);

-- Clients can insert their own automations
CREATE POLICY "Clients can add their own automations"
ON public.client_automations
FOR INSERT
WITH CHECK (
  client_id = auth.uid()
);

-- Add trigger to update updated_at column
CREATE TRIGGER update_client_automations_updated_at
BEFORE UPDATE ON public.client_automations
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();
