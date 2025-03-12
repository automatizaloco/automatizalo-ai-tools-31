
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
    
    console.log(`Starting blog translation to ${targetLang}. API Key exists: ${!!API_KEY}`);
    
    if (!API_KEY) {
      console.error("Google API key not found in environment variables");
      throw new Error('Google API key is not configured');
    }

    // Function to translate a single text item with improved error handling
    async function translateText(content: string, target: string): Promise<string> {
      if (!content || content.trim() === '') {
        return '';
      }
      
      console.log(`Attempting to translate content to ${target}`);
      
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
          console.error("Translation API error:", data);
          throw new Error(data.error?.message || `Translation failed with status ${response.status}`);
        }

        const translatedText = data.data?.translations?.[0]?.translatedText;
        
        if (!translatedText) {
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

      console.log(`Blog translation completed successfully for ${targetLang}`);

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
