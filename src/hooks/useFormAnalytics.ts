
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
      console.log('Fetching form analytics for client automation:', clientAutomationId);
      
      // Fetch form submissions from the database
      const { data: submissions, error: submissionsError } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .order('created_at', { ascending: false });

      if (submissionsError) {
        console.error('Error fetching form submissions:', submissionsError);
        throw submissionsError;
      }

      console.log('Form submissions fetched:', submissions?.length || 0);

      // Calculate stats
      const totalSubmissions = submissions?.length || 0;
      const processedSubmissions = submissions?.filter(s => s.status === 'processed').length || 0;
      const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0;
      const processingRate = totalSubmissions > 0 ? Math.round((processedSubmissions / totalSubmissions) * 100) : 0;

      const stats: FormStats = {
        totalSubmissions,
        processedSubmissions,
        pendingSubmissions,
        processingRate
      };

      return {
        success: true,
        stats,
        submissions: submissions || []
      };
    },
    enabled: !!clientAutomationId,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
