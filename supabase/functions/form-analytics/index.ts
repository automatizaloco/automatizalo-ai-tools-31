
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
      // Registrar envío de formulario
      const body = await req.json();
      const { 
        client_automation_id, 
        form_data,
        submission_ip,
        user_agent
      } = body;

      const { error } = await supabase
        .from('form_submissions')
        .insert({
          client_automation_id,
          form_data,
          submission_ip,
          user_agent,
          status: 'pending'
        });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: 'Form submission registered' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET') {
      // Obtener estadísticas de formularios
      const url = new URL(req.url);
      const clientAutomationId = url.searchParams.get('client_automation_id');

      if (!clientAutomationId) {
        throw new Error('client_automation_id is required');
      }

      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalSubmissions = submissions.length;
      const processedSubmissions = submissions.filter(s => s.status === 'processed').length;
      const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
      const processingRate = totalSubmissions > 0 
        ? Math.round((processedSubmissions / totalSubmissions) * 100) 
        : 0;

      return new Response(
        JSON.stringify({
          success: true,
          stats: {
            totalSubmissions,
            processedSubmissions,
            pendingSubmissions,
            processingRate
          },
          submissions: submissions.slice(0, 10) // Últimos 10 envíos
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Error in form-analytics:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
