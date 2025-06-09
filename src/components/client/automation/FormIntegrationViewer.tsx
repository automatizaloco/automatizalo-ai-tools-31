
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
}

const FormIntegrationViewer: React.FC<FormIntegrationViewerProps> = ({
  clientAutomationId,
  automationTitle
}) => {
  // Fetch form integration settings
  const { data: formSetting, isLoading: settingsLoading } = useQuery({
    queryKey: ['form-settings', clientAutomationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .eq('integration_type', 'form')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as FormSetting;
    },
  });

  // Fetch real form analytics
  const { 
    data: analyticsData, 
    isLoading: analyticsLoading 
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
        formConfigured={!!formSetting}
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
