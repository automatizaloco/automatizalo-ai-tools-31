
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import CustomPromptIntegration from './integrations/CustomPromptIntegration';
import CodeIntegration from './integrations/CodeIntegration';
import { toast } from 'sonner';

interface AutomationIntegrationsProps {
  automationId: string;
  hasWebhook?: boolean;
  hasFormIntegration?: boolean;
  hasTableIntegration?: boolean;
  hasCustomPrompt?: boolean;
}

const AutomationIntegrations: React.FC<AutomationIntegrationsProps> = ({
  automationId,
  hasFormIntegration = false,
  hasTableIntegration = false,
  hasCustomPrompt = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = () => {
    toast.success('Integration updated successfully');
  };

  const hasAnyIntegration = hasCustomPrompt || hasFormIntegration || hasTableIntegration;

  if (!hasAnyIntegration) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">No integrations enabled for this automation.</p>
            <p className="text-sm text-gray-400 mt-1">Enable integrations in the automation settings to configure them here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Integration Settings</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading integrations...</span>
        </div>
      )}

      {hasCustomPrompt && (
        <CustomPromptIntegration
          automationId={automationId}
          onUpdate={handleUpdate}
        />
      )}

      {hasFormIntegration && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">Form integration configuration will be available soon.</p>
        </div>
      )}

      {hasTableIntegration && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">Table integration configuration will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default AutomationIntegrations;
