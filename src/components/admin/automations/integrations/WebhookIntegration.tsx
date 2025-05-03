
import React from 'react';
import { Webhook, Loader2, Save } from 'lucide-react';
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';
import { toast } from 'sonner';
import type { Integration } from '@/types/automation';

interface WebhookIntegrationProps {
  webhookData: Integration;
  onWebhookTestUrlChange: (value: string) => void;
  onWebhookProdUrlChange: (value: string) => void;
  onSaveWebhook: () => void;
  isSaving: boolean;
}

const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({
  webhookData,
  onWebhookTestUrlChange,
  onWebhookProdUrlChange,
  onSaveWebhook,
  isSaving
}) => {
  return (
    <WebhookConfigCard 
      title="Webhook Integration" 
      description="Configure webhook URLs for this automation"
      icon={<Webhook className="h-5 w-5" />}
      testUrl={webhookData.test_url || ''}
      productionUrl={webhookData.production_url || ''}
      method="POST"
      mode="test"
      onTestUrlChange={onWebhookTestUrlChange}
      onProductionUrlChange={onWebhookProdUrlChange}
      onMethodChange={() => {}}
      onModeChange={() => {}}
      onTest={() => toast.info('Webhook test function not implemented')}
      onSave={(e) => {
        e.preventDefault();
        onSaveWebhook();
      }}
      isSaving={isSaving}
      showSaveButton={true}
    />
  );
};

export default WebhookIntegration;
