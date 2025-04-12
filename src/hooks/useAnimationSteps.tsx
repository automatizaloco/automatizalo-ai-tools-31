
import { useLanguage } from '@/context/LanguageContext';

interface AnimationStep {
  title: string;
  content: string;
}

export const useAnimationSteps = () => {
  const { language } = useLanguage();

  const getAutomationSteps = (lang: string = language): AnimationStep[] => [
    { 
      title: lang === 'en' ? "Step 1: Voice Command" : 
             lang === 'fr' ? "Étape 1: Commande Vocale" : 
             "Paso 1: Comando de Voz", 
      content: lang === 'en' ? "User speaks prompt: 'Create a post about our new product launch'" :
               lang === 'fr' ? "L'utilisateur parle: 'Créer un post sur le lancement de notre nouveau produit'" : 
               "El usuario habla: 'Crear una publicación sobre el lanzamiento de nuestro nuevo producto'"
    },
    { 
      title: lang === 'en' ? "Step 2: AI Processing" : 
             lang === 'fr' ? "Étape 2: Traitement IA" : 
             "Paso 2: Procesamiento de IA", 
      content: lang === 'en' ? "AI analyzes request and generates optimized content for multiple platforms" :
               lang === 'fr' ? "L'IA analyse la demande et génère du contenu optimisé pour plusieurs plateformes" :
               "La IA analiza la solicitud y genera contenido optimizado para múltiples plataformas"
    },
    { 
      title: lang === 'en' ? "Step 3: Content Creation" : 
             lang === 'fr' ? "Étape 3: Création de Contenu" : 
             "Paso 3: Creación de Contenido", 
      content: lang === 'en' ? "Generates tailored content for Instagram, Twitter, LinkedIn and Facebook" :
               lang === 'fr' ? "Génère du contenu personnalisé pour Instagram, Twitter, LinkedIn et Facebook" :
               "Genera contenido personalizado para Instagram, Twitter, LinkedIn y Facebook"
    },
    { 
      title: lang === 'en' ? "Step 4: Preview & Approval" : 
             lang === 'fr' ? "Étape 4: Aperçu et Approbation" : 
             "Paso 4: Vista Previa y Aprobación", 
      content: lang === 'en' ? "User reviews and approves with a single click" :
               lang === 'fr' ? "L'utilisateur révise et approuve en un seul clic" :
               "El usuario revisa y aprueba con un solo clic"
    },
    { 
      title: lang === 'en' ? "Step 5: Multi-Platform Publishing" : 
             lang === 'fr' ? "Étape 5: Publication Multi-Plateforme" : 
             "Paso 5: Publicación en Múltiples Plataformas", 
      content: lang === 'en' ? "Content automatically published across all social networks" :
               lang === 'fr' ? "Contenu automatiquement publié sur tous les réseaux sociaux" :
               "Contenido publicado automáticamente en todas las redes sociales"
    }
  ];

  // Animation steps for the AI assistant - localized
  const getAssistantSteps = (lang: string = language): AnimationStep[] => [
    { 
      title: lang === 'en' ? "Email Management" : 
             lang === 'fr' ? "Gestion des Emails" : 
             "Gestión de Correos", 
      content: lang === 'en' ? "AI reads and categorizes emails, drafting responses for review" :
               lang === 'fr' ? "L'IA lit et catégorise les emails, rédigeant des réponses pour révision" :
               "La IA lee y categoriza correos, redactando respuestas para revisión"
    },
    { 
      title: lang === 'en' ? "Meeting Scheduling" : 
             lang === 'fr' ? "Planification de Réunions" : 
             "Programación de Reuniones", 
      content: lang === 'en' ? "AI coordinates calendars and arranges meetings based on availability" :
               lang === 'fr' ? "L'IA coordonne les calendriers et organise des réunions selon la disponibilité" :
               "La IA coordina calendarios y organiza reuniones según disponibilidad"
    },
    { 
      title: lang === 'en' ? "Task Automation" : 
             lang === 'fr' ? "Automatisation des Tâches" : 
             "Automatización de Tareas", 
      content: lang === 'en' ? "AI handles follow-ups and sends reminders for pending tasks" :
               lang === 'fr' ? "L'IA gère les suivis et envoie des rappels pour les tâches en attente" :
               "La IA maneja seguimientos y envía recordatorios para tareas pendientes"
    },
    { 
      title: lang === 'en' ? "Research Assistant" : 
             lang === 'fr' ? "Assistant de Recherche" : 
             "Asistente de Investigación", 
      content: lang === 'en' ? "AI conducts research and prepares summaries on any topic" :
               lang === 'fr' ? "L'IA mène des recherches et prépare des résumés sur n'importe quel sujet" :
               "La IA realiza investigaciones y prepara resúmenes sobre cualquier tema"
    },
    { 
      title: lang === 'en' ? "Document Creation" : 
             lang === 'fr' ? "Création de Documents" : 
             "Creación de Documentos", 
      content: lang === 'en' ? "AI creates reports, presentations and documents based on instructions" :
               lang === 'fr' ? "L'IA crée des rapports, des présentations et des documents selon les instructions" :
               "La IA crea informes, presentaciones y documentos basados en instrucciones"
    }
  ];

  return {
    getAutomationSteps,
    getAssistantSteps
  };
};
