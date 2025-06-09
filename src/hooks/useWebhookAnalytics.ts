
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WebhookStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  successRate: number;
}

interface WebhookLog {
  id: string;
  webhook_url: string;
  method: string;
  status_code: number;
  response_time: number;
  success: boolean;
  created_at: string;
}

interface ChartData {
  date: string;
  requests: number;
  successful: number;
  failed: number;
  avgResponseTime: number;
}

export const useWebhookAnalytics = (clientAutomationId: string, days: number = 7) => {
  return useQuery({
    queryKey: ['webhook-analytics', clientAutomationId, days],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('webhook-analytics', {
        method: 'GET',
        body: new URLSearchParams({
          client_automation_id: clientAutomationId,
          days: days.toString()
        })
      });

      if (error) throw error;
      
      return data as {
        success: boolean;
        stats: WebhookStats;
        logs: WebhookLog[];
        chartData: ChartData[];
      };
    },
    enabled: !!clientAutomationId
  });
};
