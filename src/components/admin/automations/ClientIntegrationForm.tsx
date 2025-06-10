import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, Save, Webhook, Box, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';
import FormUrlConverter from './FormUrlConverter';
import { 
  ClientAutomationWithDetails, 
  ClientIntegrationSetting,
  fetchClientIntegrationSettings,
  saveClientIntegrationSetting,
  updateClientAutomationStatus
} from './client-integration-utils';
import CodeIntegration from './integrations/CodeIntegration';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      console.log('Loading integration settings for client automation:', clientAutomation.id);
      const settings = await fetchClientIntegrationSettings(clientAutomation.id);
      console.log('Integration settings loaded:', settings);
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

  const sendPromptToWebhook = async (promptText: string, webhookUrl: string) => {
    try {
      console.log('Sending prompt template to webhook:', webhookUrl);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          automation_name: clientAutomation.automation?.title,
          client_automation_id: clientAutomation.id,
          client_email: clientAutomation.client?.email,
          action: 'template_created',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`);
      }

      console.log('Prompt template sent to webhook successfully');
    } catch (error) {
      console.error('Failed to send prompt template to webhook:', error);
      // Don't show error to user, just log it
    }
  };
  
  const getSettingByType = (type: string): ClientIntegrationSetting | undefined => {
    return integrationSettings.find(setting => setting.integration_type === type);
  };
  
  const handleSave = async (setting: ClientIntegrationSetting) => {
    setIsSaving(true);
    try {
      console.log('Saving integration setting:', setting.integration_type);
      
      const result = await saveClientIntegrationSetting({
        ...setting,
        status: 'configured'
      });
      
      if (result?.success) {
        toast.success(`${setting.integration_type} integration configured successfully`);
        
        // Send prompt to webhook if it's a custom_prompt with webhook URL and prompt text
        if (setting.integration_type === 'custom_prompt' && 
            setting.prompt_webhook_url && 
            setting.prompt_text?.trim()) {
          await sendPromptToWebhook(setting.prompt_text, setting.prompt_webhook_url);
        }
        
        // Reload settings to get the latest data
        await loadIntegrationSettings();
        
        // Update client automation status to in_progress if it was pending
        if (clientAutomation.setup_status === 'pending') {
          await updateClientAutomationStatus(clientAutomation.id, 'in_progress');
          onConfigUpdate();
        }
      } else {
        throw new Error('Failed to save setting');
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
          {availableIntegrations.includes('button') && 
            <TabsTrigger value="button">Editor Button</TabsTrigger>}
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
        
        {availableIntegrations.includes('button') && (
          <TabsContent value="button" className="pt-4">
            {renderButtonIntegration()}
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
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                value={promptSetting.prompt_webhook_url || ''}
                onChange={(e) => {
                  const updatedSettings = integrationSettings.map(s =>
                    s.id === promptSetting.id ? { ...s, prompt_webhook_url: e.target.value } : s
                  );
                  setIntegrationSettings(updatedSettings);
                }}
                placeholder="https://your-n8n-instance.com/webhook/custom-prompt"
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">
                This webhook will receive POST requests with custom prompt data when the client saves their prompts.
              </p>
            </div>
            
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Form Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="form-integration" className="block text-sm font-medium text-gray-700 mb-1">
                Form URL or Iframe Code
              </label>
              <FormUrlConverter
                value={formSetting.integration_code || ''}
                onChange={(value) => {
                  console.log('Form integration code changed:', value);
                  const updatedSettings = integrationSettings.map(s =>
                    s.id === formSetting.id ? { ...s, integration_code: value } : s
                  );
                  setIntegrationSettings(updatedSettings);
                }}
                placeholder="Enter form URL (e.g., https://forms.google.com/...) or paste iframe code"
              />
              <p className="mt-1 text-sm text-gray-500">
                Paste either a direct URL to your form or the complete iframe embed code.
              </p>
            </div>
            
            <Button 
              onClick={() => handleSave(formSetting)}
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
                  Save Form Integration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderButtonIntegration = () => {
    const buttonSetting = getSettingByType('button');
    if (!buttonSetting) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Editor Button Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-url">Button URL</Label>
              <Input
                id="button-url"
                type="url"
                value={buttonSetting.button_url || ''}
                onChange={(e) => {
                  const updatedSettings = integrationSettings.map(s =>
                    s.id === buttonSetting.id ? { ...s, button_url: e.target.value } : s
                  );
                  setIntegrationSettings(updatedSettings);
                }}
                placeholder="https://your-editor.com/automation/123"
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL that the button will redirect to when clicked.
              </p>
            </div>
            
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                type="text"
                value={buttonSetting.button_text || 'Abrir Editor'}
                onChange={(e) => {
                  const updatedSettings = integrationSettings.map(s =>
                    s.id === buttonSetting.id ? { ...s, button_text: e.target.value } : s
                  );
                  setIntegrationSettings(updatedSettings);
                }}
                placeholder="Abrir Editor / Open Editor"
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">
                Text that will be displayed on the button. Use "Abrir Editor" for Spanish or "Open Editor" for English.
              </p>
            </div>
            
            <Button 
              onClick={() => handleSave(buttonSetting)}
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
                  Save Button Integration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
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
