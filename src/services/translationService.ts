
import { Translation, Translations } from "@/context/LanguageContext";

// Translation map for common phrases and terms - as fallback
const commonTranslations: Record<string, Record<string, string>> = {
  fr: {
    "Hello": "Bonjour",
    "Welcome": "Bienvenue",
    "Contact": "Contacter",
    "About": "À propos",
    "Services": "Services",
    "Products": "Produits",
    "Blog": "Blog",
    "Home": "Accueil",
  },
  es: {
    "Hello": "Hola",
    "Welcome": "Bienvenido",
    "Contact": "Contacto",
    "About": "Acerca de",
    "Services": "Servicios",
    "Products": "Productos",
    "Blog": "Blog",
    "Home": "Inicio",
  }
};

// Function to translate text using Google Translate API
export const translateContent = async (
  text: string,
  sourceLanguage: string = "en",
  targetLanguage: string
): Promise<string> => {
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  try {
    // Google Translate API endpoint
    const endpoint = `https://translation.googleapis.com/language/translate/v2`;
    
    // Create URL with query parameters
    const url = new URL(endpoint);
    url.searchParams.append('q', text);
    url.searchParams.append('source', sourceLanguage);
    url.searchParams.append('target', targetLanguage);
    url.searchParams.append('format', 'html'); // 'html' to preserve HTML tags
    
    // Get API key from environment, otherwise prompt user
    let apiKey = localStorage.getItem('google_translate_api_key');
    
    if (!apiKey) {
      console.warn('Google Translate API key not found in localStorage. Using fallback translation method.');
      return fallbackTranslate(text, targetLanguage);
    }
    
    url.searchParams.append('key', apiKey);
    
    // Make the API request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      // If API call fails, log error and use fallback
      console.error('Google Translate API error:', await response.text());
      return fallbackTranslate(text, targetLanguage);
    }
    
    const data = await response.json();
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      return data.data.translations[0].translatedText;
    } else {
      // If no translations returned, use fallback
      console.warn('No translations returned from Google API. Using fallback.');
      return fallbackTranslate(text, targetLanguage);
    }
  } catch (error) {
    console.error("Translation error:", error);
    // Use fallback translation if API call fails
    return fallbackTranslate(text, targetLanguage);
  }
};

// Fallback translation function using the dictionary approach
const fallbackTranslate = (text: string, targetLanguage: string): string => {
  const translations = commonTranslations[targetLanguage] || {};
  let translatedText = text;

  // Process HTML content
  if (text.includes('<')) {
    // Split by HTML tags and translate text nodes
    const parts = text.split(/(<[^>]*>)/);
    translatedText = parts.map(part => {
      // Skip HTML tags
      if (part.startsWith('<')) {
        return part;
      }
      // Translate text content
      return translatePhrase(part.trim(), targetLanguage, translations);
    }).join('');
  } else {
    // Translate plain text
    translatedText = translatePhrase(text, targetLanguage, translations);
  }

  return translatedText;
};

// Helper function to translate a phrase
const translatePhrase = (phrase: string, targetLanguage: string, translations: Record<string, string>): string => {
  // Split into sentences and words
  return phrase.split(/([.!?]+)/).map(sentence => {
    return sentence.split(/\b/).map(word => {
      const translation = translations[word.trim()];
      return translation || word;
    }).join('');
  }).join('');
};

// Function to generate translations for a blog post
export const generateTranslations = async (
  title: string,
  excerpt: string,
  content: string
): Promise<Translations> => {
  try {
    // Create translations for French and Spanish
    const [frTitle, frExcerpt, frContent, esTitle, esExcerpt, esContent] = await Promise.all([
      translateContent(title, 'en', 'fr'),
      translateContent(excerpt, 'en', 'fr'),
      translateContent(content, 'en', 'fr'),
      translateContent(title, 'en', 'es'),
      translateContent(excerpt, 'en', 'es'),
      translateContent(content, 'en', 'es')
    ]);

    // Return translations object
    return {
      fr: {
        title: frTitle,
        excerpt: frExcerpt,
        content: frContent
      },
      es: {
        title: esTitle,
        excerpt: esExcerpt,
        content: esContent
      }
    };
  } catch (error) {
    console.error("Error generating translations:", error);
    return {
      fr: {
        title: "",
        excerpt: "",
        content: ""
      },
      es: {
        title: "",
        excerpt: "",
        content: ""
      }
    };
  }
};

// Function to set the Google Translate API key
export const setGoogleTranslateApiKey = (key: string): void => {
  localStorage.setItem('google_translate_api_key', key);
};

// Function to check if Google Translate API key is set
export const hasGoogleTranslateApiKey = (): boolean => {
  return !!localStorage.getItem('google_translate_api_key');
};
