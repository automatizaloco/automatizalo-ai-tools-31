
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Table, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CodeEmbedView from './CodeEmbedView';
import CustomPromptEditor from './CustomPromptEditor';

interface IntegrationViewProps {
  clientAutomationId: string;
  automationTitle: string;
  hasCustomPrompt?: boolean;
  hasFormIntegration?: boolean;
  hasTableIntegration?: boolean;
}

interface IntegrationSetting {
  id: string;
  integration_type: string;
  test_url?: string;
  production_url?: string;
  integration_code?: string;
  prompt_text?: string;
  status: 'pending' | 'configured' | 'active';
}

const IntegrationView: React.FC<IntegrationViewProps> = ({
  clientAutomationId,
  automationTitle,
  hasCustomPrompt,
  hasFormIntegration,
  hasTableIntegration
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
      // Only load non-webhook integrations (custom_prompt, form, table)
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .in('integration_type', ['custom_prompt', 'form', 'table'])
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
  const tableSetting = integrationSettings.find(s => s.integration_type === 'table');
  
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
            {availableTypes.includes('table') && 
              <TabsTrigger value="table">Table</TabsTrigger>}
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
              <CodeEmbedView 
                data={formSetting!}
                title="Form Integration"
                icon={<FileCode className="h-5 w-5 text-green-500" />}
              />
            </TabsContent>
          )}
          
          {availableTypes.includes('table') && (
            <TabsContent value="table" className="pt-4">
              <CodeEmbedView 
                data={tableSetting!}
                title="Table Integration"
                icon={<Table className="h-5 w-5 text-amber-500" />}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationView;
