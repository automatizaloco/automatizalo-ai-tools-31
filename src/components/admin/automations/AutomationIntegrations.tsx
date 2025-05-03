
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Globe, Box, Table, Code, Webhook, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';
import { Integration } from '@/types/automation';
import { runQuery, validateWebhookUrl, escapeSql } from '@/components/admin/adminActions';

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
    icon={<Webhook className="h-5 w-5" />}
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

// Generic Component for Code Integration (reusable for both Form and Table)
const CodeIntegration = ({ 
  data, 
  type,
  title,
  description,
  placeholder,
  icon,
  onChange, 
  onCodeChange,
  onSave, 
  isSaving 
}: { 
  data: Integration;
  type: 'form' | 'table';
  title: string;
  description: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCodeChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor={`${type}-code`}>Embed Code</Label>
        <div className="flex items-center space-x-2 mb-2">
          <Code className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-500">
            Paste the HTML code for your integration
          </p>
        </div>
        <Textarea 
          id={`${type}-code`}
          placeholder={placeholder}
          rows={10}
          value={data?.integration_code || ''}
          onChange={(e) => {
            if (onChange) onChange(e);
            onCodeChange(e.target.value);
          }}
          className="font-mono text-sm"
        />
      </div>
      
      {data?.integration_code && (
        <div>
          <Label>Preview</Label>
          <div className="mt-2 border rounded-md p-4 bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: data.integration_code }} />
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
            Save {title}
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
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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
  const [webhookErrors, setWebhookErrors] = useState({
    testUrl: false,
    prodUrl: false
  });
  
  // Fetch existing integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!automationId) return;
      
      setIsLoading(true);
      try {
        // Using typed query helper
        const { data, error } = await runQuery<Integration>(`
          SELECT * FROM automation_integrations WHERE automation_id = '${automationId}'
        `);
        
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
  
  const validateWebhookUrls = () => {
    if (!webhookData) return true;
    
    const testUrlValid = !webhookData.test_url || validateWebhookUrl(webhookData.test_url);
    const prodUrlValid = !webhookData.production_url || validateWebhookUrl(webhookData.production_url);
    
    setWebhookErrors({
      testUrl: !testUrlValid,
      prodUrl: !prodUrlValid
    });
    
    return testUrlValid && prodUrlValid;
  };
  
  const saveIntegration = async (data: Integration) => {
    if (!data || !automationId) return;
    
    // For webhook type, validate URLs first
    if (data.integration_type === 'webhook' && !validateWebhookUrls()) {
      toast.error('Please enter valid URLs');
      return;
    }
    
    setIsSaving(true);
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
            '${automationId}',
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
          if (newId) {
            // Update state with new ID
            if (data.integration_type === 'webhook') {
              setWebhookData({ ...data, id: newId });
            } else if (data.integration_type === 'form') {
              setFormData({ ...data, id: newId });
            } else if (data.integration_type === 'table') {
              setTableData({ ...data, id: newId });
            }
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
      setWebhookErrors(prev => ({ ...prev, testUrl: false }));
    }
  };
  
  const handleWebhookProdUrlChange = (value: string) => {
    if (webhookData) {
      setWebhookData({ ...webhookData, production_url: value });
      setWebhookErrors(prev => ({ ...prev, prodUrl: false }));
    }
  };
  
  const handleFormCodeChange = (value: string) => {
    if (formData) {
      setFormData({ ...formData, integration_code: value });
    }
  };
  
  const handleTableCodeChange = (value: string) => {
    if (tableData) {
      setTableData({ ...tableData, integration_code: value });
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
              <CodeIntegration
                data={formData}
                type="form"
                title="Form Integration"
                description="Paste the HTML code for your n8n form or Google Form embed"
                placeholder="<iframe src='https://your-form-url' ...>"
                icon={<Box className="h-5 w-5" />}
                onCodeChange={handleFormCodeChange}
                onSave={() => saveIntegration(formData)}
                isSaving={isSaving}
              />
            </TabsContent>
          )}
          
          {hasTableIntegration && tableData && (
            <TabsContent value="table" className="pt-4">
              <CodeIntegration
                data={tableData}
                type="table"
                title="Table Integration"
                description="Paste the HTML code for your Airtable, Google Sheets, or NocoDB table embed"
                placeholder="<iframe src='https://your-table-url' ...>"
                icon={<Table className="h-5 w-5" />}
                onCodeChange={handleTableCodeChange}
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
