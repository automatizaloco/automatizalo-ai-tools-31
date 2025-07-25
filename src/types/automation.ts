
export interface Automation {
  id: string;
  title: string;
  description: string;
  installation_price: number;
  monthly_price: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
  active: boolean;
  has_custom_prompt?: boolean;
  has_form_integration?: boolean;
  has_button_integration?: boolean;
  has_table_integration?: boolean;
}

export interface ClientAutomation {
  id: string;
  client_id: string;
  automation_id: string;
  purchase_date: string;
  status: 'active' | 'canceled' | 'pending';
  next_billing_date: string;
  setup_status: 'pending' | 'in_progress' | 'completed';
  automation?: Automation;
}

export interface SupportTicket {
  id: string;
  client_id: string;
  automation_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface TicketResponse {
  id: string;
  ticket_id: string;
  message: string;
  created_by: string;
  is_admin: boolean;
  created_at: string;
}

export interface CustomPrompt {
  id?: string;
  prompt_text: string;
  client_id: string;
  automation_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Integration {
  id?: string;
  automation_id: string;
  integration_type: 'webhook' | 'form' | 'button' | 'custom_prompt' | 'table';
  test_url?: string;
  production_url?: string;
  integration_code?: string;
  prompt_webhook_url?: string;
  button_url?: string;
  button_text?: string;
  table_url?: string;
  table_title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientIntegrationSetting {
  id?: string;
  client_automation_id: string;
  integration_type: 'webhook' | 'form' | 'button' | 'custom_prompt' | 'table';
  test_url?: string;
  production_url?: string;
  integration_code?: string;
  prompt_text?: string;
  prompt_webhook_url?: string;
  button_url?: string;
  button_text?: string;
  table_url?: string;
  table_title?: string;
  status: 'pending' | 'configured' | 'active';
  created_at?: string;
  updated_at?: string;
}
