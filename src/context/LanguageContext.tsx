import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "fr" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Theme
    "theme.toggleDark": "Switch to Dark Mode",
    "theme.toggleLight": "Switch to Light Mode",
    
    // Navigation
    "nav.home": "Home",
    "nav.solutions": "Solutions",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.getStarted": "Get Started",
    "nav.login": "Login",
    "nav.logout": "Logout",
    
    // Blog
    "blog.title": "Our Blog",
    "blog.subtitle": "Insights, news, and perspectives on AI, automation, and digital transformation.",
    "blog.featured": "Featured Articles",
    "blog.all": "All Articles",
    "blog.readMore": "Read More",
    "blog.backToBlog": "Back to Blog",
    "blog.newsletter.title": "Stay up to date with our latest insights",
    "blog.newsletter.subtitle": "Subscribe to our newsletter to receive the latest updates on AI, automation, and digital transformation.",
    "blog.newsletter.button": "Subscribe",
    "blog.newsletter.placeholder": "Enter your email",
    
    // Contact
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
    
    // Solutions
    "solutions.title": "Our Solutions",
    "solutions.subtitle": "Transforming businesses through AI and automation",
    "solutions.cta.title": "Ready to transform your business?",
    "solutions.cta.subtitle": "Get started with our solutions today",
    "solutions.cta.button": "Contact Us",
    "solutions.testimonials.title": "What Our Clients Say",
    "solutions.testimonials.subtitle": "Hear from businesses that have transformed with our solutions",
    "solutions.futureproof.title": "Future-Proof Your Business",
    "solutions.futureproof.subtitle": "Stay ahead of the competition with cutting-edge AI and automation",
    "solutions.futureproof.description": "Our solutions help you adapt to the rapidly changing business landscape, ensuring your business remains competitive and efficient.",
    
    // Home
    "home.hero.tagline": "AI & Automation Solutions",
    "home.hero.title": "Stop wasting time on repetitive tasks",
    "home.hero.description": "brings cutting-edge AI and automation tools to help you work smarter, grow faster, and stay ahead of the future.",
    "home.hero.getStarted": "Get Started",
    "home.hero.learnMore": "Learn More",
    "home.about.tagline": "About Us",
    "home.about.title": "We're Building the Future of AI Automation",
    "home.about.description": "At Automatízalo, we're a team of young, passionate AI specialists and automation experts. We connect, fine-tune, and optimize automation tools like Make.com, N8N, AI chatbots, and custom workflows to help businesses and individuals become more efficient, scalable, and future-ready.",
    "home.about.feature1.title": "Automated Workflows",
    "home.about.feature1.description": "Connect and automate your workflows using cutting-edge AI and Make.com/N8N tools.",
    "home.about.feature2.title": "AI Chatbots",
    "home.about.feature2.description": "Personalized chatbots to handle customer service, scheduling, and lead engagement.",
    "home.about.feature3.title": "Smart Systems",
    "home.about.feature3.description": "AI-driven systems that learn and adapt to your business needs over time.",
    "home.about.learnMore": "Learn More",
    "home.about.contactUs": "Contact Us",
    "home.about.whyWorkWithUs": "Why Work With Us?",
    "home.about.reason1": "Affordable & scalable – One-time setup, low-cost maintenance",
    "home.about.reason2": "Personalized AI tools – We tailor solutions for each client",
    "home.about.reason3": "Always improving – New features & fine-tuned automations every month",
    
    // Testimonials
    "testimonials.title": "What Our Clients Say",
    "testimonials.subtitle": "Don't just take our word for it - hear what our clients have to say",
    "testimonials.client1.name": "Sarah Johnson",
    "testimonials.client1.company": "Tech Innovators Inc.",
    "testimonials.client1.text": "Automatízalo transformed our customer service operations. Their AI chatbot solution handled 70% of our routine inquiries, freeing our team to focus on complex issues. Implementation was smooth and the results were immediate.",
    "testimonials.client2.name": "Carlos Rodriguez",
    "testimonials.client2.company": "Global Logistics",
    "testimonials.client2.text": "The workflow automation we implemented with Automatízalo has cut our processing time by 60%. Their team understood our specific needs and delivered a solution that integrated perfectly with our existing systems.",
    "testimonials.client3.name": "Emma Thompson",
    "testimonials.client3.company": "Creative Solutions",
    "testimonials.client3.text": "As a small business, we needed affordable automation that could grow with us. Automatízalo delivered exactly that - powerful tools that simplified our operations without breaking the bank.",
    
    // Footer
    "footer.company": "Company",
    "footer.about": "About Us",
    "footer.careers": "Careers",
    "footer.blog": "Blog",
    "footer.contact": "Contact",
    "footer.legal": "Legal",
    "footer.terms": "Terms",
    "footer.privacy": "Privacy",
    "footer.cookies": "Cookies",
    "footer.resources": "Resources",
    "footer.documentation": "Documentation",
    "footer.help": "Help Center",
    "footer.community": "Community",
    "footer.copyright": "© 2023 Automatízalo. All rights reserved.",
    "footer.description": "Transforming businesses through AI and automation solutions"
  },
  fr: {
    // Theme
    "theme.toggleDark": "Passer au Mode Sombre",
    "theme.toggleLight": "Passer au Mode Clair",
    
    // Navigation
    "nav.home": "Accueil",
    "nav.solutions": "Solutions",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.getStarted": "Commencer",
    "nav.login": "Connexion",
    "nav.logout": "Déconnexion",
    
    // Blog
    "blog.title": "Notre Blog",
    "blog.subtitle": "Aperçus, nouvelles et perspectives sur l'IA, l'automatisation et la transformation numérique.",
    "blog.featured": "Articles en Vedette",
    "blog.all": "Tous les Articles",
    "blog.readMore": "Lire Plus",
    "blog.backToBlog": "Retour au Blog",
    "blog.newsletter.title": "Restez à jour avec nos dernières informations",
    "blog.newsletter.subtitle": "Abonnez-vous à notre newsletter pour recevoir les dernières mises à jour sur l'IA, l'automatisation et la transformation numérique.",
    "blog.newsletter.button": "S'abonner",
    "blog.newsletter.placeholder": "Entrez votre email",
    
    // Contact
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
    
    // Solutions
    "solutions.title": "Nos Solutions",
    "solutions.subtitle": "Transformer les entreprises grâce à l'IA et à l'automatisation",
    "solutions.cta.title": "Prêt à transformer votre entreprise?",
    "solutions.cta.subtitle": "Commencez avec nos solutions aujourd'hui",
    "solutions.cta.button": "Contactez-Nous",
    "solutions.testimonials.title": "Ce Que Disent Nos Clients",
    "solutions.testimonials.subtitle": "Écoutez les entreprises qui se sont transformées avec nos solutions",
    "solutions.futureproof.title": "Préparez Votre Entreprise pour l'Avenir",
    "solutions.futureproof.subtitle": "Gardez une longueur d'avance sur la concurrence avec l'IA et l'automatisation de pointe",
    "solutions.futureproof.description": "Nos solutions vous aident à vous adapter au paysage commercial en rapide évolution, garantissant que votre entreprise reste compétitive et efficace.",
    
    // Home
    "home.hero.tagline": "Solutions d'IA et d'Automatisation",
    "home.hero.title": "Arrêtez de perdre du temps sur des tâches répétitives",
    "home.hero.description": "apporte des outils d'IA et d'automatisation de pointe pour vous aider à travailler plus intelligemment, à croître plus rapidement et à rester en avance sur l'avenir.",
    "home.hero.getStarted": "Commencer",
    "home.hero.learnMore": "En Savoir Plus",
    "home.about.tagline": "À Propos de Nous",
    "home.about.title": "Nous Construisons le Futur de l'Automatisation par l'IA",
    "home.about.description": "Chez Automatízalo, nous sommes une équipe de jeunes spécialistes passionnés par l'IA et d'experts en automatisation. Nous connectons, affinons et optimisons des outils d'automatisation comme Make.com, N8N, des chatbots IA et des flux de travail personnalisés pour aider les entreprises et les particuliers à devenir plus efficaces, évolutifs et prêts pour l'avenir.",
    "home.about.feature1.title": "Flux de Travail Automatisés",
    "home.about.feature1.description": "Connectez et automatisez vos flux de travail à l'aide d'IA de pointe et d'outils Make.com/N8N.",
    "home.about.feature2.title": "Chatbots IA",
    "home.about.feature2.description": "Chatbots personnalisés pour gérer le service client, la planification et l'engagement des prospects.",
    "home.about.feature3.title": "Systèmes Intelligents",
    "home.about.feature3.description": "Systèmes basés sur l'IA qui apprennent et s'adaptent aux besoins de votre entreprise au fil du temps.",
    "home.about.learnMore": "En Savoir Plus",
    "home.about.contactUs": "Contactez-Nous",
    "home.about.whyWorkWithUs": "Pourquoi Travailler Avec Nous?",
    "home.about.reason1": "Abordable et évolutif – Configuration unique, maintenance à faible coût",
    "home.about.reason2": "Outils d'IA personnalisés – Nous adaptons les solutions pour chaque client",
    "home.about.reason3": "Toujours en amélioration – Nouvelles fonctionnalités et automatisations affinées chaque mois",
    
    // Testimonials
    "testimonials.title": "Ce Que Disent Nos Clients",
    "testimonials.subtitle": "Ne vous fiez pas seulement à nos paroles - écoutez ce que nos clients ont à dire",
    "testimonials.client1.name": "Sarah Johnson",
    "testimonials.client1.company": "Tech Innovators Inc.",
    "testimonials.client1.text": "Automatízalo a transformé nos opérations de service client. Leur solution de chatbot IA a géré 70% de nos demandes de routine, libérant notre équipe pour se concentrer sur des problèmes complexes. La mise en œuvre a été fluide et les résultats ont été immédiats.",
    "testimonials.client2.name": "Carlos Rodriguez",
    "testimonials.client2.company": "Global Logistics",
    "testimonials.client2.text": "L'automatisation du flux de travail que nous avons mise en place avec Automatízalo a réduit notre temps de traitement de 60%. Leur équipe a compris nos besoins spécifiques et livré une solution qui s'intègre parfaitement à nos systèmes existants.",
    "testimonials.client3.name": "Emma Thompson",
    "testimonials.client3.company": "Creative Solutions",
    "testimonials.client3.text": "En tant que petite entreprise, nous avions besoin d'une automatisation abordable qui pourrait grandir avec nous. Automatízalo a livré exactement cela - des outils puissants qui ont simplifié nos opérations sans ruiner la banque.",
    
    // Footer
    "footer.company": "Entreprise",
    "footer.about": "À Propos de Nous",
    "footer.careers": "Carrières",
    "footer.blog": "Blog",
    "footer.contact": "Contact",
    "footer.legal": "Légal",
    "footer.terms": "Conditions",
    "footer.privacy": "Confidentialité",
    "footer.cookies": "Cookies",
    "footer.resources": "Ressources",
    "footer.documentation": "Documentation",
    "footer.help": "Centre d'Aide",
    "footer.community": "Communauté",
    "footer.copyright": "© 2023 Automatízalo. Tous droits réservés.",
    "footer.description": "Transformer les entreprises grâce à des solutions d'IA et d'automatisation"
  },
  es: {
    // Theme
    "theme.toggleDark": "Cambiar a Modo Oscuro",
    "theme.toggleLight": "Cambiar a Modo Claro",
    
    // Navigation
    "nav.home": "Inicio",
    "nav.solutions": "Soluciones",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.getStarted": "Comenzar",
    "nav.login": "Iniciar Sesión",
    "nav.logout": "Cerrar Sesión",
    
    // Blog
    "blog.title": "Nuestro Blog",
    "blog.subtitle": "Perspectivas, noticias y puntos de vista sobre IA, automatización y transformación digital.",
    "blog.featured": "Artículos Destacados",
    "blog.all": "Todos los Artículos",
    "blog.readMore": "Leer Más",
    "blog.backToBlog": "Volver al Blog",
    "blog.newsletter.title": "Mantente al día con nuestras últimas novedades",
    "blog.newsletter.subtitle": "Suscríbete a nuestro boletín para recibir las últimas actualizaciones sobre IA, automatización y transformación digital.",
    "blog.newsletter.button": "Suscribirse",
    "blog.newsletter.placeholder": "Ingresa tu email",
    
    // Contact
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
    
    // Solutions
    "solutions.title": "Nuestras Soluciones",
    "solutions.subtitle": "Transformando empresas a través de IA y automatización",
    "solutions.cta.title": "¿Listo para transformar tu empresa?",
    "solutions.cta.subtitle": "Comienza con nuestras soluciones hoy",
    "solutions.cta.button": "Contáctanos",
    "solutions.testimonials.title": "Lo Que Dicen Nuestros Clientes",
    "solutions.testimonials.subtitle": "Escucha a las empresas que se han transformado con nuestras soluciones",
    "solutions.futureproof.title": "Prepara Tu Negocio Para el Futuro",
    "solutions.futureproof.subtitle": "Mantente a la vanguardia de la competencia con IA y automatización de última generación",
    "solutions.futureproof.description": "Nuestras soluciones te ayudan a adaptarte al panorama empresarial en rápida evolución, asegurando que tu negocio siga siendo competitivo y eficiente.",
    
    // Home
    "home.hero.tagline": "Soluciones de IA y Automatización",
    "home.hero.title": "Deja de perder tiempo en tareas repetitivas",
    "home.hero.description": "trae herramientas de IA y automatización de vanguardia para ayudarte a trabajar de manera más inteligente, crecer más rápido y mantenerte a la vanguardia del futuro.",
    "home.hero.getStarted": "Comenzar",
    "home.hero.learnMore": "Saber Más",
    "home.about.tagline": "Sobre Nosotros",
    "home.about.title": "Estamos Construyendo el Futuro de la Automatización con IA",
    "home.about.description": "En Automatízalo, somos un equipo de jóvenes especialistas apasionados por la IA y expertos en automatización. Conectamos, afinamos y optimizamos herramientas de automatización como Make.com, N8N, chatbots de IA y flujos de trabajo personalizados para ayudar a empresas e individuos a ser más eficientes, escalables y estar preparados para el futuro.",
    "home.about.feature1.title": "Flujos de Trabajo Automatizados",
    "home.about.feature1.description": "Conecta y automatiza tus flujos de trabajo usando IA de vanguardia y herramientas Make.com/N8N.",
    "home.about.feature2.title": "Chatbots de IA",
    "home.about.feature2.description": "Chatbots personalizados para manejar servicio al cliente, programación y captación de clientes potenciales.",
    "home.about.feature3.title": "Sistemas Inteligentes",
    "home.about.feature3.description": "Sistemas impulsados por IA que aprenden y se adaptan a las necesidades de tu negocio con el tiempo.",
    "home.about.learnMore": "Saber Más",
    "home.about.contactUs": "Contáctanos",
    "home.about.whyWorkWithUs": "¿Por Qué Trabajar Con Nosotros?",
    "home.about.reason1": "Asequible y escalable – Configuración única, mantenimiento de bajo costo",
    "home.about.reason2": "Herramientas de IA personalizadas – Adaptamos soluciones para cada cliente",
    "home.about.reason3": "Siempre mejorando – Nuevas características y automatizaciones refinadas cada mes",
    
    // Testimonials
    "testimonials.title": "Lo Que Dicen Nuestros Clientes",
    "testimonials.subtitle": "No sólo tomes nuestra palabra - escucha lo que nuestros clientes tienen que decir",
    "testimonials.client1.name": "Sarah Johnson",
    "testimonials.client1.company": "Tech Innovators Inc.",
    "testimonials.client1.text": "Automatízalo transformó nuestras operaciones de servicio al cliente. Su solución de chatbot de IA manejó el 70% de nuestras consultas rutinarias, liberando a nuestro equipo para enfocarse en problemas complejos. La implementación fue fluida y los resultados fueron inmediatos.",
    "testimonials.client2.name": "Carlos Rodriguez",
    "testimonials.client2.company": "Global Logistics",
    "testimonials.client2.text": "La automatización de flujo de trabajo que implementamos con Automatízalo ha reducido nuestro tiempo de procesamiento en un 60%. Su equipo entendió nuestras necesidades específicas y entregó una solución que se integró perfectamente con nuestros sistemas existentes.",
    "testimonials.client3.name": "Emma Thompson",
    "testimonials.client3.company": "Creative Solutions",
    "testimonials.client3.text": "Como pequeña empresa, necesitábamos una automatización asequible que pudiera crecer con nosotros. Automatízalo entregó exactamente eso - herramientas poderosas que simplificaron nuestras operaciones sin ruinar el banco.",
    
    // Footer
    "footer.company": "Empresa",
    "footer.about": "Sobre Nosotros",
    "footer.careers": "Carreras",
    "footer.blog": "Blog",
    "footer.contact": "Contacto",
    "footer.legal": "Legal",
    "footer.terms": "Términos",
    "footer.privacy": "Privacidad",
    "footer.cookies": "Cookies",
    "footer.resources": "Recursos",
    "footer.documentation": "Documentación",
    "footer.help": "Centro de Ayuda",
    "footer.community": "Comunidad",
    "footer.copyright": "© 2023 Automatízalo. Todos los derechos reservados.",
    "footer.description": "Transformando empresas a través de soluciones de IA y automatización"
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get stored language preference or default to 'en'
    const storedLanguage = localStorage.getItem('language');
    return (storedLanguage as Language) || "en";
  });

  useEffect(() => {
    // Store language preference when it changes
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    if (!currentTranslations || !currentTranslations[key as keyof typeof currentTranslations]) {
      console.warn(`Translation key not found: ${key} for language ${language}`);
      // Fallback to English if translation not found
      return translations.en[key as keyof typeof translations.en] || key;
    }
    return currentTranslations[key as keyof typeof currentTranslations];
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
