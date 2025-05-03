
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import WebhookUrlField from './WebhookUrlField';
import WebhookMethodSelector from './WebhookMethodSelector';
import WebhookModeToggle from './WebhookModeToggle';
import { RequestMethod } from '@/stores/webhookStore';

interface WebhookConfigCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  testUrl: string;
  productionUrl: string;
  method: RequestMethod;
  mode: 'test' | 'production';
  onTestUrlChange: (value: string) => void;
  onProductionUrlChange: (value: string) => void;
  onMethodChange: (value: RequestMethod) => void;
  onModeChange: (isProduction: boolean) => void;
  onTest: () => void;
  onSave: (e: React.FormEvent) => void;
  isSaving?: boolean; // Added this missing prop
  showSaveButton?: boolean; // Make this prop optional
}

const WebhookConfigCard = ({
  title,
  description,
  icon,
  testUrl,
  productionUrl,
  method,
  mode,
  onTestUrlChange,
  onProductionUrlChange,
  onMethodChange,
  onModeChange,
  onTest,
  onSave,
  isSaving = false, // Default value
  showSaveButton = true // Default value
}: WebhookConfigCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={onSave}>
        <CardContent className="space-y-4">
          <WebhookUrlField
            id="test-url"
            label="Test URL"
            value={testUrl}
            onChange={onTestUrlChange}
            placeholder="https://test-webhook.example.com/webhook"
            description="Used for testing in development"
          />
          
          <WebhookUrlField
            id="production-url"
            label="Production URL"
            value={productionUrl}
            onChange={onProductionUrlChange}
            placeholder="https://webhook.example.com/webhook"
            description="Used in production environment"
          />
          
          <WebhookMethodSelector
            value={method}
            onValueChange={onMethodChange}
          />
          
          <WebhookModeToggle
            isProduction={mode === 'production'}
            onToggle={(checked) => onModeChange(checked)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={onTest}
          >
            <Send className="h-4 w-4 mr-2" />
            Test Webhook
          </Button>
          {showSaveButton && (
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default WebhookConfigCard;
