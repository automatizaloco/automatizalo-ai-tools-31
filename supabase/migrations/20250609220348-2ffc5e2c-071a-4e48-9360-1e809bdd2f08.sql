
-- Crear tabla para logs de webhooks
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_automation_id UUID NOT NULL REFERENCES public.client_automations(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'POST',
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL, -- en milisegundos
  payload JSONB,
  response_body TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para envíos de formularios
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_automation_id UUID NOT NULL REFERENCES public.client_automations(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  submission_ip TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processed, failed
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para entradas de datos de tablas
CREATE TABLE public.table_data_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_automation_id UUID NOT NULL REFERENCES public.client_automations(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  entry_type TEXT NOT NULL DEFAULT 'manual', -- manual, automated, imported
  status TEXT NOT NULL DEFAULT 'active', -- active, archived, deleted
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar índices para mejorar el rendimiento
CREATE INDEX idx_webhook_logs_client_automation ON public.webhook_logs(client_automation_id);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at);
CREATE INDEX idx_form_submissions_client_automation ON public.form_submissions(client_automation_id);
CREATE INDEX idx_form_submissions_created_at ON public.form_submissions(created_at);
CREATE INDEX idx_table_data_entries_client_automation ON public.table_data_entries(client_automation_id);
CREATE INDEX idx_table_data_entries_created_at ON public.table_data_entries(created_at);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_data_entries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para webhook_logs
CREATE POLICY "Admins can view all webhook logs" 
  ON public.webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view their webhook logs" 
  ON public.webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_automations ca
      JOIN public.clients c ON c.id = ca.client_id
      WHERE ca.id = webhook_logs.client_automation_id 
      AND c.id = auth.uid()
    )
  );

-- Políticas RLS para form_submissions
CREATE POLICY "Admins can view all form submissions" 
  ON public.form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view their form submissions" 
  ON public.form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_automations ca
      JOIN public.clients c ON c.id = ca.client_id
      WHERE ca.id = form_submissions.client_automation_id 
      AND c.id = auth.uid()
    )
  );

-- Políticas RLS para table_data_entries
CREATE POLICY "Admins can manage all table data" 
  ON public.table_data_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can manage their table data" 
  ON public.table_data_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.client_automations ca
      JOIN public.clients c ON c.id = ca.client_id
      WHERE ca.id = table_data_entries.client_automation_id 
      AND c.id = auth.uid()
    )
  );

-- Agregar triggers para actualizar updated_at en table_data_entries
CREATE OR REPLACE FUNCTION update_table_data_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_table_data_entries_updated_at_trigger
    BEFORE UPDATE ON public.table_data_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_table_data_entries_updated_at();
