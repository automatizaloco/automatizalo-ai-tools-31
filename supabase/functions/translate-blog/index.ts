
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
    
    console.log(`Starting blog translation to ${targetLang}. API Key length: ${API_KEY?.length || 0}`);
    
    if (!API_KEY) {
      console.error("Google API key not found");
      throw new Error('Google API key is not configured');
    }

    // Function to translate a single text item with improved error handling
    async function translateText(content: string, target: string): Promise<string> {
      if (!content || content.trim() === '') {
        return '';
      }
      
      console.log(`Making request to Google Translate API for content length ${content.length}`);
      
      try {
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
          console.error("Google Translate API error:", {
            status: response.status,
            statusText: response.statusText,
            error: data.error
          });
          throw new Error(`Translation API error: ${data.error?.message || response.statusText}`);
        }

        const translatedText = data.data?.translations?.[0]?.translatedText;
        
        if (!translatedText) {
          console.error("No translation in response for content:", { data });
          throw new Error('No translation returned from API');
        }

        return translatedText;
      } catch (error) {
        console.error(`Error translating text: ${error.message}`);
        throw error;
      }
    }

    // Validate input parameters
    if (!targetLang) {
      throw new Error('Target language is required');
    }

    try {
      // Translate title, excerpt, and content in parallel with proper error handling
      const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all([
        title ? translateText(title, targetLang) : Promise.resolve(''),
        excerpt ? translateText(excerpt, targetLang) : Promise.resolve(''),
        text ? translateText(text, targetLang) : Promise.resolve('')
      ]);

      console.log("Blog translation completed successfully");

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
      );
    } catch (translationError) {
      console.error("Failed to translate blog content:", translationError);
      throw translationError;
    }
  } catch (error) {
    console.error("Blog translation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred during translation',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
})
