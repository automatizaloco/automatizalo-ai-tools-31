
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatContentFromWebhook } from "./blog/transformers";

/**
 * Translates blog post content to the target language
 */
export const translateBlogContent = async (
  content: string,
  title: string,
  excerpt: string,
  targetLang: 'fr' | 'es'
): Promise<{
  title: string;
  excerpt: string;
  content: string;
}> => {
  try {
    console.log(`Starting translation to ${targetLang}...`);
    console.log(`Content length: ${content.length}, Title length: ${title.length}, Excerpt length: ${excerpt.length}`);
    
    // Split content for Spanish if it's very long to avoid potential truncation issues
    const needsSplitting = targetLang === 'es' && content.length > 10000;
    let translatedContent = '';
    
    if (needsSplitting) {
      // For very large Spanish content, split into chunks and translate separately
      console.log(`Content is large (${content.length} chars), splitting for Spanish translation`);
      const chunkSize = 8000; // Safe chunk size for translation
      const chunks = [];
      
      // Split content into manageable chunks
      for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push(content.substring(i, i + chunkSize));
      }
      
      console.log(`Split content into ${chunks.length} chunks for translation`);
      
      // Translate each chunk
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Translating chunk ${i+1}/${chunks.length} (${chunks[i].length} chars)`);
        
        const { data, error } = await supabase.functions.invoke('translate-blog', {
          body: {
            text: chunks[i],
            title: i === 0 ? title : "", // Only send title with first chunk
            excerpt: i === 0 ? excerpt : "", // Only send excerpt with first chunk
            targetLang: targetLang,
            isChunk: true,
            chunkIndex: i,
            preserveFormatting: true  // Request to preserve formatting
          },
        });
        
        if (error) {
          console.error(`Error translating chunk ${i+1} to ${targetLang}:`, error);
          throw new Error(`Translation of chunk ${i+1} failed: ${error.message}`);
        }
        
        if (!data || !data.content) {
          console.error(`No translation data received for chunk ${i+1}`);
          throw new Error(`No translation data received for chunk ${i+1}`);
        }
        
        // Append translated chunk
        translatedContent += data.content;
        console.log(`Chunk ${i+1} translated successfully, length: ${data.content.length}`);
      }
      
      // For split translations, we already have the content, but need title and excerpt
      // from the first chunk response
      const { data: firstChunkData, error: firstChunkError } = await supabase.functions.invoke('translate-blog', {
        body: {
          text: "",
          title: title,
          excerpt: excerpt,
          targetLang: targetLang,
          onlyMetadata: true,
          preserveFormatting: true
        },
      });
      
      if (firstChunkError || !firstChunkData) {
        console.error(`Error getting metadata for ${targetLang}:`, firstChunkError);
        throw new Error(`Failed to get translated metadata: ${firstChunkError?.message || "Unknown error"}`);
      }
      
      return {
        title: firstChunkData.title || '',
        excerpt: firstChunkData.excerpt || '',
        content: processTranslatedContent(translatedContent)
      };
    } else {
      // Standard translation for shorter content or French
      const { data, error } = await supabase.functions.invoke('translate-blog', {
        body: {
          text: content,
          title: title,
          excerpt: excerpt,
          targetLang: targetLang,
          preserveFormatting: true
        },
      });

      if (error) {
        console.error(`Error translating content to ${targetLang}:`, error);
        throw new Error(`Translation failed: ${error.message}`);
      }

      if (!data) {
        console.error('No translation data received');
        throw new Error('No translation data received');
      }
      
      console.log(`Translation to ${targetLang} completed successfully:`, data);
      console.log(`Translated content length: ${data.content?.length || 0}`);

      if (!data.title || !data.content) {
        console.error('Incomplete translation data received:', data);
        throw new Error('Incomplete translation data received');
      }

      return {
        title: data.title || '',
        excerpt: data.excerpt || '',
        content: processTranslatedContent(data.content || '')
      };
    }
  } catch (error: any) {
    console.error(`Error translating content to ${targetLang}:`, error);
    toast.error(`Failed to translate content: ${error.message}`);
    throw error;
  }
};

/**
 * Process translated content to ensure formatting is preserved
 */
const processTranslatedContent = (content: string): string => {
  // Check if content already has HTML formatting
  if (content.includes('<h1>') || content.includes('<p>') || 
      content.includes('<strong>') || content.includes('<em>')) {
    return content;
  }
  
  // If content doesn't have HTML but has markdown-like syntax, process it
  if (content.includes('#') || content.includes('*') || 
      content.includes('\n\n') || content.match(/^\d+\./m)) {
    return formatContentFromWebhook(content);
  }
  
  return content;
};
