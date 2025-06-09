import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileCode, AlertCircle, Activity, BarChart3, ExternalLink, Maximize2 } from 'lucide-react';
import { format } from 'date-fns';
import { useFormAnalytics } from '@/hooks/useFormAnalytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const [showFullscreen, setShowFullscreen] = useState(false);

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

  const extractUrlFromCode = (code: string): string | null => {
    if (code.includes('<iframe')) {
      const srcMatch = code.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : null;
    }
    return null;
  };

  const isN8nForm = (code: string): boolean => {
    const url = extractUrlFromCode(code);
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('n8n') || 
             urlObj.pathname.includes('/webhook/') ||
             urlObj.pathname.includes('/form/');
    } catch {
      return false;
    }
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
    const formUrl = extractUrlFromCode(formSetting.integration_code);
    const isN8n = isN8nForm(formSetting.integration_code);
    
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
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Integrated Form</h3>
            {isN8n && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                ⚡ n8n Form
              </Badge>
            )}
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {processedForm.type.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {formUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(formUrl, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Direct
              </Button>
            )}
            
            <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Fullscreen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Form - {automationTitle}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <div 
                    dangerouslySetInnerHTML={{ __html: processedForm.code }}
                    className="w-full h-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-white">
          <div 
            dangerouslySetInnerHTML={{ __html: processedForm.code }}
            className="min-h-[400px] w-full"
          />
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>✅ Form submissions will automatically trigger your automation workflow.</p>
          {isN8n && (
            <p className="text-blue-600">⚡ This n8n form is configured with optimized settings for better compatibility.</p>
          )}
          {formUrl && (
            <p>🔗 Direct URL: <code className="bg-gray-100 px-1 rounded text-xs">{formUrl}</code></p>
          )}
        </div>
      </div>
    );
  };

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
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
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
                <p className="text-2xl font-bold">{stats.processingRate}%</p>
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
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <FileCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
                <p className="text-gray-600">
                  No form submissions have been received yet.
                </p>
              </div>
            ) : (
              recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      submission.status === 'processed' ? 'bg-green-500' : 
                      submission.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">
                        Form Submission #{submission.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Object.keys(submission.form_data).length} fields submitted
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={
                        submission.status === 'processed' 
                          ? 'bg-green-50 text-green-700' 
                          : submission.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }
                    >
                      {submission.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormIntegrationViewer;
