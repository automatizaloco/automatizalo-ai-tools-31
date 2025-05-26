
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileCode, ExternalLink, AlertCircle, Activity, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(false);

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

  // Mock form submission data
  const mockSubmissions = [
    { id: 1, date: '2024-01-26', name: 'John Doe', email: 'john@example.com', status: 'processed' },
    { id: 2, date: '2024-01-25', name: 'Jane Smith', email: 'jane@example.com', status: 'processed' },
    { id: 3, date: '2024-01-24', name: 'Bob Johnson', email: 'bob@example.com', status: 'pending' },
  ];

  const processFormCode = (code: string) => {
    // Basic validation and processing of embed code
    if (!code) return null;
    
    // Check if it's an iframe
    if (code.includes('<iframe')) {
      return { type: 'iframe', code };
    }
    
    // Check if it's a script
    if (code.includes('<script')) {
      return { type: 'script', code };
    }
    
    // Default to raw HTML
    return { type: 'html', code };
  };

  const renderFormEmbed = () => {
    if (!formSetting?.integration_code) {
      return (
        <div className="text-center py-8">
          <FileCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Form Configured</h3>
          <p className="text-gray-600">
            The form integration code has not been set up yet.
          </p>
        </div>
      );
    }

    const processedForm = processFormCode(formSetting.integration_code);
    
    if (!processedForm) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Form Code</h3>
          <p className="text-gray-600">
            The form integration code appears to be invalid or malformed.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Integrated Form</h3>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {processedForm.type.toUpperCase()}
          </Badge>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div 
            dangerouslySetInnerHTML={{ __html: processedForm.code }}
            className="min-h-[300px]"
          />
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Form submissions will automatically trigger your automation workflow.</p>
        </div>
      </div>
    );
  };

  if (settingsLoading) {
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

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileCode className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Form Status</p>
                <p className="text-2xl font-bold">
                  {formSetting ? 'Active' : 'Not Configured'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{mockSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-orange-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Processing Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((mockSubmissions.filter(s => s.status === 'processed').length / mockSubmissions.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Display */}
      <Card>
        <CardHeader>
          <CardTitle>Form Integration</CardTitle>
          <CardDescription>
            Your embedded form that triggers the automation workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderFormEmbed()}
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest form submissions and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    submission.status === 'processed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{submission.name}</p>
                    <p className="text-sm text-gray-500">{submission.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={submission.status === 'processed' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-yellow-50 text-yellow-700'
                    }
                  >
                    {submission.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{submission.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormIntegrationViewer;
