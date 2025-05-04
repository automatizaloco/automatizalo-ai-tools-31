
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Webhook } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookUrlDisplayProps {
  webhookData: {
    test_url?: string;
    production_url?: string;
  };
}

const WebhookUrlDisplay: React.FC<WebhookUrlDisplayProps> = ({ webhookData }) => {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied({ ...copied, [key]: true });
        toast.success('URL copied to clipboard');
        setTimeout(() => {
          setCopied({ ...copied, [key]: false });
        }, 2000);
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-blue-500" />
          Webhook Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {webhookData.production_url && (
          <div>
            <h3 className="text-sm font-medium mb-1">Production URL</h3>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-3 rounded-md flex-1 font-mono text-sm truncate">
                {webhookData.production_url}
              </div>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => handleCopy(webhookData.production_url!, 'prod')}
              >
                {copied['prod'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
        
        {webhookData.test_url && (
          <div>
            <h3 className="text-sm font-medium mb-1">Testing URL</h3>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-3 rounded-md flex-1 font-mono text-sm truncate">
                {webhookData.test_url}
              </div>
              <Button 
                size="icon" 
                variant="outline"
                onClick={() => handleCopy(webhookData.test_url!, 'test')}
              >
                {copied['test'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
        
        <div className="border-t pt-4 mt-2">
          <h3 className="text-sm font-medium">How to use</h3>
          <p className="text-sm text-gray-600 mt-1">
            Send a POST request to these webhook URLs to trigger your automation.
            The production URL is for your live environment, and the test URL is for development and testing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlDisplay;
