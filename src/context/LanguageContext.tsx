
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
    "nav.login": "Login",
    "nav.logout": "Logout",
    "blog.title": "Our Blog",
    "blog.subtitle": "Insights, news, and perspectives on AI, automation, and digital transformation.",
    "blog.featured": "Featured Articles",
    "blog.all": "All Articles",
    "blog.readMore": "Read More",
    "blog.newsletter.title": "Stay up to date with our latest insights",
    "blog.newsletter.subtitle": "Subscribe to our newsletter to receive the latest updates on AI, automation, and digital transformation.",
    "blog.newsletter.button": "Subscribe",
    "blog.newsletter.placeholder": "Enter your email",
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our team",
    "contact.form.name": "Your Name",
    "contact.form.email": "Your Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "contact.whatsapp": "Chat on WhatsApp",
    "contact.email": "Email Us",
    "contact.phone": "Call Us",
    "contact.address": "Visit Us",
    "solutions.title": "Our Solutions",
    "solutions.subtitle": "Transforming businesses through AI and automation",
    "solutions.cta.title": "Ready to transform your business?",
    "solutions.cta.subtitle": "Get started with our solutions today",
    "solutions.cta.button": "Contact Us"
  },
  fr: {
    "nav.home": "Accueil",
    "nav.solutions": "Solutions",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.getStarted": "Commencer",
    "nav.login": "Connexion",
    "nav.logout": "Déconnexion",
    "blog.title": "Notre Blog",
    "blog.subtitle": "Aperçus, nouvelles et perspectives sur l'IA, l'automatisation et la transformation numérique.",
    "blog.featured": "Articles en Vedette",
    "blog.all": "Tous les Articles",
    "blog.readMore": "Lire Plus",
    "blog.newsletter.title": "Restez à jour avec nos dernières informations",
    "blog.newsletter.subtitle": "Abonnez-vous à notre newsletter pour recevoir les dernières mises à jour sur l'IA, l'automatisation et la transformation numérique.",
    "blog.newsletter.button": "S'abonner",
    "blog.newsletter.placeholder": "Entrez votre email",
    "contact.title": "Contactez-Nous",
    "contact.subtitle": "Entrez en contact avec notre équipe",
    "contact.form.name": "Votre Nom",
    "contact.form.email": "Votre Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Envoyer le Message",
    "contact.whatsapp": "Discuter sur WhatsApp",
    "contact.email": "Envoyez-nous un Email",
    "contact.phone": "Appelez-Nous",
    "contact.address": "Visitez-Nous",
    "solutions.title": "Nos Solutions",
    "solutions.subtitle": "Transformer les entreprises grâce à l'IA et à l'automatisation",
    "solutions.cta.title": "Prêt à transformer votre entreprise?",
    "solutions.cta.subtitle": "Commencez avec nos solutions aujourd'hui",
    "solutions.cta.button": "Contactez-Nous"
  },
  es: {
    "nav.home": "Inicio",
    "nav.solutions": "Soluciones",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.getStarted": "Comenzar",
    "nav.login": "Iniciar Sesión",
    "nav.logout": "Cerrar Sesión",
    "blog.title": "Nuestro Blog",
    "blog.subtitle": "Perspectivas, noticias y puntos de vista sobre IA, automatización y transformación digital.",
    "blog.featured": "Artículos Destacados",
    "blog.all": "Todos los Artículos",
    "blog.readMore": "Leer Más",
    "blog.newsletter.title": "Mantente al día con nuestras últimas novedades",
    "blog.newsletter.subtitle": "Suscríbete a nuestro boletín para recibir las últimas actualizaciones sobre IA, automatización y transformación digital.",
    "blog.newsletter.button": "Suscribirse",
    "blog.newsletter.placeholder": "Ingresa tu email",
    "contact.title": "Contáctanos",
    "contact.subtitle": "Ponte en contacto con nuestro equipo",
    "contact.form.name": "Tu Nombre",
    "contact.form.email": "Tu Email",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar Mensaje",
    "contact.whatsapp": "Chatea en WhatsApp",
    "contact.email": "Envíanos un Email",
    "contact.phone": "Llámanos",
    "contact.address": "Visítanos",
    "solutions.title": "Nuestras Soluciones",
    "solutions.subtitle": "Transformando empresas a través de IA y automatización",
    "solutions.cta.title": "¿Listo para transformar tu empresa?",
    "solutions.cta.subtitle": "Comienza con nuestras soluciones hoy",
    "solutions.cta.button": "Contáctanos"
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
