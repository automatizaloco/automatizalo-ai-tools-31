
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface AutomationRequest {
  enable: boolean;
  weeklyTemplateId?: string;
  monthlyTemplateId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { enable, weeklyTemplateId, monthlyTemplateId } = await req.json() as AutomationRequest;
    
    console.log(`${enable ? 'Enabling' : 'Disabling'} newsletter automation`);
    console.log(`Weekly template ID: ${weeklyTemplateId || 'none'}`);
    console.log(`Monthly template ID: ${monthlyTemplateId || 'none'}`);
    
    if (enable) {
      // Set up scheduled cron job for weekly newsletter (every Monday at 9 AM)
      if (weeklyTemplateId) {
        const weeklyCommand = `
          SELECT net.http_post(
            url:='${supabaseUrl}/functions/v1/send-newsletter',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
            body:='{"frequency": "weekly", "templateId": "${weeklyTemplateId}", "testMode": false}'::jsonb
          ) as request_id;
        `;
        
        await supabase.rpc('create_or_replace_cron_job', {
          job_name: 'send_weekly_newsletter',
          schedule: '0 9 * * 1', // Monday at 9 AM
          command: weeklyCommand
        });
        
        console.log("Weekly newsletter automation setup complete");
      } else {
        // If no template is provided, remove any existing weekly job
        try {
          await supabase.rpc('remove_cron_job', { job_name: 'send_weekly_newsletter' });
          console.log("Weekly newsletter automation removed (no template provided)");
        } catch (error) {
          console.log("No weekly job to remove");
        }
      }
      
      // Set up scheduled cron job for monthly newsletter (1st day of the month at 9 AM)
      if (monthlyTemplateId) {
        const monthlyCommand = `
          SELECT net.http_post(
            url:='${supabaseUrl}/functions/v1/send-newsletter',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
            body:='{"frequency": "monthly", "templateId": "${monthlyTemplateId}", "testMode": false}'::jsonb
          ) as request_id;
        `;
        
        await supabase.rpc('create_or_replace_cron_job', {
          job_name: 'send_monthly_newsletter',
          schedule: '0 9 1 * *', // 1st day of month at 9 AM
          command: monthlyCommand
        });
        
        console.log("Monthly newsletter automation setup complete");
      } else {
        // If no template is provided, remove any existing monthly job
        try {
          await supabase.rpc('remove_cron_job', { job_name: 'send_monthly_newsletter' });
          console.log("Monthly newsletter automation removed (no template provided)");
        } catch (error) {
          console.log("No monthly job to remove");
        }
      }
    } else {
      // Remove the scheduled cron jobs
      if (weeklyTemplateId) {
        try {
          await supabase.rpc('remove_cron_job', { job_name: 'send_weekly_newsletter' });
          console.log("Weekly newsletter automation removed");
        } catch (error) {
          console.log("Error removing weekly job:", error);
        }
      }
      
      if (monthlyTemplateId) {
        try {
          await supabase.rpc('remove_cron_job', { job_name: 'send_monthly_newsletter' });
          console.log("Monthly newsletter automation removed");
        } catch (error) {
          console.log("Error removing monthly job:", error);
        }
      }
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
