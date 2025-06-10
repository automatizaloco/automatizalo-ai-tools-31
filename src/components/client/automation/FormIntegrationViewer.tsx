
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from 'lucide-react';
import { useFormAnalytics } from '@/hooks/useFormAnalytics';
import FormEmbedRenderer from './form/FormEmbedRenderer';
import FormStatsCards from './form/FormStatsCards';
import FormSubmissionsList from './form/FormSubmissionsList';

interface FormIntegrationViewerProps {
  clientAutomationId: string;
  automationTitle: string;
}

interface FormSetting {
  id: string;
  integration_code?: string;
  status: string;
  updated_at: string;
}

const FormIntegrationViewer: React.FC<FormIntegrationViewerProps> = ({
  clientAutomationId,
  automationTitle
}) => {
  console.log('FormIntegrationViewer loading for client automation:', clientAutomationId);

  // Fetch form integration settings with proper error handling
  const { data: formSetting, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['form-settings', clientAutomationId],
    queryFn: async () => {
      console.log('Fetching form settings for client automation:', clientAutomationId);
      
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .eq('integration_type', 'form')
        .in('status', ['configured', 'active'])
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching form settings:', error);
        throw error;
      }

      console.log('Form settings fetched:', data);
      return data?.[0] as FormSetting || null;
    },
    enabled: !!clientAutomationId,
    retry: 2
  });

  // Fetch real form analytics
  const { 
    data: analyticsData, 
    isLoading: analyticsLoading,
    error: analyticsError
  } = useFormAnalytics(clientAutomationId);

  if (settingsLoading || analyticsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <Activity className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading form integration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (settingsError || analyticsError) {
    console.error('Error loading form integration:', settingsError || analyticsError);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error loading form integration</div>
            <p className="text-sm text-gray-500">
              {settingsError?.message || analyticsError?.message || 'Unknown error occurred'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = analyticsData?.stats || {
    totalSubmissions: 0,
    processedSubmissions: 0,
    pendingSubmissions: 0,
    processingRate: 0
  };

  const recentSubmissions = analyticsData?.submissions || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <FormStatsCards 
        formConfigured={!!formSetting && !!formSetting.integration_code}
        stats={stats}
      />

      {/* Form Display */}
      <Card>
        <CardHeader>
          <CardTitle>Form Integration</CardTitle>
          <CardDescription>
            Your embedded form that triggers the automation workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormEmbedRenderer 
            integrationCode={formSetting?.integration_code || ''}
            automationTitle={automationTitle}
          />
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <FormSubmissionsList submissions={recentSubmissions} />
    </div>
  );
};

export default FormIntegrationViewer;
