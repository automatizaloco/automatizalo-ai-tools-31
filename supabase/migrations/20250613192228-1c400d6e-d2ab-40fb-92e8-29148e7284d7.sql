
-- Add table integration support to automations table
ALTER TABLE public.automations 
ADD COLUMN has_table_integration boolean DEFAULT false;

-- Add table configuration fields to client_integration_settings table
ALTER TABLE public.client_integration_settings 
ADD COLUMN table_url text,
ADD COLUMN table_title text DEFAULT 'Estadísticas';

-- Update existing automations to have table integration available but disabled by default
UPDATE public.automations 
SET has_table_integration = false 
WHERE has_table_integration IS NULL;

-- Initialize table integration settings for existing client automations that don't have them
INSERT INTO public.client_integration_settings (
  client_automation_id, 
  integration_type, 
  status,
  table_title
)
SELECT 
  ca.id,
  'table',
  'pending',
  'Estadísticas'
FROM public.client_automations ca
INNER JOIN public.automations a ON ca.automation_id = a.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.client_integration_settings cis 
  WHERE cis.client_automation_id = ca.id 
  AND cis.integration_type = 'table'
);
