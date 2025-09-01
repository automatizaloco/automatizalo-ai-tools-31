import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, options?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      solutions: 'Solutions',
      blog: 'Blog',
      contact: 'Contact',
      logout: 'Logout',
      login: 'Login'
    },
    home: {
      hero: {
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        tagline: '🚀 Automated Business Solutions',
        title: 'Transform Your Business with AI Automation',
        description: 'helps businesses automate repetitive tasks, improve efficiency, and scale operations with cutting-edge AI technology. From chatbots to data analysis, we\'ve got you covered.'
      }
    },
    solutions: {
      title: 'Our Solutions',
      subtitle: 'Comprehensive AI Automation Solutions',
      description: 'Discover how our AI-powered automation solutions can transform your business operations and boost productivity.',
      sectionTag: 'Our Solutions',
      sectionTitle: 'Automate Your Business with AI',
      sectionDescription: 'Discover our comprehensive suite of AI-powered automation solutions designed to streamline your operations and boost productivity.',
      viewAllButton: 'View All Solutions',
      cta: {
        title: 'Ready to Transform Your Business?',
        subtitle: 'Get started with our AI automation solutions today',
        button: 'Get Started',
        contact: 'Contact Us'
      },
      futureproof: {
        title: 'Future-Proof Your Business',
        description: 'Stay ahead of the competition with cutting-edge AI automation technologies that adapt to your growing business needs.',
        features: ['Scalable Solutions', 'Advanced AI', 'Custom Integration', '24/7 Support']
      },
      chatbots: {
        title: 'AI Chatbots',
        description: 'Intelligent chatbots that provide 24/7 customer support and lead generation',
        feature1: '24/7 Customer Support',
        feature2: 'Lead Generation',
        feature3: 'Multi-language Support'
      },
      leadGeneration: {
        title: 'Lead Generation',
        description: 'Automated systems to capture, qualify and nurture leads for your business',
        feature1: 'Lead Capture Forms',
        feature2: 'Automated Follow-up',
        feature3: 'CRM Integration'
      },
      socialMedia: {
        title: 'Social Media Automation',
        description: 'Streamline your social media presence with automated posting and engagement',
        feature1: 'Automated Posting',
        feature2: 'Content Scheduling',
        feature3: 'Engagement Tracking'
      },
      aiAgents: {
        title: 'AI Agents',
        description: 'Custom AI agents that handle complex business processes and decision-making',
        feature1: 'Process Automation',
        feature2: 'Data Analysis',
        feature3: 'Custom Workflows'
      }
    },
    blog: {
      title: "Blog",
      subtitle: "Discover insights, trends, and innovations in automation and AI",
      description: "Stay updated with the latest articles about automation, artificial intelligence, and digital transformation. Learn how technology can revolutionize your business.",
      featured: "Featured Posts",
      all: "All Posts",
      readMore: "Read More",
      relatedPosts: "Related Posts",
      newsletter: {
        title: 'Stay Updated',
        subtitle: 'Subscribe to our newsletter for the latest AI automation insights',
        placeholder: 'Enter your email',
        button: 'Subscribe',
        success: 'Successfully subscribed!',
        error: 'Failed to subscribe. Please try again.'
      },
      categories: 'Categories',
      allPosts: 'All Posts'
    },
    footer: {
      company: 'Company',
      about: 'About Us',
      blog: 'Blog',
      contact: 'Contact',
      resources: 'Resources',
      solutions: 'Solutions',
      description: 'Transform your business with cutting-edge AI automation solutions. From chatbots to data analysis, we help you automate repetitive tasks and scale your operations efficiently.',
      copyright: '© 2024 Automatízalo. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service'
    },
    testimonials: {
      title: 'Testimonials',
      subtitle: 'What Our Clients Say',
      description: 'Hear from businesses that have transformed their operations with our AI automation solutions.'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in Touch',
      description: 'Ready to transform your business? Contact us today to discuss your automation needs.',
      whatsapp: {
        title: 'Chat with Us on WhatsApp',
        cta: 'Start a conversation with our team and get instant support.',
        chat: 'Start Chat',
        defaultMessage: 'Hello! I\'m interested in learning more about your automation services.'
      },
      chat: {
        greeting: 'Hello! How can I help you with automation today?',
        askServices: 'What automation services do you offer?',
        explainServices: 'We offer AI chatbots, lead generation, social media automation, and custom AI agents. Would you like to schedule a consultation?',
        askMeeting: 'Yes, I\'d like to schedule a meeting.',
        confirmMeeting: 'Perfect! I can schedule a 30-minute consultation for tomorrow at 2 PM. Does that work for you?',
        acceptTime: 'That sounds great!',
        scheduledSuccess: 'Excellent! Meeting scheduled for tomorrow at 2 PM. You\'ll receive a calendar invite shortly.',
        meetingScheduled: 'Meeting Scheduled Successfully!',
        online: 'Online',
        you: 'You'
      }
    },
    login: {
      welcome: 'Welcome to',
      clientWelcomeDesc: 'Client Portal - Access your automations',
      email: 'Email',
      password: 'Password',
      rememberPassword: 'Remember password',
      signIn: 'Sign In',
      loggingIn: 'Logging In...',
      loginError: 'Invalid credentials'
    },
    clientPortal: {
      title: 'Client Portal',
      subtitle: 'Manage your automations and support tickets',
      myAutomations: 'My Automations',
      marketplace: 'Marketplace',
      support: 'Support',
      myAutomationsTitle: 'Active Automations',
      myAutomationsDesc: 'Here\'s an overview of your active automations.',
      ready: 'Ready',
      total: 'Total',
      purchaseDate: 'Purchase Date',
      nextBilling: 'Next Billing',
      monthlyPrice: 'Monthly Price',
      status: 'Status',
      active: 'Active',
      cancel: 'Cancel Subscription',
      cancelSuccess: 'Subscription canceled successfully.',
      cancelError: 'Failed to cancel subscription.',
      setupPending: 'Setup Pending',
      setupInProgress: 'Setup In Progress',
      readyToUse: 'Ready to Use',
      webhook: 'Webhook',
      customPrompt: 'Custom Prompt',
      form: 'Form',
      table: 'Table',
      noActiveAutomations: 'No Active Automations',
      noActiveAutomationsDesc: 'Explore the marketplace to find the perfect automation for your needs.',
      browseMarketplace: 'Browse Marketplace',
      settingUp: 'Setting Up',
      manage: 'Manage',
      viewDetails: 'View Details',
      configure: 'Configure',
      getSupport: 'Get Support',
      description: 'Description',
      features: 'Features',
      instructions: 'Instructions',
      setupInstructions: 'Setup Instructions',
      usageInstructions: 'Usage Instructions',
      troubleshooting: 'Troubleshooting',
      integrationSettings: 'Integration Settings',
      webhookUrl: 'Webhook URL',
      customPrompts: 'Custom Prompts',
      formIntegration: 'Form Integration',
      tableData: 'Table Data',
      analytics: 'Analytics',
      logs: 'Logs',
      configuration: 'Configuration'
    },
    marketplace: {
      noAutomations: 'No Automations Available',
      noAutomationsDesc: 'There are currently no automations available in the marketplace.',
      setup: 'Setup',
      monthly: 'Monthly',
      features: 'Features',
      customPrompts: 'Custom prompts',
      webhooks: 'Webhooks',
      forms: 'Forms',
      tables: 'Tables',
      purchase: 'Purchase',
      viewDetails: 'View Details',
      alreadyOwned: 'You already own this automation',
      loginToPurchase: 'Please login to purchase automations',
      purchaseSuccess: 'Automation purchased successfully! Our team will set it up for you soon.',
      purchaseError: 'Failed to purchase automation',
      loading: 'Loading automations...',
      price: 'Price',
      oneTimeSetup: 'One-time setup',
      description: 'Description',
      included: 'Included features'
    },
    support: {
      tickets: 'Support Tickets',
      createNewTicket: 'Create New Ticket',
      noTickets: "You haven't created any support tickets yet.",
      createFirstTicket: 'Create Your First Ticket',
      selectAutomation: 'Select Automation',
      selectAutomationPlaceholder: 'Select an automation',
      title: 'Title',
      titlePlaceholder: 'Brief description of your issue',
      description: 'Description',
      descriptionPlaceholder: 'Please provide details about your issue',
      cancel: 'Cancel',
      submit: 'Submit Ticket',
      submitting: 'Submitting...',
      createSuccess: 'Support ticket created successfully',
      createError: 'Failed to create support ticket',
      loadError: 'Failed to load your support tickets',
      noActiveAutomations: 'No Active Automations',
      noActiveAutomationsDesc: 'You need an active automation to create a support ticket.',
      browseMarketplace: 'Browse Marketplace',
      backToSupport: 'Back to Support',
      ticketNotFound: "Ticket not found or you don't have permission to view it.",
      backToPortal: 'Back to Client Portal',
      ticketIdRequired: 'Ticket ID is required.',
      typeResponse: 'Type your response here...',
      sendResponse: 'Send Response',
      responseSuccess: 'Response submitted successfully',
      responseError: 'Failed to submit response',
      conversation: 'Conversation',
      noResponses: 'No responses yet',
      supportTeam: 'Support Team',
      client: 'Client',
      automationLabel: 'Automation:',
      createdLabel: 'Created:',
      status: 'Status',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
      priority: 'Priority',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    automationDetails: {
      loadingDetails: 'Loading automation details...',
      notFound: 'Automation Not Found',
      notFoundDesc: "The automation you're looking for doesn't exist or you don't have access to it.",
      backToPortal: 'Back to Portal',
      purchaseDate: 'Purchase Date',
      nextBilling: 'Next Billing',
      status: 'Status',
      setup: 'Setup',
      setupInProgress: 'Setup in Progress',
      setupInProgressDesc: "Our team is currently configuring your automation. You'll receive a notification once it's ready to use.",
      noIntegrationsAvailable: 'No Integrations Available',
      noIntegrationsDesc: "This automation doesn't have any active integrations configured yet.",
      webhooks: 'Webhooks',
      customPrompts: 'Custom Prompts',
      forms: 'Forms',
      tables: 'Tables',
      createTicket: 'Create Ticket',
      overview: 'Overview',
      integrations: 'Integrations',
      documentation: 'Documentation',
      support: 'Support',
      settings: 'Settings',
      webhook: 'Webhook',
      customPrompt: 'Custom Prompt',
      form: 'Form',
      table: 'Table',
      active: 'Active',
      inactive: 'Inactive',
      configure: 'Configure',
      test: 'Test',
      save: 'Save',
      copy: 'Copy',
      copied: 'Copied!',
      url: 'URL',
      method: 'Method',
      headers: 'Headers',
      payload: 'Payload',
      response: 'Response',
      logs: 'Logs',
      analytics: 'Analytics',
      requests: 'Requests',
      errors: 'Errors',
      successRate: 'Success Rate',
      averageResponse: 'Average Response Time',
      lastRequest: 'Last Request',
      totalRequests: 'Total Requests',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      update: 'Update',
      loading: 'Loading...',
      noData: 'No data available',
      refresh: 'Refresh'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      solutions: 'Soluciones',
      blog: 'Blog',
      contact: 'Contacto',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión'
    },
    home: {
      hero: {
        getStarted: 'Comenzar',
        learnMore: 'Aprender Más',
        tagline: '🚀 Soluciones Empresariales Automatizadas',
        title: 'Transforma Tu Negocio con Automatización IA',
        description: 'ayuda a las empresas a automatizar tareas repetitivas, mejorar la eficiencia y escalar operaciones con tecnología IA de vanguardia. Desde chatbots hasta análisis de datos, te tenemos cubierto.'
      }
    },
    solutions: {
      title: 'Nuestras Soluciones',
      subtitle: 'Soluciones Integrales de Automatización IA',
      description: 'Descubre cómo nuestras soluciones de automatización impulsadas por IA pueden transformar las operaciones de tu negocio y aumentar la productividad.',
      sectionTag: 'Nuestras Soluciones',
      sectionTitle: 'Automatiza Tu Negocio con IA',
      sectionDescription: 'Descubre nuestra suite integral de soluciones de automatización impulsadas por IA diseñadas para optimizar tus operaciones y aumentar la productividad.',
      viewAllButton: 'Ver Todas las Soluciones',
      cta: {
        title: '¿Listo para Transformar Tu Negocio?',
        subtitle: 'Comienza con nuestras soluciones de automatización IA hoy',
        button: 'Comenzar',
        contact: 'Contáctanos'
      },
      futureproof: {
        title: 'Prepara Tu Negocio para el Futuro',
        description: 'Mantén por delante de la competencia con tecnologías de automatización IA de vanguardia que se adaptan a las necesidades crecientes de tu negocio.',
        features: ['Soluciones Escalables', 'IA Avanzada', 'Integración Personalizada', 'Soporte 24/7']
      },
      chatbots: {
        title: 'Chatbots IA',
        description: 'Chatbots inteligentes que brindan soporte al cliente 24/7 y generación de leads',
        feature1: 'Soporte 24/7 al Cliente',
        feature2: 'Generación de Leads',
        feature3: 'Soporte Multiidioma'
      },
      leadGeneration: {
        title: 'Generación de Leads',
        description: 'Sistemas automatizados para capturar, calificar y nutrir leads para tu negocio',
        feature1: 'Formularios de Captura',
        feature2: 'Seguimiento Automatizado',
        feature3: 'Integración CRM'
      },
      socialMedia: {
        title: 'Automatización de Redes Sociales',
        description: 'Optimiza tu presencia en redes sociales con publicación y engagement automatizados',
        feature1: 'Publicación Automatizada',
        feature2: 'Programación de Contenido',
        feature3: 'Seguimiento de Engagement'
      },
      aiAgents: {
        title: 'Agentes IA',
        description: 'Agentes IA personalizados que manejan procesos empresariales complejos y toma de decisiones',
        feature1: 'Automatización de Procesos',
        feature2: 'Análisis de Datos',
        feature3: 'Flujos de Trabajo Personalizados'
      }
    },
    blog: {
      title: "Blog",
      subtitle: "Descubre insights, tendencias e innovaciones en automatización e IA",
      description: "Mantente actualizado con los últimos artículos sobre automatización, inteligencia artificial y transformación digital. Aprende cómo la tecnología puede revolucionar tu negocio.",
      featured: "Artículos Destacados",
      all: "Todos los Artículos",
      readMore: "Leer Más",
      relatedPosts: "Artículos Relacionados",
      newsletter: {
        title: 'Mantente Actualizado',
        subtitle: 'Suscríbete a nuestro boletín para las últimas perspectivas de automatización IA',
        placeholder: 'Ingresa tu email',
        button: 'Suscribirse',
        success: '¡Suscripción exitosa!',
        error: 'Error al suscribirse. Por favor intenta de nuevo.'
      },
      categories: 'Categorías',
      allPosts: 'Todas las Publicaciones'
    },
    footer: {
      company: 'Empresa',
      about: 'Acerca de Nosotros',
      blog: 'Blog',
      contact: 'Contacto',
      resources: 'Recursos',
      solutions: 'Soluciones',
      description: 'Transforma tu negocio con soluciones de automatización IA de vanguardia. Desde chatbots hasta análisis de datos, te ayudamos a automatizar tareas repetitivas y escalar tus operaciones eficientemente.',
      copyright: '© 2024 Automatízalo. Todos los derechos reservados.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio'
    },
    clientPortal: {
      title: 'Portal del Cliente',
      subtitle: 'Administra tus automatizaciones y tickets de soporte',
      myAutomations: 'Mis Automatizaciones',
      marketplace: 'Mercado',
      support: 'Soporte',
      myAutomationsTitle: 'Automatizaciones Activas',
      myAutomationsDesc: 'Aquí tienes una visión general de tus automatizaciones activas.',
      ready: 'Listo',
      total: 'Total',
      purchaseDate: 'Fecha de Compra',
      nextBilling: 'Próxima Facturación',
      monthlyPrice: 'Precio Mensual',
      status: 'Estado',
      active: 'Activo',
      cancel: 'Cancelar Suscripción',
      cancelSuccess: 'Suscripción cancelada exitosamente.',
      cancelError: 'Error al cancelar la suscripción.',
      setupPending: 'Configuración Pendiente',
      setupInProgress: 'Configuración en Progreso',
      readyToUse: 'Listo para Usar',
      webhook: 'Webhook',
      customPrompt: 'Prompt Personalizado',
      form: 'Formulario',
      table: 'Tabla',
      noActiveAutomations: 'Sin Automatizaciones Activas',
      noActiveAutomationsDesc: 'Explora el mercado para encontrar la automatización perfecta para tus necesidades.',
      browseMarketplace: 'Explorar Mercado',
      settingUp: 'Configurando',
      manage: 'Administrar',
      viewDetails: 'Ver Detalles',
      configure: 'Configurar',
      getSupport: 'Obtener Soporte',
      description: 'Descripción',
      features: 'Características',
      instructions: 'Instrucciones',
      setupInstructions: 'Instrucciones de Configuración',
      usageInstructions: 'Instrucciones de Uso',
      troubleshooting: 'Solución de Problemas',
      integrationSettings: 'Configuración de Integración',
      webhookUrl: 'URL del Webhook',
      customPrompts: 'Prompts Personalizados',
      formIntegration: 'Integración de Formulario',
      tableData: 'Datos de Tabla',
      analytics: 'Analíticas',
      logs: 'Registros',
      configuration: 'Configuración'
    },
    testimonials: {
      title: 'Testimonios',
      subtitle: 'Lo Que Dicen Nuestros Clientes',
      description: 'Escucha a empresas que han transformado sus operaciones con nuestras soluciones de automatización IA.'
    },
    contact: {
      title: 'Contáctanos',
      subtitle: 'Ponte en Contacto',
      description: '¿Listo para transformar tu negocio? Contáctanos hoy para discutir tus necesidades de automatización.',
      whatsapp: {
        title: 'Chatea con Nosotros en WhatsApp',
        cta: 'Inicia una conversación con nuestro equipo y obtén soporte instantáneo.',
        chat: 'Iniciar Chat',
        defaultMessage: '¡Hola! Estoy interesado en aprender más sobre sus servicios de automatización.'
      },
      chat: {
        greeting: '¡Hola! ¿Cómo puedo ayudarte con automatización hoy?',
        askServices: '¿Qué servicios de automatización ofrecen?',
        explainServices: 'Ofrecemos chatbots IA, generación de leads, automatización de redes sociales y agentes IA personalizados. ¿Te gustaría programar una consulta?',
        askMeeting: 'Sí, me gustaría programar una reunión.',
        confirmMeeting: '¡Perfecto! Puedo programar una consulta de 30 minutos para mañana a las 2 PM. ¿Te funciona?',
        acceptTime: '¡Suena genial!',
        scheduledSuccess: '¡Excelente! Reunión programada para mañana a las 2 PM. Recibirás una invitación de calendario pronto.',
        meetingScheduled: '¡Reunión Programada Exitosamente!',
        online: 'En línea',
        you: 'Tú'
      }
    },
    login: {
      welcome: 'Bienvenido a',
      clientWelcomeDesc: 'Portal del Cliente - Accede a tus automatizaciones',
      email: 'Correo electrónico',
      password: 'Contraseña',
      rememberPassword: 'Recordar contraseña',
      signIn: 'Iniciar Sesión',
      loggingIn: 'Iniciando Sesión...',
      loginError: 'Credenciales inválidas'
    },
    marketplace: {
      noAutomations: 'No Hay Automatizaciones Disponibles',
      noAutomationsDesc: 'Actualmente no hay automatizaciones disponibles en el mercado.',
      setup: 'Configuración',
      monthly: 'Mensual',
      features: 'Características',
      customPrompts: 'Prompts personalizados',
      webhooks: 'Webhooks',
      forms: 'Formularios',
      tables: 'Tablas',
      purchase: 'Comprar',
      viewDetails: 'Ver Detalles',
      alreadyOwned: 'Ya posees esta automatización',
      loginToPurchase: 'Por favor inicia sesión para comprar automatizaciones',
      purchaseSuccess: '¡Automatización comprada exitosamente! Nuestro equipo la configurará pronto.',
      purchaseError: 'Error al comprar la automatización',
      loading: 'Cargando automatizaciones...',
      price: 'Precio',
      oneTimeSetup: 'Configuración única',
      description: 'Descripción',
      included: 'Características incluidas'
    },
    support: {
      tickets: 'Tickets de Soporte',
      createNewTicket: 'Crear Nuevo Ticket',
      noTickets: 'Aún no has creado ningún ticket de soporte.',
      createFirstTicket: 'Crear Tu Primer Ticket',
      selectAutomation: 'Seleccionar Automatización',
      selectAutomationPlaceholder: 'Selecciona una automatización',
      title: 'Título',
      titlePlaceholder: 'Breve descripción de tu problema',
      description: 'Descripción',
      descriptionPlaceholder: 'Por favor proporciona detalles sobre tu problema',
      cancel: 'Cancelar',
      submit: 'Enviar Ticket',
      submitting: 'Enviando...',
      createSuccess: 'Ticket de soporte creado exitosamente',
      createError: 'Error al crear el ticket de soporte',
      loadError: 'Error al cargar tus tickets de soporte',
      noActiveAutomations: 'Sin Automatizaciones Activas',
      noActiveAutomationsDesc: 'Necesitas una automatización activa para crear un ticket de soporte.',
      browseMarketplace: 'Explorar Mercado',
      backToSupport: 'Volver al Soporte',
      ticketNotFound: 'Ticket no encontrado o no tienes permisos para verlo.',
      backToPortal: 'Volver al Portal del Cliente',
      ticketIdRequired: 'Se requiere ID del ticket.',
      typeResponse: 'Escribe tu respuesta aquí...',
      sendResponse: 'Enviar Respuesta',
      responseSuccess: 'Respuesta enviada exitosamente',
      responseError: 'Error al enviar la respuesta',
      conversation: 'Conversación',
      noResponses: 'Aún no hay respuestas',
      supportTeam: 'Equipo de Soporte',
      client: 'Cliente',
      automationLabel: 'Automatización:',
      createdLabel: 'Creado:',
      status: 'Estado',
      open: 'Abierto',
      inProgress: 'En Progreso',
      resolved: 'Resuelto',
      closed: 'Cerrado',
      priority: 'Prioridad',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    },
    automationDetails: {
      loadingDetails: 'Cargando detalles de la automatización...',
      notFound: 'Automatización No Encontrada',
      notFoundDesc: 'La automatización que buscas no existe o no tienes acceso a ella.',
      backToPortal: 'Volver al Portal',
      purchaseDate: 'Fecha de Compra',
      nextBilling: 'Próxima Facturación',
      status: 'Estado',
      setup: 'Configuración',
      setupInProgress: 'Configuración en Progreso',
      setupInProgressDesc: 'Nuestro equipo está configurando tu automatización. Recibirás una notificación cuando esté lista para usar.',
      noIntegrationsAvailable: 'No Hay Integraciones Disponibles',
      noIntegrationsDesc: 'Esta automatización aún no tiene integraciones activas configuradas.',
      webhooks: 'Webhooks',
      customPrompts: 'Prompts Personalizados',
      forms: 'Formularios',
      tables: 'Tablas',
      createTicket: 'Crear Ticket',
      overview: 'Resumen',
      integrations: 'Integraciones',
      documentation: 'Documentación',
      support: 'Soporte',
      settings: 'Configuración',
      webhook: 'Webhook',
      customPrompt: 'Prompt Personalizado',
      form: 'Formulario',
      table: 'Tabla',
      active: 'Activo',
      inactive: 'Inactivo',
      configure: 'Configurar',
      test: 'Probar',
      save: 'Guardar',
      copy: '¡Copiado!',
      copied: '¡Copiado!',
      url: 'URL',
      method: 'Método',
      headers: 'Encabezados',
      payload: 'Carga',
      response: 'Respuesta',
      logs: 'Registros',
      analytics: 'Analíticas',
      requests: 'Solicitudes',
      errors: 'Errores',
      successRate: 'Tasa de Éxito',
      averageResponse: 'Tiempo de Respuesta Promedio',
      lastRequest: 'Última Solicitud',
      totalRequests: 'Total de Solicitudes',
      edit: 'Editar',
      delete: 'Eliminar',
      add: 'Agregar',
      update: 'Actualizar',
      loading: 'Cargando...',
      noData: 'No hay datos disponibles',
      refresh: 'Actualizar'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      solutions: 'Solutions',
      blog: 'Blog',
      contact: 'Contact',
      logout: 'Se Déconnecter',
      login: 'Se Connecter'
    },
    home: {
      hero: {
        getStarted: 'Commencer',
        learnMore: 'En Savoir Plus',
        tagline: '🚀 Solutions Automatisées pour Entreprises',
        title: 'Transformez Votre Entreprise avec l\'Automatisation IA',
        description: 'aide les entreprises à automatiser les tâches répétitives, améliorer l\'efficacité et faire évoluer les opérations avec une technologie IA de pointe. Des chatbots à l\'analyse de données, nous vous couvrons.'
      }
    },
    solutions: {
      title: 'Nos Solutions',
      subtitle: 'Solutions Complètes d\'Automatisation IA',
      description: 'Découvrez comment nos solutions d\'automatisation alimentées par l\'IA peuvent transformer les opérations de votre entreprise et augmenter la productivité.',
      sectionTag: 'Nos Solutions',
      sectionTitle: 'Automatisez Votre Entreprise avec l\'IA',
      sectionDescription: 'Découvrez notre suite complète de solutions d\'automatisation alimentées par l\'IA conçues pour rationaliser vos opérations et augmenter la productivité.',
      viewAllButton: 'Voir Toutes les Solutions',
      cta: {
        title: 'Prêt à Transformer Votre Entreprise?',
        subtitle: 'Commencez avec nos solutions d\'automatisation IA aujourd\'hui',
        button: 'Commencer',
        contact: 'Contactez-Nous'
      },
      futureproof: {
        title: 'Préparez Votre Entreprise pour l\'Avenir',
        description: 'Gardez une longueur d\'avance sur la concurrence avec des technologies d\'automatisation IA de pointe qui s\'adaptent aux besoins croissants de votre entreprise.',
        features: ['Solutions Évolutives', 'IA Avancée', 'Intégration Personnalisée', 'Support 24/7']
      },
      chatbots: {
        title: 'Chatbots IA',
        description: 'Chatbots intelligents qui fournissent un support client 24/7 et la génération de leads',
        feature1: 'Support Client 24/7',
        feature2: 'Génération de Leads',
        feature3: 'Support Multilingue'
      },
      leadGeneration: {
        title: 'Génération de Leads',
        description: 'Systèmes automatisés pour capturer, qualifier et nourrir les leads pour votre entreprise',
        feature1: 'Formulaires de Capture',
        feature2: 'Suivi Automatisé',
        feature3: 'Intégration CRM'
      },
      socialMedia: {
        title: 'Automatisation des Médias Sociaux',
        description: 'Rationalisez votre présence sur les médias sociaux avec publication et engagement automatisés',
        feature1: 'Publication Automatisée',
        feature2: 'Planification de Contenu',
        feature3: 'Suivi d\'Engagement'
      },
      aiAgents: {
        title: 'Agents IA',
        description: 'Agents IA personnalisés qui gèrent les processus métier complexes et la prise de décision',
        feature1: 'Automatisation de Processus',
        feature2: 'Analyse de Données',
        feature3: 'Flux de Travail Personnalisés'
      }
    },
    blog: {
      title: "Blog",
      subtitle: "Découvrez les insights, tendances et innovations en automatisation et IA",
      description: "Restez à jour avec les derniers articles sur l'automatisation, l'intelligence artificielle et la transformation digitale. Apprenez comment la technologie peut révolutionner votre entreprise.",
      featured: "Articles en Vedette",
      all: "Tous les Articles",
      readMore: "Lire Plus",
      relatedPosts: "Articles Connexes",
      newsletter: {
        title: 'Restez Informé',
        subtitle: 'Abonnez-vous à notre newsletter pour les dernières perspectives d\'automatisation IA',
        placeholder: 'Entrez votre email',
        button: 'S\'abonner',
        success: 'Abonnement réussi!',
        error: 'Échec de l\'abonnement. Veuillez réessayer.'
      },
      categories: 'Catégories',
      allPosts: 'Tous les Articles'
    },
    footer: {
      company: 'Entreprise',
      about: 'À Propos',
      blog: 'Blog',
      contact: 'Contact',
      resources: 'Ressources',
      solutions: 'Solutions',
      description: 'Transformez votre entreprise avec des solutions d\'automatisation IA de pointe. Des chatbots à l\'analyse de données, nous vous aidons à automatiser les tâches répétitives et à faire évoluer vos opérations efficacement.',
      copyright: '© 2024 Automatízalo. Tous droits réservés.',
      privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions de Service'
    },
    clientPortal: {
      title: 'Portail Client',
      subtitle: 'Gérez vos automatisations et tickets de support',
      myAutomations: 'Mes Automatisations',
      marketplace: 'Marché',
      support: 'Support',
      myAutomationsTitle: 'Automatisations Actives',
      myAutomationsDesc: 'Voici un aperçu de vos automatisations actives.',
      ready: 'Prêt',
      total: 'Total',
      purchaseDate: 'Date d\'Achat',
      nextBilling: 'Prochaine Facturation',
      monthlyPrice: 'Prix Mensuel',
      status: 'Statut',
      active: 'Actif',
      cancel: 'Annuler l\'Abonnement',
      cancelSuccess: 'Abonnement annulé avec succès.',
      cancelError: 'Échec de l\'annulation de l\'abonnement.',
      setupPending: 'Configuration en Attente',
      setupInProgress: 'Configuration en Cours',
      readyToUse: 'Prêt à l\'emploi',
      webhook: 'Webhook',
      customPrompt: 'Prompt Personnalisé',
      form: 'Formulaire',
      table: 'Tableau',
      noActiveAutomations: 'Aucune Automatisation Active',
      noActiveAutomationsDesc: 'Explorez le marché pour trouver l\'automatisation parfaite pour vos besoins.',
      browseMarketplace: 'Parcourir le Marché',
      settingUp: 'Configuration',
      manage: 'Gérer',
      viewDetails: 'Voir les Détails',
      configure: 'Configurer',
      getSupport: 'Obtenir de l\'Aide',
      description: 'Description',
      features: 'Fonctionnalités',
      instructions: 'Instructions',
      setupInstructions: 'Instructions de Configuration',
      usageInstructions: 'Instructions d\'Utilisation',
      troubleshooting: 'Dépannage',
      integrationSettings: 'Paramètres d\'Intégration',
      webhookUrl: 'URL du Webhook',
      customPrompts: 'Prompts Personnalisés',
      formIntegration: 'Intégration de Formulaire',
      tableData: 'Données de Tableau',
      analytics: 'Analytiques',
      logs: 'Journaux',
      configuration: 'Configuration'
    },
    testimonials: {
      title: 'Témoignages',
      subtitle: 'Ce Que Disent Nos Clients',
      description: 'Écoutez les entreprises qui ont transformé leurs opérations avec nos solutions d\'automatisation IA.'
    },
    contact: {
      title: 'Contactez-Nous',
      subtitle: 'Entrer en Contact',
      description: 'Prêt à transformer votre entreprise ? Contactez-nous aujourd\'hui pour discuter de vos besoins d\'automatisation.',
      whatsapp: {
        title: 'Chattez avec Nous sur WhatsApp',
        cta: 'Commencez une conversation avec notre équipe et obtenez un support instantané.',
        chat: 'Commencer le Chat',
        defaultMessage: 'Bonjour ! Je suis intéressé à en savoir plus sur vos services d\'automatisation.'
      },
      chat: {
        greeting: 'Bonjour ! Comment puis-je vous aider avec l\'automatisation aujourd\'hui ?',
        askServices: 'Quels services d\'automatisation offrez-vous ?',
        explainServices: 'Nous offrons des chatbots IA, génération de leads, automatisation des médias sociaux et agents IA personnalisés. Aimeriez-vous planifier une consultation ?',
        askMeeting: 'Oui, j\'aimerais planifier une réunion.',
        confirmMeeting: 'Parfait ! Je peux planifier une consultation de 30 minutes pour demain à 14h. Cela vous convient-il ?',
        acceptTime: 'Cela sonne bien !',
        scheduledSuccess: 'Excellent ! Réunion planifiée pour demain à 14h. Vous recevrez une invitation de calendrier bientôt.',
        meetingScheduled: 'Réunion Planifiée avec Succès !',
        online: 'En ligne',
        you: 'Vous'
      }
    },
    login: {
      welcome: 'Bienvenue chez',
      clientWelcomeDesc: 'Portail Client - Accédez à vos automatisations',
      email: 'Email',
      password: 'Mot de passe',
      rememberPassword: 'Se souvenir du mot de passe',
      signIn: 'Se Connecter',
      loggingIn: 'Connexion...',
      loginError: 'Identifiants invalides'
    },
    marketplace: {
      noAutomations: 'Aucune Automatisation Disponible',
      noAutomationsDesc: 'Il n\'y a actuellement aucune automatisation disponible sur le marché.',
      setup: 'Configuration',
      monthly: 'Mensuel',
      features: 'Fonctionnalités',
      customPrompts: 'Prompts personnalisés',
      webhooks: 'Webhooks',
      forms: 'Formulaires',
      tables: 'Tableaux',
      purchase: 'Acheter',
      viewDetails: 'Voir les Détails',
      alreadyOwned: 'Vous possédez déjà cette automatisation',
      loginToPurchase: 'Veuillez vous connecter pour acheter des automatisations',
      purchaseSuccess: 'Automatisation achetée avec succès ! Notre équipe la configurera bientôt.',
      purchaseError: 'Échec de l\'achat de l\'automatisation',
      loading: 'Chargement des automatisations...',
      price: 'Prix',
      oneTimeSetup: 'Configuration unique',
      description: 'Description',
      included: 'Fonctionnalités incluses'
    },
    support: {
      tickets: 'Tickets de Support',
      createNewTicket: 'Créer un Nouveau Ticket',
      noTickets: 'Aucun ticket de support créé.',
      createFirstTicket: 'Créer Votre Premier Ticket',
      selectAutomation: 'Sélectionner une Automatisation',
      selectAutomationPlaceholder: 'Sélectionner une automatisation',
      title: 'Titre',
      titlePlaceholder: 'Brève description de votre problème',
      description: 'Description',
      descriptionPlaceholder: 'Veuillez fournir des détails sur votre problème',
      cancel: 'Annuler',
      submit: 'Soumettre le Ticket',
      submitting: 'Soumission...',
      createSuccess: 'Ticket de support créé avec succès',
      createError: 'Échec de la création du ticket de support',
      loadError: 'Échec du chargement de vos tickets de support',
      noActiveAutomations: 'Aucune Automatisation Active',
      noActiveAutomationsDesc: 'Vous avez besoin d\'une automatisation active pour créer un ticket de support.',
      browseMarketplace: 'Parcourir le Marché',
      backToSupport: 'Retour au Support',
      ticketNotFound: 'Ticket introuvable ou vous n\'avez pas la permission de le voir.',
      backToPortal: 'Retour au Portail Client',
      ticketIdRequired: 'ID du ticket requis.',
      typeResponse: 'Tapez votre réponse ici...',
      sendResponse: 'Envoyer la Réponse',
      responseSuccess: 'Réponse soumise avec succès',
      responseError: 'Échec de l\'envoi de la réponse',
      conversation: 'Conversation',
      noResponses: 'Aucune réponse encore',
      supportTeam: 'Équipe de Support',
      client: 'Client',
      automationLabel: 'Automatisation:',
      createdLabel: 'Créé:',
      status: 'Statut',
      open: 'Ouvert',
      inProgress: 'En Cours',
      resolved: 'Résolu',
      closed: 'Fermé',
      priority: 'Priorité',
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse'
    },
    automationDetails: {
      loadingDetails: 'Chargement des détails de l\'automatisation...',
      notFound: 'Automatisation Non Trouvée',
      notFoundDesc: 'L\'automatisation que vous recherchez n\'existe pas ou vous n\'y avez pas accès.',
      backToPortal: 'Retour au Portail',
      purchaseDate: 'Date d\'Achat',
      nextBilling: 'Prochaine Facturation',
      status: 'Statut',
      setup: 'Configuration',
      setupInProgress: 'Configuration en Cours',
      setupInProgressDesc: 'Notre équipe configure actuellement votre automatisation. Vous recevrez une notification quand elle sera prête.',
      noIntegrationsAvailable: 'Aucune Intégration Disponible',
      noIntegrationsDesc: 'Cette automatisation n\'a pas encore d\'intégrations actives configurées.',
      webhooks: 'Webhooks',
      customPrompts: 'Prompts Personnalisés',
      forms: 'Formulaires',
      tables: 'Tableaux',
      createTicket: 'Créer un Ticket',
      overview: 'Aperçu',
      integrations: 'Intégrations',
      documentation: 'Documentation',
      support: 'Support',
      settings: 'Paramètres',
      webhook: 'Webhook',
      customPrompt: 'Prompt Personnalisé',
      form: 'Formulaire',
      table: 'Tableau',
      active: 'Actif',
      inactive: 'Inactif',
      configure: 'Configurer',
      test: 'Tester',
      save: 'Sauvegarder',
      copy: 'Copier',
      copied: 'Copié!',
      url: 'URL',
      method: 'Méthode',
      headers: 'En-têtes',
      payload: 'Charge utile',
      response: 'Réponse',
      logs: 'Journaux',
      analytics: 'Analytiques',
      requests: 'Solicitudes',
      errors: 'Erreurs',
      successRate: 'Taux de Réussite',
      averageResponse: 'Temps de Réponse Moyen',
      lastRequest: 'Dernière Requête',
      totalRequests: 'Total des Requêtes',
      edit: 'Éditer',
      delete: 'Supprimer',
      add: 'Ajouter',
      update: 'Mettre à jour',
      loading: 'Chargement...',
      noData: 'Aucune donnée disponible',
      refresh: 'Actualiser'
    }
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string, options: Record<string, any> = {}) => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      return key;
    }

    let translated = value;
    for (const optionKey in options) {
      translated = translated.replace(`{{${optionKey}}}`, options[optionKey]);
    }
    return translated;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
