
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    if (req.method === 'POST') {
      // Registrar llamada de webhook
      const body = await req.json();
      const { 
        client_automation_id, 
        webhook_url, 
        method = 'POST',
        status_code,
        response_time,
        payload,
        response_body,
        success,
        error_message 
      } = body;

      const { error } = await supabase
        .from('webhook_logs')
        .insert({
          client_automation_id,
          webhook_url,
          method,
          status_code,
          response_time,
          payload,
          response_body,
          success,
          error_message
        });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: 'Webhook log registered' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET') {
      // Obtener estadísticas de webhooks
      const url = new URL(req.url);
      const clientAutomationId = url.searchParams.get('client_automation_id');
      const days = parseInt(url.searchParams.get('days') || '7');

      if (!clientAutomationId) {
        throw new Error('client_automation_id is required');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: logs, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calcular estadísticas
      const totalRequests = logs.length;
      const successfulRequests = logs.filter(log => log.success).length;
      const failedRequests = totalRequests - successfulRequests;
      const avgResponseTime = logs.length > 0 
        ? Math.round(logs.reduce((sum, log) => sum + log.response_time, 0) / logs.length)
        : 0;
      const successRate = totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 0;

      // Agrupar por día para gráficos
      const dailyStats = logs.reduce((acc, log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, requests: 0, successful: 0, failed: 0, totalResponseTime: 0 };
        }
        acc[date].requests++;
        if (log.success) {
          acc[date].successful++;
        } else {
          acc[date].failed++;
        }
        acc[date].totalResponseTime += log.response_time;
        return acc;
      }, {} as Record<string, any>);

      const chartData = Object.values(dailyStats).map((day: any) => ({
        ...day,
        avgResponseTime: day.requests > 0 ? Math.round(day.totalResponseTime / day.requests) : 0
      }));

      return new Response(
        JSON.stringify({
          success: true,
          stats: {
            totalRequests,
            successfulRequests,
            failedRequests,
            avgResponseTime,
            successRate
          },
          logs: logs.slice(0, 10), // Últimos 10 logs
          chartData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Error in webhook-analytics:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
