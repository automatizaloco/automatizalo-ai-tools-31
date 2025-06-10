
import { toast } from 'sonner';
import { Integration } from '@/types/automation';
import { runQuery, validateWebhookUrl, escapeSql } from '@/components/admin/adminActions';

/**
 * Fetches all integrations for a specific automation
 */
export const fetchAutomationIntegrations = async (automationId: string) => {
  if (!automationId) return null;
  
  try {
    // Using typed query helper
    const { data, error } = await runQuery<Integration>(`
      SELECT * FROM automation_integrations WHERE automation_id = '${automationId}'
    `);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch integrations:', error);
    toast.error('Failed to load integration data');
    return null;
  }
};

/**
 * Saves an integration (creates or updates)
 */
export const saveIntegration = async (data: Integration) => {
  if (!data || !data.automation_id) return null;
  
  // For webhook type, validate URLs first
  if (data.integration_type === 'webhook') {
    const testUrlValid = !data.test_url || validateWebhookUrl(data.test_url);
    const prodUrlValid = !data.production_url || validateWebhookUrl(data.production_url);
    
    if (!testUrlValid || !prodUrlValid) {
      toast.error('Please enter valid URLs');
      return null;
    }
  }
  
  try {
    if (data.id) {
      // Update existing integration using typed query helper
      const { error } = await runQuery(`
        UPDATE automation_integrations 
        SET 
          test_url = '${escapeSql(data.test_url || '')}',
          production_url = '${escapeSql(data.production_url || '')}',
          integration_code = '${escapeSql(data.integration_code || '')}',
          updated_at = NOW()
        WHERE id = '${data.id}'
      `);
        
      if (error) throw error;
      
      return { success: true, id: data.id };
    } else {
      // Create new integration using typed query helper
      const { data: newData, error } = await runQuery<{id: string}>(`
        INSERT INTO automation_integrations (
          automation_id, 
          integration_type,
          test_url,
          production_url,
          integration_code
        ) VALUES (
          '${data.automation_id}',
          '${data.integration_type}',
          '${escapeSql(data.test_url || '')}',
          '${escapeSql(data.production_url || '')}',
          '${escapeSql(data.integration_code || '')}' 
        )
        RETURNING id
      `);
        
      if (error) throw error;
      
      // Check if newData exists and has items
      if (newData && newData.length > 0) {
        const newId = newData[0]?.id;
        return { success: true, id: newId };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to save ${data.integration_type} integration:`, error);
    toast.error(`Failed to save ${data.integration_type} integration`);
    return null;
  }
};

/**
 * Initializes empty integration data based on type
 */
export const createEmptyIntegration = (automationId: string, type: 'webhook' | 'form' | 'button'): Integration => {
  const baseIntegration: Integration = {
    automation_id: automationId,
    integration_type: type,
  };
  
  switch (type) {
    case 'webhook':
      return {
        ...baseIntegration,
        test_url: '',
        production_url: ''
      };
    case 'form':
    case 'button':
      return {
        ...baseIntegration,
        integration_code: ''
      };
  }
};
