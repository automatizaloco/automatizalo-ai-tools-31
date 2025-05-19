
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const GOOGLE_API_URL = "https://translation.googleapis.com/language/translate/v2";
const API_KEY = Deno.env.get('GOOGLE_API_KEY');

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // Milliseconds

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, title, excerpt, targetLang, isChunk, chunkIndex, onlyMetadata, format } = await req.json();
    
    console.log(`Starting blog translation to ${targetLang}. API Key length: ${API_KEY?.length || 0}`);
    console.log(`Is chunk: ${isChunk ? 'yes' : 'no'}, Chunk index: ${chunkIndex || 'N/A'}, Only metadata: ${onlyMetadata ? 'yes' : 'no'}`);
    console.log(`Content contains HTML?: ${text?.includes('<p>') || text?.includes('<strong>') || false}`);
    console.log(`Format requested: ${format || 'html'} (defaulting to html)`);
    
    if (!API_KEY) {
      console.error("Google API key not found");
      throw new Error('Google API key is not configured');
    }

    // Function to translate a single text item with improved error handling and retries
    async function translateText(content: string, target: string): Promise<string> {
      if (!content || content.trim() === '') {
        return '';
      }
      
      console.log(`Making request to Google Translate API for content length ${content.length}`);
      console.log(`Content sample: ${content.substring(0, 50)}...`);
      console.log(`Using format: html to preserve formatting`);
      
      // Implement retry logic
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log(`Translation attempt ${attempt + 1} of ${MAX_RETRIES}`);
          
          // Build request body according to Google's API docs
          const requestBody = {
            q: content,
            target: target,
            format: "html"  // Always use html to preserve HTML formatting
          };

          const response = await fetch(`${GOOGLE_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          console.log(`Translation API response status for ${target}: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Translation API error (${response.status}): ${errorText}`);
            throw new Error(`Translation API error: ${response.statusText}`);
          }
          
          const data = await response.json();
          const translatedText = data.data?.translations?.[0]?.translatedText;
          
          if (!translatedText) {
            console.error("No translation in response for content:", { data });
            throw new Error('No translation returned from API');
          }

          console.log(`Translation successful, translated text contains HTML?: ${translatedText.includes('<p>') || translatedText.includes('<strong>')}`);
          return translatedText;
        } catch (error) {
          console.error(`Translation attempt ${attempt + 1} failed:`, error);
          
          // If this is not the last attempt, wait before retrying
          if (attempt < MAX_RETRIES - 1) {
            const delay = RETRY_DELAYS[attempt];
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // This was the last attempt, rethrow the error
            throw error;
          }
        }
      }
      
      // This should never be reached due to the throw in the last iteration
      throw new Error(`All ${MAX_RETRIES} translation attempts failed`);
    }

    // Validate input parameters
    if (!targetLang) {
      throw new Error('Target language is required');
    }

    try {
      // If this is a metadata-only request, just translate title and excerpt
      if (onlyMetadata) {
        console.log("Processing metadata-only translation request");
        const [translatedTitle, translatedExcerpt] = await Promise.all([
          title ? translateText(title, targetLang) : Promise.resolve(''),
          excerpt ? translateText(excerpt, targetLang) : Promise.resolve('')
        ]);
        
        return new Response(
          JSON.stringify({ 
            title: translatedTitle,
            excerpt: translatedExcerpt,
            content: ''
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        );
      }
      
      // For chunk translations or normal translations
      console.log(`Starting ${isChunk ? 'chunk' : 'full'} translation of blog content to ${targetLang}`);
      
      // If it's a chunk, we may not need to translate title and excerpt
      const needsMetadata = !isChunk || chunkIndex === 0;
      
      const translationPromises = [];
      
      if (needsMetadata && title) {
        translationPromises.push(translateText(title, targetLang));
      } else {
        translationPromises.push(Promise.resolve(''));
      }
      
      if (needsMetadata && excerpt) {
        translationPromises.push(translateText(excerpt, targetLang));
      } else {
        translationPromises.push(Promise.resolve(''));
      }
      
      if (text) {
        translationPromises.push(translateText(text, targetLang));
      } else {
        translationPromises.push(Promise.resolve(''));
      }
      
      const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all(translationPromises);

      console.log("Blog translation completed successfully");
      console.log(`Translated content length: ${translatedContent.length}`);
      console.log(`Translated content contains HTML?: ${translatedContent.includes('<p>') || translatedContent.includes('<strong>')}`);

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
    
    // Return a proper error response with status 500
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
});
