
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
    
    console.log(`Starting translation to ${targetLang}. API Key exists: ${!!API_KEY}`);
    
    if (!API_KEY) {
      console.error("Google API key not found in environment variables");
      throw new Error('Google API key is not configured');
    }
    
    if (!text || !targetLang) {
      console.error("Missing required parameters");
      throw new Error('Missing required parameters: text and targetLang are required');
    }

    console.log(`Attempting to translate text to ${targetLang}`);
    
    const params = new URLSearchParams({
      q: text,
      target: targetLang,
      key: API_KEY
    });

    const response = await fetch(`${GOOGLE_API_URL}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Translation API error:", data);
      throw new Error(data.error?.message || `Translation failed with status ${response.status}`);
    }

    const translatedText = data.data?.translations?.[0]?.translatedText;
    
    if (!translatedText) {
      console.error("No translation returned from API");
      throw new Error('No translation returned from API');
    }

    console.log("Translation successful:", translatedText.substring(0, 30) + "...");

    return new Response(
      JSON.stringify({ translatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Translation error:", error);
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
