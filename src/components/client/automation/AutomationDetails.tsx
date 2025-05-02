
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Settings, BarChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Automation } from '@/types/automation';
import { Skeleton } from '@/components/ui/skeleton';

interface AutomationDetailProps {
  clientId: string;
}

const AutomationDetails: React.FC<AutomationDetailProps> = ({ clientId }) => {
  const { automationId } = useParams<{ automationId: string }>();
  const navigate = useNavigate();
  
  const { data: automation, isLoading, error } = useQuery({
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
  
  if (isLoading) {
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
  
  if (error || !automation) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <h3 className="font-medium text-red-600 mb-1">Error Loading Automation</h3>
        <p className="text-red-500 text-sm">
          {error ? (error as Error).message : 'Automation not found'}
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
                    <h3 className="font-medium mb-3">Custom Prompt</h3>
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6">
                      <p className="text-gray-500 text-sm">
                        Configure your customized prompts for this automation.
                      </p>
                    </div>
                  </div>
                )}
                
                {automation.has_webhook && (
                  <div>
                    <h3 className="font-medium mb-3">Webhook Integration</h3>
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6">
                      <p className="text-gray-500 text-sm">
                        Configure webhook URLs and triggers for this automation.
                      </p>
                    </div>
                  </div>
                )}
                
                {automation.has_form_integration && (
                  <div>
                    <h3 className="font-medium mb-3">Form Integration</h3>
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6">
                      <p className="text-gray-500 text-sm">
                        Set up n8n form integrations to launch this automation.
                      </p>
                    </div>
                  </div>
                )}
                
                {automation.has_table_integration && (
                  <div>
                    <h3 className="font-medium mb-3">Table Integration</h3>
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6">
                      <p className="text-gray-500 text-sm">
                        Connect to external data tables (Google Sheets, Airtable, etc).
                      </p>
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
