
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity, ExternalLink } from 'lucide-react';

interface ButtonIntegrationViewerProps {
  clientAutomationId: string;
  automationTitle: string;
}

interface ButtonSetting {
  id: string;
  button_url?: string;
  button_text?: string;
  status: string;
  updated_at: string;
}

const ButtonIntegrationViewer: React.FC<ButtonIntegrationViewerProps> = ({
  clientAutomationId,
  automationTitle
}) => {
  console.log('ButtonIntegrationViewer loading for client automation:', clientAutomationId);

  // Fetch button integration settings
  const { data: buttonSetting, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['button-settings', clientAutomationId],
    queryFn: async () => {
      console.log('Fetching button settings for client automation:', clientAutomationId);
      
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .eq('integration_type', 'button')
        .in('status', ['configured', 'active'])
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching button settings:', error);
        throw error;
      }

      console.log('Button settings fetched:', data);
      return data?.[0] as ButtonSetting || null;
    },
    enabled: !!clientAutomationId,
    retry: 2
  });

  if (settingsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <Activity className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading button integration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (settingsError) {
    console.error('Error loading button integration:', settingsError);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error loading button integration</div>
            <p className="text-sm text-gray-500">
              {settingsError?.message || 'Unknown error occurred'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!buttonSetting || !buttonSetting.button_url) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">Button integration is not configured yet.</p>
            <p className="text-sm text-gray-400 mt-1">Please contact support to set up your button integration.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleButtonClick = () => {
    if (buttonSetting.button_url) {
      window.open(buttonSetting.button_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Button Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Editor Integration</CardTitle>
          <CardDescription>
            Access your external editor for this automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Button 
              onClick={handleButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              {buttonSetting.button_text || 'Abrir Editor'}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              This will open the external editor in a new tab
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonIntegrationViewer;
