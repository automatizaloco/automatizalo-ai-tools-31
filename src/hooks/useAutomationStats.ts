
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AutomationStats {
  totalWebhookCalls: number;
  successfulWebhookCalls: number;
  failedWebhookCalls: number;
  averageResponseTime: number;
  totalFormSubmissions: number;
  pendingFormSubmissions: number;
  processedFormSubmissions: number;
  totalTableEntries: number;
  recentActivity: {
    webhookCalls: { date: string; count: number }[];
    formSubmissions: { date: string; count: number }[];
  };
  topErrors: { error: string; count: number }[];
  performanceMetrics: {
    uptime: number;
    averageDaily: number;
    peakHour: string;
  };
}

export const useAutomationStats = (clientAutomationId: string) => {
  return useQuery({
    queryKey: ['automation-stats', clientAutomationId],
    queryFn: async (): Promise<AutomationStats> => {
      if (!clientAutomationId) throw new Error('Client automation ID is required');

      // Obtener logs de webhook
      const { data: webhookLogs } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .order('created_at', { ascending: false });

      // Obtener form submissions
      const { data: formSubmissions } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .order('created_at', { ascending: false });

      // Obtener table entries
      const { data: tableEntries } = await supabase
        .from('table_data_entries')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .order('created_at', { ascending: false });

      // Calcular estadísticas de webhook
      const totalWebhookCalls = webhookLogs?.length || 0;
      const successfulWebhookCalls = webhookLogs?.filter(log => log.success).length || 0;
      const failedWebhookCalls = totalWebhookCalls - successfulWebhookCalls;
      const averageResponseTime = webhookLogs?.length 
        ? webhookLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / webhookLogs.length 
        : 0;

      // Calcular estadísticas de formularios
      const totalFormSubmissions = formSubmissions?.length || 0;
      const pendingFormSubmissions = formSubmissions?.filter(sub => sub.status === 'pending').length || 0;
      const processedFormSubmissions = formSubmissions?.filter(sub => sub.status === 'processed').length || 0;

      // Calcular estadísticas de tabla
      const totalTableEntries = tableEntries?.length || 0;

      // Agrupar actividad por día (últimos 7 días)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const webhookCallsByDay = last7Days.map(date => ({
        date,
        count: webhookLogs?.filter(log => 
          log.created_at.startsWith(date)
        ).length || 0
      }));

      const formSubmissionsByDay = last7Days.map(date => ({
        date,
        count: formSubmissions?.filter(sub => 
          sub.created_at.startsWith(date)
        ).length || 0
      }));

      // Calcular errores más comunes
      const errorCounts: { [key: string]: number } = {};
      webhookLogs?.forEach(log => {
        if (!log.success && log.error_message) {
          errorCounts[log.error_message] = (errorCounts[log.error_message] || 0) + 1;
        }
      });

      const topErrors = Object.entries(errorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([error, count]) => ({ error, count }));

      // Calcular métricas de rendimiento
      const uptime = totalWebhookCalls > 0 ? (successfulWebhookCalls / totalWebhookCalls) * 100 : 100;
      const averageDaily = totalWebhookCalls / 7; // Promedio diario de la última semana
      
      // Encontrar hora pico
      const hourCounts: { [key: string]: number } = {};
      webhookLogs?.forEach(log => {
        const hour = new Date(log.created_at).getHours();
        const hourKey = `${hour}:00`;
        hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
      });
      
      const peakHour = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '12:00';

      return {
        totalWebhookCalls,
        successfulWebhookCalls,
        failedWebhookCalls,
        averageResponseTime: Math.round(averageResponseTime),
        totalFormSubmissions,
        pendingFormSubmissions,
        processedFormSubmissions,
        totalTableEntries,
        recentActivity: {
          webhookCalls: webhookCallsByDay,
          formSubmissions: formSubmissionsByDay,
        },
        topErrors,
        performanceMetrics: {
          uptime: Math.round(uptime * 100) / 100,
          averageDaily: Math.round(averageDaily * 100) / 100,
          peakHour,
        },
      };
    },
    enabled: !!clientAutomationId,
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });
};
