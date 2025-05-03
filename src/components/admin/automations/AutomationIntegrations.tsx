
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Table } from 'lucide-react';
import { toast } from 'sonner';
import { Integration } from '@/types/automation';
import WebhookIntegration from './integrations/WebhookIntegration';
import CodeIntegration from './integrations/CodeIntegration';
import LoadingState from './integrations/LoadingState';
import NoIntegrations from './integrations/NoIntegrations';
import { fetchAutomationIntegrations, saveIntegration, createEmptyIntegration } from './integration-utils';

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
    const loadIntegrations = async () => {
      if (!automationId) return;
      
      setIsLoading(true);
      try {
        // Fetch integrations
        const integrations = await fetchAutomationIntegrations(automationId);
        
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
            setWebhookData(createEmptyIntegration(automationId, 'webhook'));
          }
          
          if (hasFormIntegration) {
            setFormData(createEmptyIntegration(automationId, 'form'));
          }
          
          if (hasTableIntegration) {
            setTableData(createEmptyIntegration(automationId, 'table'));
          }
        }
      } catch (error) {
        console.error('Failed to fetch integrations:', error);
        toast.error('Failed to load integration data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIntegrations();
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
  
  const handleSaveIntegration = async (data: Integration) => {
    if (!data || !automationId) return;
    
    setIsSaving(true);
    try {
      const result = await saveIntegration(data);
      
      if (result && result.success) {
        // If we got a new ID back, update the state
        if (result.id && !data.id) {
          const updatedData = { ...data, id: result.id };
          
          if (data.integration_type === 'webhook') {
            setWebhookData(updatedData);
          } else if (data.integration_type === 'form') {
            setFormData(updatedData);
          } else if (data.integration_type === 'table') {
            setTableData(updatedData);
          }
        }
        
        toast.success(`${data.integration_type} integration saved successfully`);
      }
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
          <TabsList className="grid w-full" style={{ 
            gridTemplateColumns: 
              `repeat(${[hasWebhook, hasFormIntegration, hasTableIntegration]
                .filter(Boolean).length}, 1fr)` 
          }}>
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
                onSaveWebhook={() => handleSaveIntegration(webhookData)}
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
                onSave={() => handleSaveIntegration(formData)}
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
                onSave={() => handleSaveIntegration(tableData)}
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
