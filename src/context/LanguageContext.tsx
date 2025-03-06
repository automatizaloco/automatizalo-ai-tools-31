
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "fr" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    "nav.home": "Home",
    "nav.solutions": "Solutions",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.getStarted": "Get Started",
    "blog.title": "Our Blog",
    "blog.subtitle": "Insights, news, and perspectives on AI, automation, and digital transformation.",
    "blog.featured": "Featured Articles",
    "blog.all": "All Articles",
    "blog.readMore": "Read More",
    "blog.newsletter.title": "Stay up to date with our latest insights",
    "blog.newsletter.subtitle": "Subscribe to our newsletter to receive the latest updates on AI, automation, and digital transformation.",
    "blog.newsletter.button": "Subscribe",
    "blog.newsletter.placeholder": "Enter your email",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.solutions": "Solutions",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.getStarted": "Commencer",
    "blog.title": "Notre Blog",
    "blog.subtitle": "Aperçus, nouvelles et perspectives sur l'IA, l'automatisation et la transformation numérique.",
    "blog.featured": "Articles en Vedette",
    "blog.all": "Tous les Articles",
    "blog.readMore": "Lire Plus",
    "blog.newsletter.title": "Restez à jour avec nos dernières informations",
    "blog.newsletter.subtitle": "Abonnez-vous à notre newsletter pour recevoir les dernières mises à jour sur l'IA, l'automatisation et la transformation numérique.",
    "blog.newsletter.button": "S'abonner",
    "blog.newsletter.placeholder": "Entrez votre email",
  },
  es: {
    "nav.home": "Inicio",
    "nav.solutions": "Soluciones",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.getStarted": "Comenzar",
    "blog.title": "Nuestro Blog",
    "blog.subtitle": "Perspectivas, noticias y puntos de vista sobre IA, automatización y transformación digital.",
    "blog.featured": "Artículos Destacados",
    "blog.all": "Todos los Artículos",
    "blog.readMore": "Leer Más",
    "blog.newsletter.title": "Mantente al día con nuestras últimas novedades",
    "blog.newsletter.subtitle": "Suscríbete a nuestro boletín para recibir las últimas actualizaciones sobre IA, automatización y transformación digital.",
    "blog.newsletter.button": "Suscribirse",
    "blog.newsletter.placeholder": "Ingresa tu email",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
