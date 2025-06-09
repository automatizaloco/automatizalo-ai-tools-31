
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileCode, AlertCircle, ExternalLink, Maximize2 } from 'lucide-react';
import { processFormCode, extractUrlFromCode, isN8nUrl } from './FormProcessingUtils';

interface FormEmbedRendererProps {
  integrationCode: string;
  automationTitle: string;
}

const FormEmbedRenderer: React.FC<FormEmbedRendererProps> = ({
  integrationCode,
  automationTitle
}) => {
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (!integrationCode) {
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

  const processedForm = processFormCode(integrationCode);
  const formUrl = extractUrlFromCode(integrationCode);
  const isN8n = formUrl ? isN8nUrl(formUrl) : false;
  
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

export default FormEmbedRenderer;
