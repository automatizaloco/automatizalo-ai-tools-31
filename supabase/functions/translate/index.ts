
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const GOOGLE_API_URL = "https://translation.googleapis.com/language/translate/v2";
const API_KEY = Deno.env.get('GOOGLE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, targetLang } = await req.json();
    
    console.log(`Starting translation to ${targetLang}. API Key length: ${API_KEY?.length || 0}`);
    
    if (!API_KEY) {
      console.error("Google API key not found");
      throw new Error('Google API key is not configured');
    }
    
    if (!text || !targetLang) {
      console.error("Missing required parameters:", { hasText: !!text, hasTargetLang: !!targetLang });
      throw new Error('Missing required parameters: text and targetLang are required');
    }

    // Log the parameters we're about to send
    console.log(`Making request to Google Translate API for language: ${targetLang}`);
    console.log(`Text to translate (sample): ${text.substring(0, 50)}...`);
    
    // Build the request body according to Google's API docs
    const requestBody = {
      q: text,
      target: targetLang,
      format: "text"
    };
    
    // Make the API request
    const response = await fetch(`${GOOGLE_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    // Log response status to help with debugging
    console.log(`Translation API response status: ${response.status}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Google Translate API error:", {
        status: response.status,
        statusText: response.statusText,
        error: data.error
      });
      throw new Error(`Translation API error: ${data.error?.message || response.statusText}`);
    }

    // Log the response data structure to debug
    console.log("Response data structure:", JSON.stringify(data).substring(0, 200) + "...");

    const translatedText = data.data?.translations?.[0]?.translatedText;
    
    if (!translatedText) {
      console.error("No translation in response:", data);
      throw new Error('No translation returned from API');
    }

    console.log("Translation successful");

    return new Response(
      JSON.stringify({ translatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Translation function error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred during translation',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
