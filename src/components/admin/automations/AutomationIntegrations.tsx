
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Globe, Box, Table } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';

interface AutomationIntegrationsProps {
  automationId: string;
  hasWebhook: boolean;
  hasFormIntegration: boolean;
  hasTableIntegration: boolean;
}

interface Integration {
  id?: string;
  automation_id: string;
  integration_type: 'webhook' | 'form' | 'table';
  test_url?: string;
  production_url?: string;
  integration_code?: string;
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
        // Use a simple type cast to work around TypeScript limitations
        const response = await supabase
          .from('automation_integrations')
          .select('*')
          .eq('automation_id', automationId);
          
        const data = response.data as Integration[] | null;
        const error = response.error;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Sort integrations by type
          data.forEach((integration: Integration) => {
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
  
  const saveWebhookIntegration = async () => {
    if (!webhookData || !automationId) return;
    
    setIsSaving(true);
    try {
      // If it has an ID, update; otherwise, insert
      if (webhookData.id) {
        const response = await supabase
          .from('automation_integrations')
          .update({
            test_url: webhookData.test_url,
            production_url: webhookData.production_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', webhookData.id);
          
        const error = response.error;
        if (error) throw error;
      } else {
        const response = await supabase
          .from('automation_integrations')
          .insert({
            automation_id: automationId,
            integration_type: 'webhook',
            test_url: webhookData.test_url,
            production_url: webhookData.production_url
          })
          .select();
          
        const data = response.data as Integration[] | null;
        const error = response.error;
        if (error) throw error;
        
        if (data && data.length > 0) {
          setWebhookData({ ...webhookData, id: data[0].id });
        }
      }
      
      toast.success('Webhook integration saved successfully');
    } catch (error) {
      console.error('Failed to save webhook integration:', error);
      toast.error('Failed to save webhook integration');
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveFormIntegration = async () => {
    if (!formData || !automationId) return;
    
    setIsSaving(true);
    try {
      if (formData.id) {
        const response = await supabase
          .from('automation_integrations')
          .update({
            integration_code: formData.integration_code,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);
          
        const error = response.error;
        if (error) throw error;
      } else {
        const response = await supabase
          .from('automation_integrations')
          .insert({
            automation_id: automationId,
            integration_type: 'form',
            integration_code: formData.integration_code
          })
          .select();
          
        const data = response.data as Integration[] | null;
        const error = response.error;
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFormData({ ...formData, id: data[0].id });
        }
      }
      
      toast.success('Form integration saved successfully');
    } catch (error) {
      console.error('Failed to save form integration:', error);
      toast.error('Failed to save form integration');
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveTableIntegration = async () => {
    if (!tableData || !automationId) return;
    
    setIsSaving(true);
    try {
      if (tableData.id) {
        const response = await supabase
          .from('automation_integrations')
          .update({
            integration_code: tableData.integration_code,
            updated_at: new Date().toISOString()
          })
          .eq('id', tableData.id);
          
        const error = response.error;
        if (error) throw error;
      } else {
        const response = await supabase
          .from('automation_integrations')
          .insert({
            automation_id: automationId,
            integration_type: 'table',
            integration_code: tableData.integration_code
          })
          .select();
          
        const data = response.data as Integration[] | null;
        const error = response.error;
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTableData({ ...tableData, id: data[0].id });
        }
      }
      
      toast.success('Table integration saved successfully');
    } catch (error) {
      console.error('Failed to save table integration:', error);
      toast.error('Failed to save table integration');
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
  
  const handleTestWebhook = () => {
    // Placeholder for webhook testing functionality
    toast.info('Webhook test function not implemented');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading integrations...</span>
      </div>
    );
  }
  
  // No integrations available
  if (!hasWebhook && !hasFormIntegration && !hasTableIntegration) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">No integrations have been enabled for this automation.</p>
            <p className="text-sm text-gray-400 mt-1">Edit the automation to enable integrations.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            {hasWebhook && <TabsTrigger value="webhook" disabled={!hasWebhook}>Webhook</TabsTrigger>}
            {hasFormIntegration && <TabsTrigger value="form" disabled={!hasFormIntegration}>Form</TabsTrigger>}
            {hasTableIntegration && <TabsTrigger value="table" disabled={!hasTableIntegration}>Table</TabsTrigger>}
          </TabsList>
          
          {hasWebhook && (
            <TabsContent value="webhook" className="pt-4">
              {webhookData && (
                <WebhookConfigCard 
                  title="Webhook Integration" 
                  description="Configure webhook URLs for this automation"
                  icon={<Globe className="h-5 w-5" />}
                  testUrl={webhookData.test_url || ''}
                  productionUrl={webhookData.production_url || ''}
                  method="POST"
                  mode="test"
                  onTestUrlChange={handleWebhookTestUrlChange}
                  onProductionUrlChange={handleWebhookProdUrlChange}
                  onMethodChange={() => {}}
                  onModeChange={() => {}}
                  onTest={handleTestWebhook}
                  onSave={saveWebhookIntegration}
                />
              )}
            </TabsContent>
          )}
          
          {hasFormIntegration && (
            <TabsContent value="form" className="pt-4">
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
                      onChange={handleFormCodeChange}
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
                    onClick={saveFormIntegration} 
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
            </TabsContent>
          )}
          
          {hasTableIntegration && (
            <TabsContent value="table" className="pt-4">
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
                      onChange={handleTableCodeChange}
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
                    onClick={saveTableIntegration} 
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
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AutomationIntegrations;
