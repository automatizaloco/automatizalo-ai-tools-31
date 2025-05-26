import { Brain, Bot, Zap, Sparkles, BarChart, Clock, Shield, Users, MessageSquare, FileText, Cog, Database } from "lucide-react";
import SolutionCard from "@/components/ui/SolutionCard";
import ProductFeature from "@/components/solutions/ProductFeature";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";
import { Link } from 'react-router-dom';
import { useContactInfo } from "@/stores/contactInfoStore";
import { useEffect, useState } from "react";
import { getPageContent } from "@/services/pageContentService";

const Solutions = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { contactInfo, fetchContactInfo } = useContactInfo();
  const [leadGenSubtitle, setLeadGenSubtitle] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("Solutions page: Fetching contact info");
    fetchContactInfo();
    
    // Load custom lead generation subtitle
    const loadLeadGenSubtitle = async () => {
      try {
        const content = await getPageContent('solutions', 'leadGeneration.subtitle', language);
        if (content) {
          setLeadGenSubtitle(content);
        }
      } catch (error) {
        console.error('Error loading lead generation subtitle:', error);
      }
    };
    
    loadLeadGenSubtitle();
  }, [fetchContactInfo, language]);

  // Add lead generation as the fourth solution card
  const solutionCards = [{
    title: t("solutions.chatbots.title"),
    description: t("solutions.chatbots.description"),
    icon: <Zap className="h-5 w-5" />,
    features: [t("solutions.chatbots.feature1"), t("solutions.chatbots.feature2"), t("solutions.chatbots.feature3"), t("solutions.leadGeneration.feature2")],
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }, {
    title: t("solutions.socialMedia.title"),
    description: t("solutions.socialMedia.description"),
    icon: <MessageSquare className="h-5 w-5" />,
    features: [t("solutions.socialMedia.feature1"), t("solutions.socialMedia.feature2"), t("solutions.socialMedia.feature3"), t("solutions.aiAgents.feature3")],
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }, {
    title: t("solutions.aiAgents.title"),
    description: t("solutions.aiAgents.description"),
    icon: <Database className="h-5 w-5" />,
    features: [t("solutions.aiAgents.feature1"), t("solutions.aiAgents.feature2"), t("solutions.aiAgents.feature3"), t("solutions.leadGeneration.feature1")],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }, {
    title: t("solutions.leadGeneration.title"),
    description: t("solutions.leadGeneration.description"),
    icon: <Users className="h-5 w-5" />,
    features: [t("solutions.leadGeneration.feature1"), t("solutions.leadGeneration.feature2"), t("solutions.leadGeneration.feature3"), t("solutions.leadGeneration.feature4")],
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }];

  // Keep existing aiWorkflowFeatures and conversationalAIFeatures arrays
  const aiWorkflowFeatures = [{
    icon: <Bot className="h-5 w-5 text-gray-700" />,
    title: t("solutions.chatbots.feature1"),
    description: t("solutions.chatbots.description")
  }, {
    icon: <Cog className="h-5 w-5 text-gray-700" />,
    title: t("solutions.leadGeneration.feature1"),
    description: t("solutions.leadGeneration.description")
  }, {
    icon: <FileText className="h-5 w-5 text-gray-700" />,
    title: t("solutions.socialMedia.feature1"),
    description: t("solutions.socialMedia.description")
  }, {
    icon: <Zap className="h-5 w-5 text-gray-700" />,
    title: t("solutions.aiAgents.feature1"),
    description: t("solutions.aiAgents.description")
  }];
  
  const conversationalAIFeatures = [{
    icon: <MessageSquare className="h-5 w-5 text-gray-700" />,
    title: t("solutions.chatbots.feature2"),
    description: t("solutions.chatbots.description")
  }, {
    icon: <Brain className="h-5 w-5 text-gray-700" />,
    title: t("solutions.leadGeneration.feature2"),
    description: t("solutions.leadGeneration.description")
  }, {
    icon: <Sparkles className="h-5 w-5 text-gray-700" />,
    title: t("solutions.socialMedia.feature2"),
    description: t("solutions.socialMedia.description")
  }, {
    icon: <Users className="h-5 w-5 text-gray-700" />,
    title: t("solutions.aiAgents.feature2"),
    description: t("solutions.aiAgents.description")
  }];
  
  // Add new section for lead generation features
  const dataIntelligenceFeatures = [{
    icon: <Database className="h-5 w-5 text-gray-700" />,
    title: t("solutions.chatbots.feature3"),
    description: t("solutions.chatbots.description")
  }, {
    icon: <BarChart className="h-5 w-5 text-gray-700" />,
    title: t("solutions.leadGeneration.feature3"),
    description: t("solutions.leadGeneration.description")
  }, {
    icon: <Clock className="h-5 w-5 text-gray-700" />,
    title: t("solutions.socialMedia.feature3"),
    description: t("solutions.socialMedia.description")
  }, {
    icon: <Shield className="h-5 w-5 text-gray-700" />,
    title: t("solutions.aiAgents.feature3"),
    description: t("solutions.aiAgents.description")
  }];

  // Handle opening WhatsApp when the button is clicked
  const handleWhatsAppClick = () => {
    // Use the contactInfo.whatsapp or fall back to a default number
    const whatsappNumber = contactInfo?.whatsapp || "+57 3192963363";
    // Remove any non-digit characters from the phone number
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    // Create default message
    const defaultMessage = t('contact.whatsapp.defaultMessage');
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    // Open WhatsApp with the specified number and message
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  // Create section specifically for lead generation
  const leadGenerationSection = (
    <div className="mb-24 scroll-mt-24" id="lead-generation">
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            {isAuthenticated ? 
              <EditableText 
                id="solutions-leadgeneration-title" 
                defaultText={t("solutions.leadGeneration.title")} 
                pageName="solutions" 
                sectionName="leadGeneration.title"
              /> : 
              t("solutions.leadGeneration.title")
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {isAuthenticated ? 
              <EditableText 
                id="solutions-leadgeneration-description" 
                defaultText={t("solutions.leadGeneration.description")} 
                pageName="solutions" 
                sectionName="leadGeneration.description"
                multiline
              /> : 
              t("solutions.leadGeneration.description")
            }
          </p>
          <p className="text-gray-600">
            {isAuthenticated ? 
              <EditableText 
                id="solutions-leadgeneration-subtitle" 
                defaultText={leadGenSubtitle || t("solutions.leadGeneration.subtitle")} 
                pageName="solutions" 
                sectionName="leadGeneration.subtitle"
                multiline
              /> : 
              leadGenSubtitle || t("solutions.leadGeneration.subtitle")
            }
          </p>
        </div>
        <div className="lg:w-1/2">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt={t("solutions.leadGeneration.title")} className="rounded-xl shadow-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: <Users className="h-5 w-5 text-gray-700" />,
            title: t("solutions.leadGeneration.feature1"),
            description: t("solutions.leadGeneration.description"),
            sectionName: "leadGeneration.feature1"
          },
          {
            icon: <MessageSquare className="h-5 w-5 text-gray-700" />,
            title: t("solutions.leadGeneration.feature2"),
            description: t("solutions.leadGeneration.description"),
            sectionName: "leadGeneration.feature2"
          },
          {
            icon: <Clock className="h-5 w-5 text-gray-700" />,
            title: t("solutions.leadGeneration.feature3"),
            description: t("solutions.leadGeneration.description"),
            sectionName: "leadGeneration.feature3"
          },
          {
            icon: <BarChart className="h-5 w-5 text-gray-700" />,
            title: t("solutions.leadGeneration.feature4"),
            description: t("solutions.leadGeneration.description"),
            sectionName: "leadGeneration.feature4"
          }
        ].map((feature, index) => 
          <ProductFeature 
            key={index} 
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
            index={index} 
            isEditable={isAuthenticated}
            pageName="solutions"
            sectionName={feature.sectionName}
          />
        )}
      </div>
    </div>
  );

  return <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              {isAuthenticated ? 
                <EditableText 
                  id="solutions-title" 
                  defaultText={t("solutions.title")} 
                  pageName="solutions" 
                  sectionName="title"
                /> : 
                t("solutions.title")
              }
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
              {isAuthenticated ? 
                <EditableText 
                  id="solutions-subtitle" 
                  defaultText={t("solutions.subtitle")} 
                  pageName="solutions" 
                  sectionName="subtitle"
                  multiline
                /> : 
                t("solutions.subtitle")
              }
            </p>
          </div>
          
          <div className="mb-24">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
              {isAuthenticated ? 
                <EditableText 
                  id="solutions-section-title" 
                  defaultText={t("solutions.sectionTitle")} 
                  pageName="solutions" 
                  sectionName="sectionTitle"
                /> : 
                t("solutions.sectionTitle")
              }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {solutionCards.map((solution, index) => <SolutionCard key={index} title={solution.title} description={solution.description} icon={solution.icon} features={solution.features} imageUrl={solution.imageUrl} delay={index * 100} index={index} isEditable={isAuthenticated} />)}
            </div>
          </div>
          
          <div className="mb-24 scroll-mt-24" id="ai-workflow">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-chatbots-title" 
                      defaultText={t("solutions.chatbots.title")} 
                      pageName="solutions" 
                      sectionName="chatbots.title"
                    /> : 
                    t("solutions.chatbots.title")
                  }
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-chatbots-description" 
                      defaultText={t("solutions.chatbots.description")} 
                      pageName="solutions" 
                      sectionName="chatbots.description"
                    /> : 
                    t("solutions.chatbots.description")
                  }
                </p>
                <p className="text-gray-600">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-futureproof-description" 
                      defaultText={t("solutions.futureproof.description")} 
                      pageName="solutions" 
                      sectionName="futureproof.description"
                    /> : 
                    t("solutions.futureproof.description")
                  }
                </p>
              </div>
              <div className="lg:w-1/2">
                <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt={t("solutions.chatbots.title")} className="rounded-xl shadow-lg" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiWorkflowFeatures.map((feature, index) => <ProductFeature key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} isEditable={isAuthenticated} />)}
            </div>
          </div>
          
          <div className="mb-24 scroll-mt-24" id="conversational-ai">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-socialmedia-title" 
                      defaultText={t("solutions.socialMedia.title")} 
                      pageName="solutions" 
                      sectionName="socialMedia.title"
                    /> : 
                    t("solutions.socialMedia.title")
                  }
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-socialmedia-description" 
                      defaultText={t("solutions.socialMedia.description")} 
                      pageName="solutions" 
                      sectionName="socialMedia.description"
                    /> : 
                    t("solutions.socialMedia.description")
                  }
                </p>
                <p className="text-gray-600">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-futureproof-subtitle" 
                      defaultText={t("solutions.futureproof.subtitle")} 
                      pageName="solutions" 
                      sectionName="futureproof.subtitle"
                    /> : 
                    t("solutions.futureproof.subtitle")
                  }
                </p>
              </div>
              <div className="lg:w-1/2">
                <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt={t("solutions.socialMedia.title")} className="rounded-xl shadow-lg" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conversationalAIFeatures.map((feature, index) => <ProductFeature key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} isEditable={isAuthenticated} />)}
            </div>
          </div>
          
          <div className="mb-24 scroll-mt-24" id="data-intelligence">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-aiagents-title" 
                      defaultText={t("solutions.aiAgents.title")} 
                      pageName="solutions" 
                      sectionName="aiAgents.title"
                    /> : 
                    t("solutions.aiAgents.title")
                  }
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-aiagents-description" 
                      defaultText={t("solutions.aiAgents.description")} 
                      pageName="solutions" 
                      sectionName="aiAgents.description"
                    /> : 
                    t("solutions.aiAgents.description")
                  }
                </p>
                <p className="text-gray-600">
                  {isAuthenticated ? 
                    <EditableText 
                      id="solutions-futureproof-title" 
                      defaultText={t("solutions.futureproof.title")} 
                      pageName="solutions" 
                      sectionName="futureproof.title"
                    /> : 
                    t("solutions.futureproof.title")
                  }
                </p>
              </div>
              <div className="lg:w-1/2">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt={t("solutions.aiAgents.title")} className="rounded-xl shadow-lg" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataIntelligenceFeatures.map((feature, index) => <ProductFeature key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} isEditable={isAuthenticated} />)}
            </div>
          </div>
          
          {/* Add new lead generation section */}
          {leadGenerationSection}
          
          <div className="bg-gray-50 rounded-2xl p-10 lg:p-16 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {isAuthenticated ? 
                <EditableText 
                  id="solutions-cta-title" 
                  defaultText={t("solutions.cta.title")} 
                  pageName="solutions" 
                  sectionName="cta.title"
                /> : 
                t("solutions.cta.title")
              }
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {isAuthenticated ? 
                <EditableText 
                  id="solutions-cta-subtitle" 
                  defaultText={t("solutions.cta.subtitle")} 
                  pageName="solutions" 
                  sectionName="cta.subtitle"
                  multiline
                /> : 
                t("solutions.cta.subtitle")
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gray-900 hover:bg-gray-800 py-6 px-8 rounded-xl text-base"
                onClick={handleWhatsAppClick}
              >
                {isAuthenticated ? 
                  <EditableText 
                    id="solutions-cta-button" 
                    defaultText={t("solutions.cta.button")} 
                    pageName="solutions" 
                    sectionName="cta.button"
                  /> : 
                  t("solutions.cta.button")
                }
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Solutions;
