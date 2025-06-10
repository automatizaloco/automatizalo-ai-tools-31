
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CustomPromptEditorProps {
  clientAutomationId: string;
  automationName: string;
}

interface PromptSetting {
  id: string;
  client_automation_id: string;
  prompt_text: string | null;
  prompt_webhook_url: string | null;
  status: 'pending' | 'configured' | 'active';
}

const CustomPromptEditor: React.FC<CustomPromptEditorProps> = ({
  clientAutomationId,
  automationName
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [promptSetting, setPromptSetting] = useState<PromptSetting | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  
  useEffect(() => {
    loadPromptSetting();
  }, [clientAutomationId]);
  
  const loadPromptSetting = async () => {
    if (!clientAutomationId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .eq('integration_type', 'custom_prompt')
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setPromptSetting({
          id: data.id,
          client_automation_id: data.client_automation_id,
          prompt_text: data.prompt_text,
          prompt_webhook_url: data.prompt_webhook_url,
          status: data.status as 'pending' | 'configured' | 'active'
        });
        setCustomPrompt(data.prompt_text || '');
      }
    } catch (error) {
      console.error('Failed to load prompt setting:', error);
      toast.error('Failed to load custom prompt settings');
    } finally {
      setIsLoading(false);
    }
  };

  const sendPromptToWebhook = async (promptText: string, webhookUrl: string) => {
    try {
      console.log('Sending prompt to webhook:', webhookUrl);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          automation_name: automationName,
          client_automation_id: clientAutomationId,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`);
      }

      console.log('Prompt sent to webhook successfully');
    } catch (error) {
      console.error('Failed to send prompt to webhook:', error);
      // Don't show error to user, just log it
    }
  };
  
  const handleSavePrompt = async () => {
    if (!promptSetting || !clientAutomationId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('client_integration_settings')
        .update({ prompt_text: customPrompt })
        .eq('id', promptSetting.id);
      
      if (error) throw error;

      // Send prompt to webhook if webhook URL exists
      if (promptSetting.prompt_webhook_url && customPrompt.trim()) {
        await sendPromptToWebhook(customPrompt, promptSetting.prompt_webhook_url);
      }
      
      toast.success('Custom prompt saved successfully');
    } catch (error) {
      console.error('Failed to save custom prompt:', error);
      toast.error('Failed to save custom prompt');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2">Loading prompt settings...</span>
      </div>
    );
  }
  
  if (!promptSetting) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">Custom prompt is not available for this automation.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (promptSetting.status === 'pending') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">Custom prompt is not configured yet.</p>
            <p className="text-sm text-gray-400 mt-1">Please contact support to set up your custom prompt.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Custom Prompt for {automationName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Custom Prompt
          </label>
          <Textarea
            rows={6}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom prompt here..."
            className="resize-y"
          />
          <p className="mt-1 text-sm text-gray-500">
            Customize the prompt to fine-tune how this automation works for your specific needs.
          </p>
        </div>
        
        <Button 
          onClick={handleSavePrompt} 
          disabled={isSaving || customPrompt === promptSetting.prompt_text}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Custom Prompt
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomPromptEditor;
