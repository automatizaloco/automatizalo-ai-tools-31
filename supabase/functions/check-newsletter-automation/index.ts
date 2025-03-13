
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if the cron jobs exist
    const { data: cronJobs, error } = await supabase.rpc('list_cron_jobs');
    
    if (error) {
      throw new Error(`Failed to check cron jobs: ${error.message}`);
    }
    
    // Check if both newsletter cron jobs exist
    const weeklyJobExists = cronJobs.some((job: any) => job.jobname === 'send_weekly_newsletter');
    const monthlyJobExists = cronJobs.some((job: any) => job.jobname === 'send_monthly_newsletter');
    
    const enabled = weeklyJobExists && monthlyJobExists;

    return new Response(
      JSON.stringify({ 
        enabled,
        weeklyJobExists,
        monthlyJobExists
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-newsletter-automation function:", error);
    return new Response(
      JSON.stringify({ error: error.message, enabled: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
