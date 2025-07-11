
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ExternalLink, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CodeEmbedView from './CodeEmbedView';
import CustomPromptEditor from './CustomPromptEditor';
import ButtonIntegrationViewer from './ButtonIntegrationViewer';

interface IntegrationViewProps {
  clientAutomationId: string;
  automationTitle: string;
  hasCustomPrompt?: boolean;
  hasFormIntegration?: boolean;
  hasButtonIntegration?: boolean;
}

interface IntegrationSetting {
  id: string;
  integration_type: string;
  test_url?: string;
  production_url?: string;
  integration_code?: string;
  prompt_text?: string;
  button_url?: string;
  button_text?: string;
  status: 'pending' | 'configured' | 'active';
}

const IntegrationView: React.FC<IntegrationViewProps> = ({
  clientAutomationId,
  automationTitle,
  hasCustomPrompt,
  hasFormIntegration,
  hasButtonIntegration
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSetting[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  
  useEffect(() => {
    loadIntegrationSettings();
  }, [clientAutomationId]);
  
  const loadIntegrationSettings = async () => {
    if (!clientAutomationId) return;
    
    setIsLoading(true);
    try {
      // Only load non-webhook integrations (custom_prompt, form, button)
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .in('integration_type', ['custom_prompt', 'form', 'button'])
        .eq('status', 'active')
        .order('integration_type');
      
      if (error) throw error;
      
      setIntegrationSettings(data as IntegrationSetting[]);
      
      // Set initial active tab
      if (data.length > 0) {
        setActiveTab(data[0].integration_type);
      }
    } catch (error) {
      console.error('Failed to load integration settings:', error);
      toast.error('Failed to load integration settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2">Loading integrations...</span>
      </div>
    );
  }
  
  if (integrationSettings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">No active integrations available.</p>
            <p className="text-sm text-gray-400 mt-1">Please contact support for assistance.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const availableTypes = integrationSettings.map(s => s.integration_type);
  const formSetting = integrationSettings.find(s => s.integration_type === 'form');
  const buttonSetting = integrationSettings.find(s => s.integration_type === 'button');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full" style={{ 
            gridTemplateColumns: `repeat(${availableTypes.length}, 1fr)` 
          }}>
            {availableTypes.includes('custom_prompt') && 
              <TabsTrigger value="custom_prompt">Custom Prompt</TabsTrigger>}
            {availableTypes.includes('form') && 
              <TabsTrigger value="form">Form</TabsTrigger>}
            {availableTypes.includes('button') && 
              <TabsTrigger value="button">Editor</TabsTrigger>}
          </TabsList>
          
          {availableTypes.includes('custom_prompt') && (
            <TabsContent value="custom_prompt" className="pt-4">
              <CustomPromptEditor 
                clientAutomationId={clientAutomationId}
                automationName={automationTitle}
              />
            </TabsContent>
          )}
          
          {availableTypes.includes('form') && (
            <TabsContent value="form" className="pt-4">
              <div className="space-y-4">
                <CodeEmbedView 
                  data={formSetting!}
                  title="Form Integration"
                  icon={<FileCode className="h-5 w-5 text-green-500" />}
                />
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    Form submissions will be processed automatically. You can view detailed analytics in the main automation dashboard.
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
          
          {availableTypes.includes('button') && (
            <TabsContent value="button" className="pt-4">
              <div className="space-y-4">
                <div className="text-center py-8">
                  <button 
                    onClick={() => {
                      if (buttonSetting?.button_url) {
                        window.open(buttonSetting.button_url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md transition-colors duration-200 flex items-center mx-auto"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    {buttonSetting?.button_text || 'Abrir Editor'}
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    This will open the external editor in a new tab
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-700">
                    Access your external editor to work with your automation data and configurations.
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationView;
