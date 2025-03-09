
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const { t, language } = useLanguage();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Animation sequence timer - increased visibility time
    const animationInterval = setInterval(() => {
      setAnimationStep(prev => (prev >= 4 ? 0 : prev + 1));
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(animationInterval);
    };
  }, []);

  // Animation steps for the process automation - localized
  const getAutomationSteps = () => [
    { 
      title: language === 'en' ? "Step 1: Voice Command" : 
             language === 'fr' ? "Étape 1: Commande Vocale" : 
             "Paso 1: Comando de Voz", 
      content: language === 'en' ? "User speaks prompt: 'Create a post about our new product launch'" :
               language === 'fr' ? "L'utilisateur parle: 'Créer un post sur le lancement de notre nouveau produit'" : 
               "El usuario habla: 'Crear una publicación sobre el lanzamiento de nuestro nuevo producto'"
    },
    { 
      title: language === 'en' ? "Step 2: AI Processing" : 
             language === 'fr' ? "Étape 2: Traitement IA" : 
             "Paso 2: Procesamiento de IA", 
      content: language === 'en' ? "AI analyzes request and generates optimized content for multiple platforms" :
               language === 'fr' ? "L'IA analyse la demande et génère du contenu optimisé pour plusieurs plateformes" :
               "La IA analiza la solicitud y genera contenido optimizado para múltiples plataformas"
    },
    { 
      title: language === 'en' ? "Step 3: Content Creation" : 
             language === 'fr' ? "Étape 3: Création de Contenu" : 
             "Paso 3: Creación de Contenido", 
      content: language === 'en' ? "Generates tailored content for Instagram, Twitter, LinkedIn and Facebook" :
               language === 'fr' ? "Génère du contenu personnalisé pour Instagram, Twitter, LinkedIn et Facebook" :
               "Genera contenido personalizado para Instagram, Twitter, LinkedIn y Facebook"
    },
    { 
      title: language === 'en' ? "Step 4: Preview & Approval" : 
             language === 'fr' ? "Étape 4: Aperçu et Approbation" : 
             "Paso 4: Vista Previa y Aprobación", 
      content: language === 'en' ? "User reviews and approves with a single click" :
               language === 'fr' ? "L'utilisateur révise et approuve en un seul clic" :
               "El usuario revisa y aprueba con un solo clic"
    },
    { 
      title: language === 'en' ? "Step 5: Multi-Platform Publishing" : 
             language === 'fr' ? "Étape 5: Publication Multi-Plateforme" : 
             "Paso 5: Publicación en Múltiples Plataformas", 
      content: language === 'en' ? "Content automatically published across all social networks" :
               language === 'fr' ? "Contenu automatiquement publié sur tous les réseaux sociaux" :
               "Contenido publicado automáticamente en todas las redes sociales"
    }
  ];

  // Animation steps for the AI assistant - localized
  const getAssistantSteps = () => [
    { 
      title: language === 'en' ? "Email Management" : 
             language === 'fr' ? "Gestion des Emails" : 
             "Gestión de Correos", 
      content: language === 'en' ? "AI reads and categorizes emails, drafting responses for review" :
               language === 'fr' ? "L'IA lit et catégorise les emails, rédigeant des réponses pour révision" :
               "La IA lee y categoriza correos, redactando respuestas para revisión"
    },
    { 
      title: language === 'en' ? "Meeting Scheduling" : 
             language === 'fr' ? "Planification de Réunions" : 
             "Programación de Reuniones", 
      content: language === 'en' ? "AI coordinates calendars and arranges meetings based on availability" :
               language === 'fr' ? "L'IA coordonne les calendriers et organise des réunions selon la disponibilité" :
               "La IA coordina calendarios y organiza reuniones según disponibilidad"
    },
    { 
      title: language === 'en' ? "Task Automation" : 
             language === 'fr' ? "Automatisation des Tâches" : 
             "Automatización de Tareas", 
      content: language === 'en' ? "AI handles follow-ups and sends reminders for pending tasks" :
               language === 'fr' ? "L'IA gère les suivis et envoie des rappels pour les tâches en attente" :
               "La IA maneja seguimientos y envía recordatorios para tareas pendientes"
    },
    { 
      title: language === 'en' ? "Research Assistant" : 
             language === 'fr' ? "Assistant de Recherche" : 
             "Asistente de Investigación", 
      content: language === 'en' ? "AI conducts research and prepares summaries on any topic" :
               language === 'fr' ? "L'IA mène des recherches et prépare des résumés sur n'importe quel sujet" :
               "La IA realiza investigaciones y prepara resúmenes sobre cualquier tema"
    },
    { 
      title: language === 'en' ? "Document Creation" : 
             language === 'fr' ? "Création de Documents" : 
             "Creación de Documentos", 
      content: language === 'en' ? "AI creates reports, presentations and documents based on instructions" :
               language === 'fr' ? "L'IA crée des rapports, des présentations et des documents selon les instructions" :
               "La IA crea informes, presentaciones y documentos basados en instrucciones"
    }
  ];

  const automationSteps = getAutomationSteps();
  const assistantSteps = getAssistantSteps();

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-100 to-white"></div>
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className={`max-w-xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block py-1 px-3 mb-4 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              {t('home.hero.tagline')}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              {t('home.hero.title')}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              <span className="font-semibold">Automatízalo</span> {t('home.hero.description')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-gray-900 hover:bg-gray-800 px-6 text-base transition-all duration-300 rounded-xl h-12" 
                size="lg"
              >
                {t('home.hero.getStarted')}
                <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <a href="#about-section">
                <Button 
                  variant="outline" 
                  className="border-gray-300 text-gray-800 hover:bg-gray-100 px-6 text-base transition-all duration-300 rounded-xl h-12" 
                  size="lg"
                >
                  {t('home.hero.learnMore')}
                </Button>
              </a>
            </div>
          </div>
          
          <div className={`relative w-full max-w-md transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main Computer Image */}
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800" 
                alt="Person using computer" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Animation Card 1: Process Automation */}
            <div className="absolute -bottom-12 -right-8 bg-white rounded-2xl shadow-xl overflow-hidden p-1 border border-gray-200 w-[280px] z-10">
              <div className="p-4 rounded-xl bg-gray-50">
                <h3 className="text-md font-semibold mb-3 text-gray-900">
                  {language === 'en' ? 'Automation Process' : 
                   language === 'fr' ? 'Processus d\'Automatisation' : 
                   'Proceso de Automatización'}
                </h3>
                
                <div className="bg-white rounded-xl p-3 border border-gray-200 min-h-[120px] relative">
                  {automationSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`absolute inset-0 p-3 transition-all duration-500 flex flex-col ${
                        animationStep === index 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8 pointer-events-none'
                      }`}
                    >
                      <h4 className="font-medium text-sm text-gray-900">{step.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{step.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-3">
                  {automationSteps.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        animationStep === index ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Animation Card 2: AI Assistant */}
            <div className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-200 w-64 z-20">
              <h3 className="text-md font-semibold mb-2 text-gray-900">
                {language === 'en' ? 'Personal AI Assistant' : 
                 language === 'fr' ? 'Assistant IA Personnel' : 
                 'Asistente Personal de IA'}
              </h3>
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{assistantSteps[animationStep % assistantSteps.length].title}</p>
                  <p className="text-xs text-gray-600">{assistantSteps[animationStep % assistantSteps.length].content}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-16 -left-6 bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-200 z-20">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {language === 'en' ? 'Save 30+ hours' : 
                     language === 'fr' ? 'Économisez 30+ heures' : 
                     'Ahorra 30+ horas'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'en' ? 'per week with automation' : 
                     language === 'fr' ? 'par semaine avec l\'automatisation' : 
                     'por semana con automatización'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
