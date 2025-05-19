
import { formatContentFromWebhook } from "../blog/transformers";

/**
 * Process translated content to ensure formatting is preserved and HTML entities are decoded
 */
export const processTranslatedContent = (content: string): string => {
  if (!content) return '';
  
  // First decode HTML entities (like &#39; to ', &amp; to &, etc.)
  let decodedContent = decodeHTMLEntities(content);
  
  // Make sure we preserve all HTML tags that might have been returned
  // Some translation services might encode or alter HTML tags
  
  // Check if content already has HTML formatting
  const hasHtml = decodedContent.includes('<h1>') || 
                  decodedContent.includes('<p>') || 
                  decodedContent.includes('<strong>') || 
                  decodedContent.includes('<em>') ||
                  decodedContent.includes('<h2>') ||
                  decodedContent.includes('<ul>');
                  
  if (hasHtml) {
    console.log("Translation contains HTML formatting, preserving as-is");
    return decodedContent;
  }
  
  // If content doesn't have HTML but has markdown-like syntax, process it
  if (decodedContent.includes('#') || 
      decodedContent.includes('**') || 
      decodedContent.includes('\n\n') || 
      decodedContent.match(/^\d+\./m)) {
    console.log("Translation contains markdown-like formatting, converting to HTML");
    return formatContentFromWebhook(decodedContent);
  }
  
  // If we don't detect any formatting, wrap in paragraph tags at minimum
  if (!decodedContent.startsWith('<')) {
    decodedContent = '<p>' + decodedContent + '</p>';
  }
  
  return decodedContent;
};

/**
 * Decode HTML entities like &#39; to '
 */
export const decodeHTMLEntities = (text: string): string => {
  if (!text) return '';
  
  const element = document.createElement('div');
  // This is a safe way to decode HTML entities
  element.innerHTML = text;
  return element.textContent || text;
};
