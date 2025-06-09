
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FormStats {
  totalSubmissions: number;
  processedSubmissions: number;
  pendingSubmissions: number;
  processingRate: number;
}

interface FormSubmission {
  id: string;
  form_data: any;
  status: string;
  created_at: string;
}

export const useFormAnalytics = (clientAutomationId: string) => {
  return useQuery({
    queryKey: ['form-analytics', clientAutomationId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('form-analytics', {
        method: 'GET',
        body: new URLSearchParams({
          client_automation_id: clientAutomationId
        })
      });

      if (error) throw error;
      
      return data as {
        success: boolean;
        stats: FormStats;
        submissions: FormSubmission[];
      };
    },
    enabled: !!clientAutomationId
  });
};
