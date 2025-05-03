
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Globe, Box, Table } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';
import { Integration } from '@/types/automation';

// Separate component for webhook integration
const WebhookIntegration = ({ 
  webhookData, 
  onWebhookTestUrlChange,
  onWebhookProdUrlChange,
  onSaveWebhook,
  isSaving 
}: { 
  webhookData: Integration;
  onWebhookTestUrlChange: (value: string) => void;
  onWebhookProdUrlChange: (value: string) => void;
  onSaveWebhook: () => void;
  isSaving: boolean;
}) => (
  <WebhookConfigCard 
    title="Webhook Integration" 
    description="Configure webhook URLs for this automation"
    icon={<Globe className="h-5 w-5" />}
    testUrl={webhookData.test_url || ''}
    productionUrl={webhookData.production_url || ''}
    method="POST"
    mode="test"
    onTestUrlChange={onWebhookTestUrlChange}
    onProductionUrlChange={onWebhookProdUrlChange}
    onMethodChange={() => {}}
    onModeChange={() => {}}
    onTest={() => toast.info('Webhook test function not implemented')}
    onSave={(e) => {
      e.preventDefault();
      onSaveWebhook();
    }}
    isSaving={isSaving}
    showSaveButton={true}
  />
);

// Separate component for form integration
const FormIntegration = ({ 
  formData, 
  onChange, 
  onSave, 
  isSaving 
}: { 
  formData: Integration;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  isSaving: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Box className="h-5 w-5" />
        Form Integration
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="form-code">Form Embed Code</Label>
        <p className="text-sm text-gray-500 mb-2">
          Paste the HTML code for your n8n form or Google Form embed.
        </p>
        <Textarea 
          id="form-code"
          placeholder="<iframe src='https://your-form-url' ...>"
          rows={10}
          value={formData?.integration_code || ''}
          onChange={onChange}
          className="font-mono text-sm"
        />
      </div>
      
      {formData?.integration_code && (
        <div>
          <Label>Preview</Label>
          <div className="mt-2 border rounded-md p-4 bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: formData.integration_code }} />
          </div>
        </div>
      )}
      
      <Button 
        onClick={onSave} 
        disabled={isSaving} 
        className="w-full"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Form Integration
          </>
        )}
      </Button>
    </CardContent>
  </Card>
);

// Separate component for table integration
const TableIntegration = ({ 
  tableData, 
  onChange, 
  onSave, 
  isSaving 
}: { 
  tableData: Integration;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  isSaving: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Table className="h-5 w-5" />
        Table Integration
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="table-code">Table Embed Code</Label>
        <p className="text-sm text-gray-500 mb-2">
          Paste the HTML code for your Airtable, Google Sheets, or NocoDB table embed.
        </p>
        <Textarea 
          id="table-code"
          placeholder="<iframe src='https://your-table-url' ...>"
          rows={10}
          value={tableData?.integration_code || ''}
          onChange={onChange}
          className="font-mono text-sm"
        />
      </div>
      
      {tableData?.integration_code && (
        <div>
          <Label>Preview</Label>
          <div className="mt-2 border rounded-md p-4 bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: tableData.integration_code }} />
          </div>
        </div>
      )}
      
      <Button 
        onClick={onSave} 
        disabled={isSaving} 
        className="w-full"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Table Integration
          </>
        )}
      </Button>
    </CardContent>
  </Card>
);

// Loading state component
const LoadingState = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <span className="ml-2">Loading integrations...</span>
  </div>
);

// No integrations component
const NoIntegrations = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <p className="text-gray-500">No integrations have been enabled for this automation.</p>
        <p className="text-sm text-gray-400 mt-1">Edit the automation to enable integrations.</p>
      </div>
    </CardContent>
  </Card>
);

interface AutomationIntegrationsProps {
  automationId: string;
  hasWebhook: boolean;
  hasFormIntegration: boolean;
  hasTableIntegration: boolean;
}

const AutomationIntegrations: React.FC<AutomationIntegrationsProps> = ({
  automationId,
  hasWebhook,
  hasFormIntegration,
  hasTableIntegration
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [webhookData, setWebhookData] = useState<Integration | null>(null);
  const [formData, setFormData] = useState<Integration | null>(null);
  const [tableData, setTableData] = useState<Integration | null>(null);
  const [activeTab, setActiveTab] = useState<string>('webhook');
  
  // Fetch existing integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!automationId) return;
      
      setIsLoading(true);
      try {
        // Using raw SQL query to get around TypeScript issues
        const { data, error } = await supabase
          .rpc('exec_sql', {
            sql_query: `SELECT * FROM automation_integrations WHERE automation_id = '${automationId}'`
          });
        
        if (error) {
          throw error;
        }
        
        // Process returned data
        const integrations = data || [];
        
        if (integrations && integrations.length > 0) {
          // Sort integrations by type
          integrations.forEach((integration: Integration) => {
            if (integration.integration_type === 'webhook') {
              setWebhookData(integration);
            } else if (integration.integration_type === 'form') {
              setFormData(integration);
            } else if (integration.integration_type === 'table') {
              setTableData(integration);
            }
          });
        } else {
          // Initialize empty integrations if none exist
          if (hasWebhook) {
            setWebhookData({
              automation_id: automationId,
              integration_type: 'webhook',
              test_url: '',
              production_url: ''
            });
          }
          
          if (hasFormIntegration) {
            setFormData({
              automation_id: automationId,
              integration_type: 'form',
              integration_code: ''
            });
          }
          
          if (hasTableIntegration) {
            setTableData({
              automation_id: automationId,
              integration_type: 'table',
              integration_code: ''
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch integrations:', error);
        toast.error('Failed to load integration data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [automationId, hasWebhook, hasFormIntegration, hasTableIntegration]);
  
  // Set initial active tab based on available integrations
  useEffect(() => {
    if (hasWebhook) {
      setActiveTab('webhook');
    } else if (hasFormIntegration) {
      setActiveTab('form');
    } else if (hasTableIntegration) {
      setActiveTab('table');
    }
  }, [hasWebhook, hasFormIntegration, hasTableIntegration]);
  
  const saveIntegration = async (data: Integration) => {
    if (!data || !automationId) return;
    
    setIsSaving(true);
    try {
      if (data.id) {
        // Update existing integration using raw SQL
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `
            UPDATE automation_integrations 
            SET 
              test_url = '${data.test_url || ''}',
              production_url = '${data.production_url || ''}',
              integration_code = '${data.integration_code?.replace(/'/g, "''")}',
              updated_at = NOW()
            WHERE id = '${data.id}'
          `
        });
          
        if (error) throw error;
      } else {
        // Create new integration using raw SQL
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `
            INSERT INTO automation_integrations (
              automation_id, 
              integration_type,
              test_url,
              production_url,
              integration_code
            ) VALUES (
              '${automationId}',
              '${data.integration_type}',
              '${data.test_url || ''}',
              '${data.production_url || ''}',
              '${data.integration_code?.replace(/'/g, "''")}' 
            )
            RETURNING id
          `
        });
          
        if (error) throw error;
        
        // Re-fetch to get the new ID
        const { data: newData } = await supabase.rpc('exec_sql', {
          sql_query: `
            SELECT * FROM automation_integrations 
            WHERE automation_id = '${automationId}' 
            AND integration_type = '${data.integration_type}'
            ORDER BY created_at DESC
            LIMIT 1
          `
        });
        
        if (newData && newData.length > 0) {
          const newIntegration = newData[0];
          // Update state with new ID
          if (data.integration_type === 'webhook') {
            setWebhookData({ ...data, id: newIntegration.id });
          } else if (data.integration_type === 'form') {
            setFormData({ ...data, id: newIntegration.id });
          } else if (data.integration_type === 'table') {
            setTableData({ ...data, id: newIntegration.id });
          }
        }
      }
      
      toast.success(`${data.integration_type} integration saved successfully`);
    } catch (error) {
      console.error(`Failed to save ${data.integration_type} integration:`, error);
      toast.error(`Failed to save ${data.integration_type} integration`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleWebhookTestUrlChange = (value: string) => {
    if (webhookData) {
      setWebhookData({ ...webhookData, test_url: value });
    }
  };
  
  const handleWebhookProdUrlChange = (value: string) => {
    if (webhookData) {
      setWebhookData({ ...webhookData, production_url: value });
    }
  };
  
  const handleFormCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({ ...formData, integration_code: e.target.value });
    }
  };
  
  const handleTableCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (tableData) {
      setTableData({ ...tableData, integration_code: e.target.value });
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  // No integrations available
  if (!hasWebhook && !hasFormIntegration && !hasTableIntegration) {
    return <NoIntegrations />;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${[hasWebhook, hasFormIntegration, hasTableIntegration].filter(Boolean).length}, 1fr)` }}>
            {hasWebhook && <TabsTrigger value="webhook" disabled={!hasWebhook}>Webhook</TabsTrigger>}
            {hasFormIntegration && <TabsTrigger value="form" disabled={!hasFormIntegration}>Form</TabsTrigger>}
            {hasTableIntegration && <TabsTrigger value="table" disabled={!hasTableIntegration}>Table</TabsTrigger>}
          </TabsList>
          
          {hasWebhook && webhookData && (
            <TabsContent value="webhook" className="pt-4">
              <WebhookIntegration
                webhookData={webhookData}
                onWebhookTestUrlChange={handleWebhookTestUrlChange}
                onWebhookProdUrlChange={handleWebhookProdUrlChange}
                onSaveWebhook={() => saveIntegration(webhookData)}
                isSaving={isSaving}
              />
            </TabsContent>
          )}
          
          {hasFormIntegration && formData && (
            <TabsContent value="form" className="pt-4">
              <FormIntegration
                formData={formData}
                onChange={handleFormCodeChange}
                onSave={() => saveIntegration(formData)}
                isSaving={isSaving}
              />
            </TabsContent>
          )}
          
          {hasTableIntegration && tableData && (
            <TabsContent value="table" className="pt-4">
              <TableIntegration
                tableData={tableData}
                onChange={handleTableCodeChange}
                onSave={() => saveIntegration(tableData)}
                isSaving={isSaving}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AutomationIntegrations;
