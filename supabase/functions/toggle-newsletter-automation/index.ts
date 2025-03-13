
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface AutomationRequest {
  enable: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { enable } = await req.json() as AutomationRequest;
    
    console.log(`${enable ? 'Enabling' : 'Disabling'} newsletter automation`);
    
    if (enable) {
      // Set up scheduled cron job for weekly newsletter (every Monday at 9 AM)
      await supabase.rpc('create_or_replace_cron_job', {
        job_name: 'send_weekly_newsletter',
        schedule: '0 9 * * 1', // Monday at 9 AM
        command: `
          SELECT net.http_post(
            url:='${supabaseUrl}/functions/v1/send-newsletter',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
            body:='{"frequency": "weekly", "testMode": false}'::jsonb
          ) as request_id;
        `
      });
      
      // Set up scheduled cron job for monthly newsletter (1st day of the month at 9 AM)
      await supabase.rpc('create_or_replace_cron_job', {
        job_name: 'send_monthly_newsletter',
        schedule: '0 9 1 * *', // 1st day of month at 9 AM
        command: `
          SELECT net.http_post(
            url:='${supabaseUrl}/functions/v1/send-newsletter',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
            body:='{"frequency": "monthly", "testMode": false}'::jsonb
          ) as request_id;
        `
      });
    } else {
      // Remove the scheduled cron jobs
      await supabase.rpc('remove_cron_job', { job_name: 'send_weekly_newsletter' });
      await supabase.rpc('remove_cron_job', { job_name: 'send_monthly_newsletter' });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter automation ${enable ? 'enabled' : 'disabled'}`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in toggle-newsletter-automation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
