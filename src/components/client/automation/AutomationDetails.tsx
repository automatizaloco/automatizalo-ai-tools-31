import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Settings, BarChart, Save, Edit } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Automation } from '@/types/automation';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AutomationDetailProps {
  clientId: string;
}

interface CustomPrompt {
  id: string;
  prompt_text: string;
  client_id: string;
  automation_id: string;
}

interface Integration {
  id: string;
  integration_type: 'webhook' | 'form' | 'table';
  test_url?: string;
  production_url?: string;
  integration_code?: string;
}

const AutomationDetails: React.FC<AutomationDetailProps> = ({ clientId }) => {
  const { automationId } = useParams<{ automationId: string }>();
  const navigate = useNavigate();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch automation details
  const { data: automation, isLoading: loadingAutomation, error: automationError } = useQuery({
    queryKey: ['automation', automationId],
    queryFn: async () => {
      if (!automationId) throw new Error("Automation ID is required");
      
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('id', automationId)
        .single();
      
      if (error) throw error;
      return data as Automation;
    },
  });

  // Fetch custom prompt if it exists
  const { data: promptData, isLoading: loadingPrompt, refetch: refetchPrompt } = useQuery({
    queryKey: ['custom-prompt', automationId, clientId],
    queryFn: async () => {
      if (!automationId || !clientId) return null;
      
      const { data, error } = await (supabase as any)
        .from('automation_custom_prompts')
        .select('*')
        .eq('automation_id', automationId)
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (error) throw error;
      return data as CustomPrompt | null;
    },
    enabled: !!automationId && !!clientId && !!automation?.has_custom_prompt,
  });

  // Fetch integrations
  const { data: integrations, isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations', automationId],
    queryFn: async () => {
      if (!automationId) return [];
      
      const { data, error } = await (supabase as any)
        .from('automation_integrations')
        .select('*')
        .eq('automation_id', automationId);
      
      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!automationId && !!(automation?.has_webhook || automation?.has_form_integration || automation?.has_table_integration),
  });

  // Get specific integration by type
  const getIntegration = (type: 'webhook' | 'form' | 'table') => {
    return integrations?.find(i => i.integration_type === type);
  };

  // Set custom prompt from data when loaded
  useEffect(() => {
    if (promptData) {
      setCustomPrompt(promptData.prompt_text);
    }
  }, [promptData]);
  
  // Save custom prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async (promptText: string) => {
      if (!automationId || !clientId) throw new Error("Missing required IDs");
      
      if (promptData) {
        // Update existing prompt
        const { error } = await (supabase as any)
          .from('automation_custom_prompts')
          .update({ prompt_text: promptText, updated_at: new Date().toISOString() })
          .eq('id', promptData.id);
          
        if (error) throw error;
      } else {
        // Create new prompt
        const { error } = await (supabase as any)
          .from('automation_custom_prompts')
          .insert({
            automation_id: automationId,
            client_id: clientId,
            prompt_text: promptText
          });
          
        if (error) throw error;
      }
      
      return true;
    },
    onSuccess: () => {
      toast.success('Custom prompt saved successfully');
      setIsEditing(false);
      refetchPrompt();
    },
    onError: (error) => {
      console.error('Error saving custom prompt:', error);
      toast.error('Failed to save custom prompt');
    }
  });
  
  const handleSavePrompt = () => {
    if (customPrompt.trim().length === 0) {
      toast.error('Please enter a valid prompt');
      return;
    }
    
    savePromptMutation.mutate(customPrompt);
  };
  
  const isLoading = loadingAutomation || loadingPrompt || loadingIntegrations;
  
  if (isLoading && !automation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }
  
  if (automationError || !automation) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <h3 className="font-medium text-red-600 mb-1">Error Loading Automation</h3>
        <p className="text-red-500 text-sm">
          {automationError ? (automationError as Error).message : 'Automation not found'}
        </p>
        <Button 
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate('/client-portal')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const webhookIntegration = getIntegration('webhook');
  const formIntegration = getIntegration('form');
  const tableIntegration = getIntegration('table');

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 text-muted-foreground"
          onClick={() => navigate('/client-portal')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>
      
      {/* Automation header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {automation.image_url ? (
            <img 
              src={automation.image_url}
              alt={automation.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{automation.title}</h1>
          <p className="text-gray-600 mb-4">{automation.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-500">Installation Price</span>
              <p className="font-medium">${automation.installation_price.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Monthly Maintenance</span>
              <p className="font-medium">${automation.monthly_price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Automation details tabs */}
      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>General Info</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* This will be implemented later */}
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-8 text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Statistics Module</h3>
                <p className="text-gray-500">
                  This section will display automation performance metrics and analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Automation Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {automation.has_custom_prompt && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Custom Prompt</h3>
                      {!isEditing ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSavePrompt}
                          disabled={savePromptMutation.isPending}
                          className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                        >
                          {savePromptMutation.isPending ? (
                            <span>Saving...</span>
                          ) : (
                            <>
                              <Save className="h-3 w-3" />
                              <span>Save</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                      {isEditing ? (
                        <Textarea
                          className="min-h-[150px] resize-y"
                          placeholder="Enter your custom prompt here..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                        />
                      ) : loadingPrompt ? (
                        <Skeleton className="h-[100px] w-full" />
                      ) : promptData ? (
                        <div className="whitespace-pre-wrap bg-white p-3 rounded border border-gray-100">
                          {promptData.prompt_text}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          No custom prompt has been set. Click Edit to create one.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {automation.has_webhook && (
                  <div>
                    <h3 className="font-medium mb-3">Webhook Integration</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                      {loadingIntegrations ? (
                        <Skeleton className="h-[100px] w-full" />
                      ) : webhookIntegration ? (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">
                            This automation has an active webhook integration.
                          </p>
                          <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 px-3 py-2 rounded">
                            <span>Status:</span>
                            <span className="font-medium">Active</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Webhook integration is available but not yet configured by the administrator.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {automation.has_form_integration && (
                  <div>
                    <h3 className="font-medium mb-3">Form Integration</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                      {loadingIntegrations ? (
                        <Skeleton className="h-[100px] w-full" />
                      ) : formIntegration?.integration_code ? (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            This automation has an integrated form:
                          </p>
                          <div 
                            className="bg-white p-4 rounded border border-gray-200"
                            dangerouslySetInnerHTML={{ __html: formIntegration.integration_code }}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Form integration is available but not yet configured by the administrator.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {automation.has_table_integration && (
                  <div>
                    <h3 className="font-medium mb-3">Table Integration</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                      {loadingIntegrations ? (
                        <Skeleton className="h-[100px] w-full" />
                      ) : tableIntegration?.integration_code ? (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            This automation has an integrated table:
                          </p>
                          <div 
                            className="bg-white p-4 rounded border border-gray-200"
                            dangerouslySetInnerHTML={{ __html: tableIntegration.integration_code }}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Table integration is available but not yet configured by the administrator.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {!automation.has_custom_prompt && 
                  !automation.has_webhook && 
                  !automation.has_form_integration && 
                  !automation.has_table_integration && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No configurable features are available for this automation.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">About This Automation</h3>
                  <p className="text-gray-600 text-sm">{automation.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Supported Features</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {automation.has_custom_prompt && <li>Custom AI prompts</li>}
                    {automation.has_webhook && <li>Webhook integrations</li>}
                    {automation.has_form_integration && <li>Form integrations</li>}
                    {automation.has_table_integration && <li>Table/database connections</li>}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600">
                    If you need assistance with this automation, please contact support or create a new support ticket.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate('/client-portal/support/new')}
                  >
                    Create Support Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationDetails;
