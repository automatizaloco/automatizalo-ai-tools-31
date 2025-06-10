
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Integration } from '@/types/automation';

interface CustomPromptIntegrationProps {
  automationId: string;
  onUpdate: () => void;
}

const CustomPromptIntegration: React.FC<CustomPromptIntegrationProps> = ({
  automationId,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    loadIntegration();
  }, [automationId]);

  const loadIntegration = async () => {
    setIsLoading(true);
    try {
      // Query the integrations table using a different approach
      const { data, error } = await supabase
        .rpc('exec_sql', { 
          sql_query: `SELECT * FROM integrations WHERE automation_id = '${automationId}' AND integration_type = 'custom_prompt' LIMIT 1` 
        });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.length > 0) {
        const integrationData = data[0];
        setIntegration(integrationData);
        setWebhookUrl(integrationData.prompt_webhook_url || '');
      }
    } catch (error) {
      console.error('Failed to load custom prompt integration:', error);
      toast.error('Failed to load custom prompt integration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (integration) {
        // Update existing integration
        const { error } = await supabase
          .rpc('exec_sql', { 
            sql_query: `UPDATE integrations SET prompt_webhook_url = '${webhookUrl}', updated_at = NOW() WHERE id = '${integration.id}'` 
          });

        if (error) throw error;
      } else {
        // Create new integration
        const { error } = await supabase
          .rpc('exec_sql', { 
            sql_query: `INSERT INTO integrations (automation_id, integration_type, prompt_webhook_url, created_at, updated_at) VALUES ('${automationId}', 'custom_prompt', '${webhookUrl}', NOW(), NOW())` 
          });

        if (error) throw error;
      }

      toast.success('Custom prompt webhook saved successfully');
      onUpdate();
      loadIntegration();
    } catch (error) {
      console.error('Failed to save custom prompt webhook:', error);
      toast.error('Failed to save custom prompt webhook');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2">Loading custom prompt integration...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Custom Prompt Integration
        </CardTitle>
        <CardDescription>
          Configure the webhook URL that will receive custom prompt updates from clients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-n8n-instance.com/webhook/custom-prompt"
            className="mt-1"
          />
          <p className="mt-1 text-sm text-gray-500">
            This webhook will receive POST requests with the custom prompt data when clients save their prompts.
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving || !webhookUrl.trim()}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Webhook Configuration
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomPromptIntegration;
