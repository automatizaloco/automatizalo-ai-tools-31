
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "fr" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translateContent: (content: any, field: string, language: Language) => string;
};

// For blog post translations
export interface Translation {
  title?: string;
  excerpt?: string;
  content?: string;
}

export interface Translations {
  [key: string]: Translation;
}

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
    "contact.website": "Visit Our Website",
    "contact.whatsapp.title": "Let Our WhatsApp Bot Assist You 24/7",
    "contact.whatsapp.description": "Our AI-powered WhatsApp assistant can answer your questions, schedule meetings, and handle inquiries instantly - anytime, anywhere.",
    "contact.whatsapp.cta": "Connect with us now for fast responses, meeting scheduling, and personalized assistance!",
    "contact.whatsapp.defaultMessage": "Hello, I would like to know more about your services",
    "contact.whatsapp.chat": "Chat with us",
    "contact.chat.greeting": "👋 Hello! Welcome to Automatizalo. How can I help you today?",
    "contact.chat.askServices": "Hi there! I'm interested in learning more about your AI automation services.",
    "contact.chat.explainServices": "Great! We offer AI chatbots, workflow automation, lead generation, and social media content creation. What are you looking to automate?",
    "contact.chat.askMeeting": "That sounds interesting. I'd like to schedule a meeting to discuss workflow automation options for my business.",
    "contact.chat.confirmMeeting": "I'd be happy to arrange that. Would tomorrow at 10:00 AM work for you?",
    "contact.chat.acceptTime": "Yes, that time works perfectly for me.",
    "contact.chat.scheduledSuccess": "Excellent! I've scheduled our meeting for tomorrow at 10:00 AM. You'll receive a calendar invite shortly. Looking forward to it!",
    "contact.chat.meetingScheduled": "Meeting Scheduled!",
    "contact.chat.online": "Online",
    "contact.chat.you": "You",
    "language": "en",
    
    // Solutions
    "solutions.title": "Our Solutions",
    "solutions.subtitle": "Transforming businesses through AI and automation",
    "solutions.sectionTag": "Our Solutions",
    "solutions.sectionTitle": "AI-Powered Services for Every Business & Individual",
    "solutions.sectionDescription": "At Automatízalo, we connect and automate your workflows using cutting-edge AI and automation tools to help you work smarter.",
    "solutions.viewAllButton": "View All Solutions",
    "solutions.cta.title": "Ready to transform your business?",
    "solutions.cta.subtitle": "Get started with our solutions today",
    "solutions.cta.button": "Talk to Us About Custom AI Solutions",
    "solutions.testimonials.title": "What Our Clients Say",
    "solutions.testimonials.subtitle": "Hear from businesses that have transformed with our solutions",
    "solutions.futureproof.title": "Future-Proof Your Business with AI",
    "solutions.futureproof.subtitle": "Stay ahead of the competition with cutting-edge AI and automation",
    "solutions.futureproof.description": "Let's build the AI-driven future together. Our team of AI specialists and automation experts is ready to help you integrate AI into your life or business.",
    
    // Solution Items
    "solutions.chatbots.title": "Chatbots & AI Assistants",
    "solutions.chatbots.description": "Personalized chatbots to handle customer service, scheduling, lead engagement, and more.",
    "solutions.chatbots.feature1": "AI chatbots tailored for businesses",
    "solutions.chatbots.feature2": "WhatsApp, email & social media integration",
    "solutions.chatbots.feature3": "24/7 automated responses",
    
    "solutions.leadGeneration.title": "Lead Generation & Smart Follow-Up",
    "solutions.leadGeneration.description": "We find leads, engage them, and keep the conversation going until you get the information you need.",
    "solutions.leadGeneration.feature1": "Automated prospecting & qualification",
    "solutions.leadGeneration.feature2": "Personalized email follow-ups",
    "solutions.leadGeneration.feature3": "AI-driven conversation handling",
    
    "solutions.socialMedia.title": "Social Media & Content Creation",
    "solutions.socialMedia.description": "Let AI generate posts, blogs, Instagram stories, and social content for you.",
    "solutions.socialMedia.feature1": "AI-generated Instagram stories & posts",
    "solutions.socialMedia.feature2": "Blog & article creation",
    "solutions.socialMedia.feature3": "Multi-platform content scheduling",
    
    "solutions.aiAgents.title": "Personal AI Agents",
    "solutions.aiAgents.description": "Your own AI-powered virtual assistant to streamline daily tasks, manage emails, organize meetings, and more.",
    "solutions.aiAgents.feature1": "Connects to emails, calendar & WhatsApp",
    "solutions.aiAgents.feature2": "For businesses and individuals",
    "solutions.aiAgents.feature3": "Learns & optimizes continuously",
    
    // Home
    "home.hero.tagline": "AI & Automation Solutions",
    "home.hero.title": "Stop wasting time on repetitive tasks",
    "home.hero.description": "brings cutting-edge AI and automation tools to help you work smarter, grow faster, and stay ahead of the future.",
    "home.hero.getStarted": "Get Started",
    "home.hero.learnMore": "Learn More",
    "home.about.tagline": "About Us",
    "home.about.title": "We're Building the Future of AI Automation",
    "home.about.description": "At Automatízalo, we're a team of young, passionate AI specialists and automation experts. We connect, fine-tune, and optimize automation tools like Make.com, N8N, AI chatbots, and custom workflows to help businesses and individuals become more efficient, scalable, and future-ready.",
    "home.about.mission": "Our mission is to empower businesses of all sizes with cutting-edge AI solutions that are affordable, scalable, and easy to implement. We believe that automation should be accessible to everyone, not just tech giants.",
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
    "testimonials.title": "Testimonials",
    "testimonials.subtitle": "What Our Clients Say",
    "testimonials.description": "Discover how Automatízalo has helped businesses and individuals transform their workflows and productivity.",
    "testimonials.client1.name": "Sarah Johnson",
    "testimonials.client1.company": "Tech Innovators Inc.",
    "testimonials.client1.text": "Automatízalo has completely transformed how we handle customer inquiries. Their AI chatbot solution has reduced response times by 80% and allowed our team to focus on complex issues. The ROI has been incredible.",
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
    "contact.website": "Visitez Notre Site Web",
    "contact.whatsapp.title": "Laissez Notre Bot WhatsApp Vous Aider 24/7",
    "contact.whatsapp.description": "Notre assistant WhatsApp alimenté par l'IA peut répondre à vos questions, programmer des réunions et traiter vos demandes instantanément - à tout moment, n'importe où.",
    "contact.whatsapp.cta": "Connectez-vous avec nous maintenant pour des réponses rapides, la programmation de réunions et une assistance personnalisée!",
    "contact.whatsapp.defaultMessage": "Bonjour, je voudrais en savoir plus sur vos services",
    "contact.whatsapp.chat": "Discuter avec nous",
    "contact.chat.greeting": "👋 Bonjour! Bienvenue chez Automatizalo. Comment puis-je vous aider aujourd'hui?",
    "contact.chat.askServices": "Bonjour! Je suis intéressé(e) à en savoir plus sur vos services d'automatisation IA.",
    "contact.chat.explainServices": "Parfait! Nous proposons des chatbots IA, l'automatisation des flux de travail, la génération de leads et la création de contenu pour les réseaux sociaux. Qu'aimeriez-vous automatiser?",
    "contact.chat.askMeeting": "Cela semble intéressant. J'aimerais planifier une réunion pour discuter des options d'automatisation des flux de travail pour mon entreprise.",
    "contact.chat.confirmMeeting": "Je serais ravi d'organiser cela. Est-ce que demain à 10h00 vous conviendrait?",
    "contact.chat.acceptTime": "Oui, cet horaire me convient parfaitement.",
    "contact.chat.scheduledSuccess": "Excellent! J'ai programmé notre réunion pour demain à 10h00. Vous recevrez une invitation calendrier sous peu. Au plaisir de vous rencontrer!",
    "contact.chat.meetingScheduled": "Réunion Programmée!",
    "contact.chat.online": "En ligne",
    "contact.chat.you": "Vous",
    "language": "fr",
    
    // Solutions
    "solutions.title": "Nos Solutions",
    "solutions.subtitle": "Transformer les entreprises grâce à l'IA et à l'automatisation",
    "solutions.sectionTag": "Nos Solutions",
    "solutions.sectionTitle": "Services Alimentés par l'IA pour Chaque Entreprise et Individu",
    "solutions.sectionDescription": "Chez Automatízalo, nous connectons et automatisons vos flux de travail à l'aide d'outils d'IA et d'automatisation de pointe pour vous aider à travailler plus intelligemment.",
    "solutions.viewAllButton": "Voir Toutes les Solutions",
    "solutions.cta.title": "Prêt à transformer votre entreprise?",
    "solutions.cta.subtitle": "Commencez avec nos solutions aujourd'hui",
    "solutions.cta.button": "Parlez-nous de Solutions IA Personnalisées",
    "solutions.testimonials.title": "Ce Que Disent Nos Clients",
    "solutions.testimonials.subtitle": "Écoutez les entreprises qui se sont transformées avec nos solutions",
    "solutions.futureproof.title": "Préparez Votre Entreprise pour l'Avenir avec l'IA",
    "solutions.futureproof.subtitle": "Gardez une longueur d'avance sur la concurrence avec l'IA et l'automatisation de pointe",
    "solutions.futureproof.description": "Construisons ensemble l'avenir axé sur l'IA. Notre équipe de spécialistes en IA et d'experts en automatisation est prête à vous aider à intégrer l'IA dans votre vie ou votre entreprise.",
    
    // Solution Items
    "solutions.chatbots.title": "Chatbots et Assistants IA",
    "solutions.chatbots.description": "Chatbots personnalisés pour gérer le service client, la planification, l'engagement des prospects, et plus encore.",
    "solutions.chatbots.feature1": "Chatbots IA adaptés aux entreprises",
    "solutions.chatbots.feature2": "Intégration WhatsApp, email et réseaux sociaux",
    "solutions.chatbots.feature3": "Réponses automatisées 24/7",
    
    "solutions.leadGeneration.title": "Génération de Leads et Suivi Intelligent",
    "solutions.leadGeneration.description": "Nous trouvons des prospects, les engageons et maintenons la conversation jusqu'à ce que vous obteniez les informations dont vous avez besoin.",
    "solutions.leadGeneration.feature1": "Prospection et qualification automatisées",
    "solutions.leadGeneration.feature2": "Suivis par email personnalisés",
    "solutions.leadGeneration.feature3": "Gestion de conversation pilotée par l'IA",
    
    "solutions.socialMedia.title": "Médias Sociaux et Création de Contenu",
    "solutions.socialMedia.description": "Laissez l'IA générer des posts, des blogs, des stories Instagram et du contenu social pour vous.",
    "solutions.socialMedia.feature1": "Stories et posts Instagram générés par l'IA",
    "solutions.socialMedia.feature2": "Création de blogs et d'articles",
    "solutions.socialMedia.feature3": "Planification de contenu multi-plateformes",
    
    "solutions.aiAgents.title": "Agents IA Personnels",
    "solutions.aiAgents.description": "Votre propre assistant virtuel propulsé par l'IA pour rationaliser les tâches quotidiennes, gérer les emails, organiser des réunions, et plus encore.",
    "solutions.aiAgents.feature1": "Se connecte aux emails, au calendrier et à WhatsApp",
    "solutions.aiAgents.feature2": "Pour les entreprises et les particuliers",
    "solutions.aiAgents.feature3": "Apprend et s'optimise continuellement",
    
    // Home
    "home.hero.tagline": "Solutions d'IA et d'Automatisation",
    "home.hero.title": "Arrêtez de perdre du temps sur des tâches répétitives",
    "home.hero.description": "apporte des outils d'IA et d'automatisation de pointe pour vous aider à travailler plus intelligemment, à croître plus rapidement et à rester en avance sur l'avenir.",
    "home.hero.getStarted": "Commencer",
    "home.hero.learnMore": "En Savoir Plus",
    "home.about.tagline": "À Propos de Nous",
    "home.about.title": "Nous Construisons le Futur de l'Automatisation par l'IA",
    "home.about.description": "Chez Automatízalo, nous sommes une équipe de jeunes spécialistes passionnés par l'IA et d'experts en automatisation. Nous connectons, affinons et optimisons des outils d'automatisation comme Make.com, N8N, des chatbots IA et des flux de travail personnalisés pour aider les entreprises et les particuliers à devenir plus efficaces, évolutifs et prêts pour l'avenir.",
    "home.about.mission": "Notre mission est de permettre aux entreprises de toutes tailles d'accéder à des solutions d'IA de pointe qui sont abordables, évolutives et faciles à mettre en œuvre. Nous croyons que l'automatisation devrait être accessible à tous, pas seulement aux géants de la technologie.",
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
    "testimonials.title": "Témoignages",
    "testimonials.subtitle": "Ce Que Disent Nos Clients",
    "testimonials.description": "Découvrez comment Automatízalo a aidé les entreprises et les particuliers à transformer leurs flux de travail et leur productivité.",
    "testimonials.client1.name": "Sarah Johnson",
    "testimonials.client1.company": "Tech Innovators Inc.",
    "testimonials.client1.text": "Automatízalo a complètement transformé notre façon de gérer les demandes des clients. Leur solution de chatbot IA a réduit les temps de réponse de 80% et a permis à notre équipe de se concentrer sur des problèmes complexes. Le retour sur investissement a été incroyable.",
    "testimonials.client2.name": "Carlos Rodriguez",
    "testimonials.client2.company": "Global Logistics",
    "testimonials.client2.text": "L'automatisation des flux de travail que nous avons mise en œuvre avec Automatízalo a réduit notre temps de traitement de 60%. Leur équipe a compris nos besoins spécifiques et a livré une solution qui s'intègre parfaitement à nos systèmes existants.",
    "testimonials.client3.name": "Emma Thompson",
    "testimonials.client3.company": "Creative Solutions",
    "testimonials.client3.text": "As a small business, we needed affordable automation that could grow with us. Automatízalo delivered exactly that - powerful tools that simplified our operations without breaking the bank.",
    
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
    "footer.copyright": "© 2023 Automatízalo. Tous droits réservs.",
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
    "contact.website": "Visita Nuestra Web",
    "contact.whatsapp.title": "Deja Que Nuestro Bot de WhatsApp Te Ayude 24/7",
    "contact.whatsapp.description": "Nuestro asistente de WhatsApp impulsado por IA puede responder tus preguntas, programar reuniones y gestionar consultas instantáneamente - en cualquier momento y lugar.",
    "contact.whatsapp.cta": "¡Conéctate con nosotros ahora para respuestas rápidas, programación de reuniones y asistencia personalizada!",
    "contact.whatsapp.defaultMessage": "Hola, me gustaría saber más sobre sus servicios",
    "contact.whatsapp.chat": "Chatear con nosotros",
    "contact.chat.greeting": "👋 ¡Hola! Bienvenido a Automatizalo. ¿Cómo puedo ayudarte hoy?",
    "contact.chat.askServices": "¡Hola! Estoy interesado en conocer más sobre sus servicios de automatización con IA.",
    "contact.chat.explainServices": "¡Genial! Ofrecemos chatbots de IA, automatización de flujos de trabajo, generación de leads y creación de contenido para redes sociales. ¿Qué te gustaría automatizar?",
    "contact.chat.askMeeting": "Eso suena interesante. Me gustaría programar una reunión para discutir opciones de automatización de flujos de trabajo para mi negocio.",
    "contact.chat.confirmMeeting": "Estaré encantado de organizarlo. ¿Te funcionaría mañana a las 10:00 AM?",
    "contact.chat.acceptTime": "Sí, ese horario me funciona perfectamente.",
    "contact.chat.scheduledSuccess": "¡Excelente! He programado nuestra reunión para mañana a las 10:00 AM. Recibirás una invitación de calendario en breve. ¡Esperamos con interés!",
    "contact.chat.meetingScheduled": "¡Reunión Programada!",
    "contact.chat.online": "En línea",
    "contact.chat.you": "Tú",
    "language": "es",
    
    // Solutions
    "solutions.title": "Nuestras Soluciones",
    "solutions.subtitle": "Transformando empresas a través de IA y automatización",
    "solutions.sectionTag": "Nuestras Soluciones",
    "solutions.sectionTitle": "Servicios Impulsados por IA para Cada Empresa e Individuo",
    "solutions.sectionDescription": "En Automatízalo, conectamos y automatizamos sus flujos de trabajo utilizando herramientas de IA y automatización de vanguardia para ayudarlo a trabajar de manera más inteligente.",
    "solutions.viewAllButton": "Ver Todas las Soluciones",
    "solutions.cta.title": "¿Listo para transformar tu negocio?",
    "solutions.cta.subtitle": "Comienza con nuestras soluciones hoy",
    "solutions.cta.button": "Habla con Nosotros Sobre Soluciones IA Personalizadas",
    "solutions.testimonials.title": "Lo Que Dicen Nuestros Clientes",
    "solutions.testimonials.subtitle": "Escucha a las empresas que se han transformado con nuestras soluciones",
    "solutions.futureproof.title": "Prepara Tu Negocio Para el Futuro con IA",
    "solutions.futureproof.subtitle": "Mantente a la vanguardia de la competencia con IA y automatización de última generación",
    "solutions.futureproof.description": "Construyamos juntos el futuro impulsado por la IA. Nuestro equipo de especialistas en IA y expertos en automatización está listo para ayudarte a integrar la IA en tu vida o negocio.",
    
    // Solution Items
    "solutions.chatbots.title": "Chatbots y Asistentes IA",
    "solutions.chatbots.description": "Chatbots personalizados para manejar servicio al cliente, programación, captación de clientes potenciales y más.",
    "solutions.chatbots.feature1": "Chatbots IA adaptados para empresas",
    "solutions.chatbots.feature2": "Integración con WhatsApp, email y redes sociales",
    "solutions.chatbots.feature3": "Respuestas automatizadas 24/7",
    
    "solutions.leadGeneration.title": "Generación de Leads y Seguimiento Inteligente",
    "solutions.leadGeneration.description": "Encontramos leads, los involucramos y mantenemos la conversación hasta que obtienes la información que necesitas.",
    "solutions.leadGeneration.feature1": "Prospección y calificación automatizada",
    "solutions.leadGeneration.feature2": "Seguimientos por email personalizados",
    "solutions.leadGeneration.feature3": "Gestión de conversaciones impulsada por IA",
    
    "solutions.socialMedia.title": "Medios Sociales y Creación de Contenido",
    "solutions.socialMedia.description": "Deja que la IA genere posts, blogs, historias de Instagram y contenido social para ti.",
    "solutions.socialMedia.feature1": "Historias y posts de Instagram generados por IA",
    "solutions.socialMedia.feature2": "Creación de blogs y artículos",
    "solutions.socialMedia.feature3": "Programación de contenido multiplataforma",
    
    "solutions.aiAgents.title": "Agentes IA Personales",
    "solutions.aiAgents.description": "Tu propio asistente virtual impulsado por IA para agilizar tareas diarias, gestionar emails, organizar reuniones y más.",
    "solutions.aiAgents.feature1": "Se conecta a emails, calendario y WhatsApp",
    "solutions.aiAgents.feature2": "Para empresas e individuos",
    "solutions.aiAgents.feature3": "Aprende y se optimiza continuamente",
    
    // Home
    "home.hero.tagline": "Soluciones de IA y Automatización",
    "home.hero.title": "Deja de perder tiempo en tareas repetitivas",
    "home.hero.description": "trae herramientas de IA y automatización de vanguardia para ayudarte a trabajar más inteligentemente, crecer más rápido y mantenerte por delante del futuro.",
    "home.hero.getStarted": "Comenzar",
    "home.hero.learnMore": "Saber Más",
    "home.about.tagline": "Sobre Nosotros",
    "home.about.title": "Estamos Construyendo el Futuro de la Automatización con IA",
    "home.about.description": "En Automatízalo, somos un equipo de jóvenes especialistas apasionados por la IA y expertos en automatización. Conectamos, afinamos y optimizamos herramientas de automatización como Make.com, N8N, chatbots de IA y flujos de trabajo personalizados para ayudar a empresas e individuos a volverse más eficientes, escalables y preparados para el futuro.",
    "home.about.mission": "Nuestra misión es empoderar a empresas de todos los tamaños con soluciones de IA de vanguardia que sean asequibles, escalables y fáciles de implementar. Creemos que la automatización debe ser accesible para todos, no solo para los gigantes tecnológicos.",
    "home.about.feature1.title": "Flujos de Trabajo Automatizados",
    "home.about.feature1.description": "Conecta y automatiza tus flujos de trabajo usando IA de vanguardia y herramientas Make.com/N8N.",
    "home.about.feature2.title": "Chatbots IA",
    "home.about.feature2.description": "Chatbots personalizados para manejar servicio al cliente, programación y captación de clientes potenciales.",
    "home.about.feature3.title": "Sistemas Inteligentes",
    "home.about.feature3.description": "Sistemas impulsados por IA que aprenden y se adaptan a las necesidades de tu negocio con el tiempo.",
    "home.about.learnMore": "Saber Más",
    "home.about.contactUs": "Contáctanos",
    "home.about.whyWorkWithUs": "¿Por Qué Trabajar Con Nosotros?",
    "home.about.reason1": "Asequible y escalable – Configuración única, mantenimiento de bajo costo",
    "home.about.reason2": "Herramientas de IA personalizadas – Adaptamos soluciones para cada cliente",
    "home.about.reason3": "Siempre mejorando – Nuevas características y automatizaciones afinadas cada mes",
    
    // Testimonials
    "testimonials.title": "Testimonios",
    "testimonials.subtitle": "Lo Que Dicen Nuestros Clientes",
    "testimonials.description": "Descubre cómo Automatízalo ha ayudado a empresas e individuos a transformar sus flujos de trabajo y productividad.",
    "testimonials.client1.name": "Sarah Johnson",
    "testimonials.client1.company": "Tech Innovators Inc.",
    "testimonials.client1.text": "Automatízalo ha transformado completamente cómo manejamos las consultas de clientes. Su solución de chatbot IA ha reducido los tiempos de respuesta en un 80% y ha permitido a nuestro equipo enfocarse en problemas complejos. El ROI ha sido increíble.",
    "testimonials.client2.name": "Carlos Rodriguez",
    "testimonials.client2.company": "Global Logistics",
    "testimonials.client2.text": "La automatización de flujo de trabajo que implementamos con Automatízalo ha reducido nuestro tiempo de procesamiento en un 60%. Su equipo entendió nuestras necesidades específicas y entregó una solución que se integró perfectamente con nuestros sistemas existentes.",
    "testimonials.client3.name": "Emma Thompson",
    "testimonials.client3.company": "Creative Solutions",
    "testimonials.client3.text": "Como pequeña empresa, necesitábamos una automatización asequible que pudiera crecer con nosotros. Automatízalo entregó exactamente eso - herramientas potentes que simplificaron nuestras operaciones sin arruinar nuestro presupuesto.",
    
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
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage first
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage whenever it changes
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const lang = translations[language] || translations.en;
    return lang[key] || key;
  };

  // Function to translate content from a blog post or other content object that might have translations
  const translateContent = (content: any, field: string, lang: Language): string => {
    if (!content) return '';
    
    // If content has translations and the field exists in the translation
    if (content.translations && 
        content.translations[lang] && 
        content.translations[lang][field]) {
      return content.translations[lang][field];
    }
    
    // Fallback to the default language field
    return content[field] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
