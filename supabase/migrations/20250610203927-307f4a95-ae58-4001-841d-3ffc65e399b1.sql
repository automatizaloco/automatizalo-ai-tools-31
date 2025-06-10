
-- Primero, eliminar la restricción existente
ALTER TABLE client_integration_settings 
DROP CONSTRAINT IF EXISTS client_integration_settings_integration_type_check;

-- Agregar la nueva restricción que incluye 'button'
ALTER TABLE client_integration_settings 
ADD CONSTRAINT client_integration_settings_integration_type_check 
CHECK (integration_type IN ('webhook', 'form', 'table', 'custom_prompt', 'button'));

-- Hacer lo mismo para la tabla integrations si tiene una restricción similar
ALTER TABLE integrations 
DROP CONSTRAINT IF EXISTS integrations_integration_type_check;

ALTER TABLE integrations 
ADD CONSTRAINT integrations_integration_type_check 
CHECK (integration_type IN ('webhook', 'form', 'table', 'custom_prompt', 'button'));

-- Ahora actualizar la tabla automations para reemplazar has_table_integration con has_button_integration
ALTER TABLE automations 
DROP COLUMN IF EXISTS has_table_integration,
ADD COLUMN has_button_integration boolean DEFAULT false;

-- Agregar campos para URL y texto del botón en integrations
ALTER TABLE integrations 
ADD COLUMN IF NOT EXISTS button_url text,
ADD COLUMN IF NOT EXISTS button_text text DEFAULT 'Abrir Editor';

-- Agregar campos para URL y texto del botón en client_integration_settings
ALTER TABLE client_integration_settings 
ADD COLUMN IF NOT EXISTS button_url text,
ADD COLUMN IF NOT EXISTS button_text text DEFAULT 'Abrir Editor';

-- Actualizar registros existentes de tipo 'table' a 'button'
UPDATE integrations 
SET integration_type = 'button' 
WHERE integration_type = 'table';

UPDATE client_integration_settings 
SET integration_type = 'button' 
WHERE integration_type = 'table';
