
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
    const { text, title, excerpt, targetLang } = await req.json();
    
    if (!API_KEY) {
      throw new Error('Google API key is not configured');
    }

    // Function to translate a single text item
    async function translateText(content, target) {
      if (!content || content.trim() === '') {
        return '';
      }
      
      const params = new URLSearchParams({
        q: content,
        target: target,
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
        console.error("Translation error:", data);
        throw new Error(data.error?.message || 'Translation failed');
      }

      return data.data?.translations?.[0]?.translatedText;
    }

    // Translate title, excerpt, and content in parallel
    const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all([
      translateText(title, targetLang),
      translateText(excerpt, targetLang),
      translateText(text, targetLang)
    ]);

    return new Response(
      JSON.stringify({ 
        title: translatedTitle,
        excerpt: translatedExcerpt, 
        content: translatedContent 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
