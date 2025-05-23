import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, Save, Webhook, Box, Table, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';
import { 
  ClientAutomationWithDetails, 
  ClientIntegrationSetting,
  fetchClientIntegrationSettings,
  saveClientIntegrationSetting,
  updateClientAutomationStatus
} from './client-integration-utils';
import CodeIntegration from './integrations/CodeIntegration';

interface ClientIntegrationFormProps {
  clientAutomation: ClientAutomationWithDetails;
  onBack: () => void;
  onConfigUpdate: () => void;
}

const ClientIntegrationForm: React.FC<ClientIntegrationFormProps> = ({
  clientAutomation,
  onBack,
  onConfigUpdate
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('webhook');
  const [integrationSettings, setIntegrationSettings] = useState<ClientIntegrationSetting[]>([]);
  
  useEffect(() => {
    loadIntegrationSettings();
  }, [clientAutomation.id]);
  
  const loadIntegrationSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await fetchClientIntegrationSettings(clientAutomation.id);
      setIntegrationSettings(settings);
      
      // Set initial active tab based on available integrations
      if (settings.length > 0) {
        setActiveTab(settings[0].integration_type);
      }
    } catch (error) {
      console.error('Failed to load integration settings:', error);
      toast.error('Failed to load integration settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSettingByType = (type: string): ClientIntegrationSetting | undefined => {
    return integrationSettings.find(setting => setting.integration_type === type);
  };
  
  const handleSave = async (setting: ClientIntegrationSetting) => {
    setIsSaving(true);
    try {
      const result = await saveClientIntegrationSetting({
        ...setting,
        status: 'configured'
      });
      
      if (result?.success) {
        toast.success(`${setting.integration_type} integration configured successfully`);
        await loadIntegrationSettings();
        
        // Update client automation status to in_progress if it was pending
        if (clientAutomation.setup_status === 'pending') {
          await updateClientAutomationStatus(clientAutomation.id, 'in_progress');
          onConfigUpdate();
        }
      }
    } catch (error) {
      console.error(`Failed to save ${setting.integration_type} integration:`, error);
      toast.error(`Failed to save ${setting.integration_type} integration`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCompleteSetup = async () => {
    setIsSaving(true);
    try {
      const pendingSettings = integrationSettings.filter(s => s.status === 'pending');
      
      if (pendingSettings.length > 0) {
        toast.warning('Please configure all integrations before completing setup');
        return;
      }
      
      // Update all integrations to active
      for (const setting of integrationSettings) {
        if (setting.status !== 'active') {
          await saveClientIntegrationSetting({
            ...setting,
            status: 'active'
          });
        }
      }
      
      // Update client automation status to completed
      await updateClientAutomationStatus(clientAutomation.id, 'completed');
      onConfigUpdate();
      
      toast.success('Client automation setup completed successfully');
    } catch (error) {
      console.error('Failed to complete setup:', error);
      toast.error('Failed to complete setup');
    } finally {
      setIsSaving(false);
    }
  };
  
  const updateWebhookData = (setting: ClientIntegrationSetting, field: string, value: string) => {
    const updatedSettings = integrationSettings.map(s => 
      s.id === setting.id ? { ...s, [field]: value } : s
    );
    setIntegrationSettings(updatedSettings);
  };
  
  const handleWebhookSave = (setting: ClientIntegrationSetting) => {
    handleSave(setting);
  };
  
  const renderIntegrationTabs = () => {
    const availableIntegrations = integrationSettings.map(s => s.integration_type);
    
    if (availableIntegrations.length === 0) {
      return (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No integrations available for this automation.</p>
        </div>
      );
    }
    
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full" style={{ 
          gridTemplateColumns: `repeat(${availableIntegrations.length}, 1fr)` 
        }}>
          {availableIntegrations.includes('webhook') && 
            <TabsTrigger value="webhook">Webhook</TabsTrigger>}
          {availableIntegrations.includes('custom_prompt') && 
            <TabsTrigger value="custom_prompt">Custom Prompt</TabsTrigger>}
          {availableIntegrations.includes('form') && 
            <TabsTrigger value="form">Form</TabsTrigger>}
          {availableIntegrations.includes('table') && 
            <TabsTrigger value="table">Table</TabsTrigger>}
        </TabsList>
        
        {availableIntegrations.includes('webhook') && (
          <TabsContent value="webhook" className="pt-4">
            {renderWebhookIntegration()}
          </TabsContent>
        )}
        
        {availableIntegrations.includes('custom_prompt') && (
          <TabsContent value="custom_prompt" className="pt-4">
            {renderCustomPromptIntegration()}
          </TabsContent>
        )}
        
        {availableIntegrations.includes('form') && (
          <TabsContent value="form" className="pt-4">
            {renderFormIntegration()}
          </TabsContent>
        )}
        
        {availableIntegrations.includes('table') && (
          <TabsContent value="table" className="pt-4">
            {renderTableIntegration()}
          </TabsContent>
        )}
      </Tabs>
    );
  };
  
  const renderWebhookIntegration = () => {
    const webhookSetting = getSettingByType('webhook');
    if (!webhookSetting) return null;
    
    return (
      <WebhookConfigCard
        title="Client Webhook Configuration"
        description="Configure webhook URLs for this client automation"
        icon={<Webhook className="h-5 w-5" />}
        testUrl={webhookSetting.test_url || ''}
        productionUrl={webhookSetting.production_url || ''}
        method="POST"
        mode="test"
        onTestUrlChange={(value) => updateWebhookData(webhookSetting, 'test_url', value)}
        onProductionUrlChange={(value) => updateWebhookData(webhookSetting, 'production_url', value)}
        onMethodChange={() => {}}
        onModeChange={() => {}}
        onTest={() => toast.info('Webhook test function not implemented')}
        onSave={(e) => {
          e.preventDefault();
          handleWebhookSave(webhookSetting);
        }}
        isSaving={isSaving}
        showSaveButton={true}
      />
    );
  };
  
  const renderCustomPromptIntegration = () => {
    const promptSetting = getSettingByType('custom_prompt');
    if (!promptSetting) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Prompt Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt-template" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt Template
              </label>
              <textarea
                id="prompt-template"
                rows={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter the prompt template for this client..."
                value={promptSetting.prompt_text || ''}
                onChange={(e) => {
                  const updatedSettings = integrationSettings.map(s =>
                    s.id === promptSetting.id ? { ...s, prompt_text: e.target.value } : s
                  );
                  setIntegrationSettings(updatedSettings);
                }}
              />
              <p className="mt-1 text-sm text-gray-500">
                This template will be available for the client to customize.
              </p>
            </div>
            
            <Button 
              onClick={() => handleSave(promptSetting)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderFormIntegration = () => {
    const formSetting = getSettingByType('form');
    if (!formSetting) return null;
    
    return (
      <CodeIntegration
        data={{
          automation_id: '',
          integration_type: 'form',
          ...formSetting
        }}
        type="form"
        title="Form Integration"
        description="Paste the HTML code for the client's form embed"
        placeholder="<iframe src='https://form-url' ...>"
        icon={<Box className="h-5 w-5" />}
        onCodeChange={(value) => {
          const updatedSettings = integrationSettings.map(s =>
            s.id === formSetting.id ? { ...s, integration_code: value } : s
          );
          setIntegrationSettings(updatedSettings);
        }}
        onSave={() => handleSave(formSetting)}
        isSaving={isSaving}
      />
    );
  };
  
  const renderTableIntegration = () => {
    const tableSetting = getSettingByType('table');
    if (!tableSetting) return null;
    
    return (
      <CodeIntegration
        data={{
          automation_id: '',
          integration_type: 'table',
          ...tableSetting
        }}
        type="table"
        title="Table Integration"
        description="Paste the HTML code for the client's table embed"
        placeholder="<iframe src='https://table-url' ...>"
        icon={<Table className="h-5 w-5" />}
        onCodeChange={(value) => {
          const updatedSettings = integrationSettings.map(s =>
            s.id === tableSetting.id ? { ...s, integration_code: value } : s
          );
          setIntegrationSettings(updatedSettings);
        }}
        onSave={() => handleSave(tableSetting)}
        isSaving={isSaving}
      />
    );
  };
  
  const getStatusSummary = () => {
    const total = integrationSettings.length;
    const configured = integrationSettings.filter(s => s.status === 'configured' || s.status === 'active').length;
    const completed = clientAutomation.setup_status === 'completed';
    
    return (
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="text-sm font-medium">Integration Status</h3>
          <p className="text-sm text-gray-500">{configured}/{total} configured</p>
        </div>
        <div>
          {completed ? (
            <Badge className="bg-green-100 text-green-800">Setup Completed</Badge>
          ) : (
            <Button 
              size="sm"
              onClick={handleCompleteSetup}
              disabled={configured < total || isSaving}
            >
              Mark as Completed
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 mt-2">Loading integration settings...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Client Automations
        </Button>
        <h2 className="text-xl font-semibold">
          Configuring: {clientAutomation.automation?.title}
        </h2>
      </div>
      
      <div className="text-sm text-gray-500">
        Client: {clientAutomation.client?.email}
      </div>
      
      {getStatusSummary()}
      
      {renderIntegrationTabs()}
    </div>
  );
};

export default ClientIntegrationForm;
