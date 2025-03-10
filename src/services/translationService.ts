
import { Translation, Translations } from "@/context/LanguageContext";

// Translation map for common phrases and terms
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

// Main translation function that uses the dictionary approach
export const translateContent = async (
  text: string,
  sourceLanguage: string = "en",
  targetLanguage: string
): Promise<string> => {
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  try {
    // Use dictionary-based translation
    return dictionaryTranslate(text, targetLanguage);
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};

// Dictionary-based translation function
const dictionaryTranslate = (text: string, targetLanguage: string): string => {
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

// These functions are no longer needed but kept for compatibility
export const setGoogleTranslateApiKey = (_key: string): void => {
  // Do nothing - we're not using API keys anymore
};

export const hasGoogleTranslateApiKey = (): boolean => {
  return true; // Always return true so the app assumes translation is available
};
