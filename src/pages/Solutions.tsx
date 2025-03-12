import { Brain, Bot, Zap, Sparkles, BarChart, Clock, Shield, Users, MessageSquare, FileText, Cog, Database } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SolutionCard from "@/components/ui/SolutionCard";
import ProductFeature from "@/components/solutions/ProductFeature";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";
import { Link } from 'react-router-dom';
import { useContactInfo } from "@/stores/contactInfoStore";

const Solutions = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { contactInfo } = useContactInfo();
  
  // Solution Cards Data
  const solutionCards = [
    {
      title: t("solutions.chatbots.title"),
      description: t("solutions.chatbots.description"),
      icon: <Zap className="h-5 w-5" />,
      features: [
        t("solutions.chatbots.feature1"),
        t("solutions.chatbots.feature2"),
        t("solutions.chatbots.feature3"),
        t("solutions.leadGeneration.feature2")
      ],
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: t("solutions.socialMedia.title"),
      description: t("solutions.socialMedia.description"),
      icon: <MessageSquare className="h-5 w-5" />,
      features: [
        t("solutions.socialMedia.feature1"),
        t("solutions.socialMedia.feature2"),
        t("solutions.socialMedia.feature3"),
        t("solutions.aiAgents.feature3")
      ],
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: t("solutions.aiAgents.title"),
      description: t("solutions.aiAgents.description"),
      icon: <Database className="h-5 w-5" />,
      features: [
        t("solutions.aiAgents.feature1"),
        t("solutions.aiAgents.feature2"),
        t("solutions.aiAgents.feature3"),
        t("solutions.leadGeneration.feature1")
      ],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Features for each product
  const aiWorkflowFeatures = [
    {
      icon: <Bot className="h-5 w-5 text-gray-700" />,
      title: t("solutions.chatbots.feature1"),
      description: t("solutions.chatbots.description")
    },
    {
      icon: <Cog className="h-5 w-5 text-gray-700" />,
      title: t("solutions.leadGeneration.feature1"),
      description: t("solutions.leadGeneration.description")
    },
    {
      icon: <FileText className="h-5 w-5 text-gray-700" />,
      title: t("solutions.socialMedia.feature1"),
      description: t("solutions.socialMedia.description")
    },
    {
      icon: <Zap className="h-5 w-5 text-gray-700" />,
      title: t("solutions.aiAgents.feature1"),
      description: t("solutions.aiAgents.description")
    }
  ];

  const conversationalAIFeatures = [
    {
      icon: <MessageSquare className="h-5 w-5 text-gray-700" />,
      title: t("solutions.chatbots.feature2"),
      description: t("solutions.chatbots.description")
    },
    {
      icon: <Brain className="h-5 w-5 text-gray-700" />,
      title: t("solutions.leadGeneration.feature2"),
      description: t("solutions.leadGeneration.description")
    },
    {
      icon: <Sparkles className="h-5 w-5 text-gray-700" />,
      title: t("solutions.socialMedia.feature2"),
      description: t("solutions.socialMedia.description")
    },
    {
      icon: <Users className="h-5 w-5 text-gray-700" />,
      title: t("solutions.aiAgents.feature2"),
      description: t("solutions.aiAgents.description")
    }
  ];

  const dataIntelligenceFeatures = [
    {
      icon: <Database className="h-5 w-5 text-gray-700" />,
      title: t("solutions.chatbots.feature3"),
      description: t("solutions.chatbots.description")
    },
    {
      icon: <BarChart className="h-5 w-5 text-gray-700" />,
      title: t("solutions.leadGeneration.feature3"),
      description: t("solutions.leadGeneration.description")
    },
    {
      icon: <Clock className="h-5 w-5 text-gray-700" />,
      title: t("solutions.socialMedia.feature3"),
      description: t("solutions.socialMedia.description")
    },
    {
      icon: <Shield className="h-5 w-5 text-gray-700" />,
      title: t("solutions.aiAgents.feature3"),
      description: t("solutions.aiAgents.description")
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              {isAuthenticated ? (
                <EditableText 
                  id="solutions-title"
                  defaultText={t("solutions.title")}
                />
              ) : (
                t("solutions.title")
              )}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
              {isAuthenticated ? (
                <EditableText 
                  id="solutions-subtitle"
                  defaultText={t("solutions.subtitle")}
                />
              ) : (
                t("solutions.subtitle")
              )}
            </p>
          </div>
          
          {/* Main Solutions */}
          <div className="mb-24">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
              {isAuthenticated ? (
                <EditableText 
                  id="solutions-section-title"
                  defaultText={t("solutions.sectionTitle")}
                />
              ) : (
                t("solutions.sectionTitle")
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionCards.map((solution, index) => (
                <SolutionCard
                  key={index}
                  title={solution.title}
                  description={solution.description}
                  icon={solution.icon}
                  features={solution.features}
                  imageUrl={solution.imageUrl}
                  delay={index * 100}
                  index={index}
                  isEditable={isAuthenticated}
                />
              ))}
            </div>
          </div>
          
          {/* AI Workflow Automation Section */}
          <div className="mb-24 scroll-mt-24" id="ai-workflow">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-chatbots-title"
                      defaultText={t("solutions.chatbots.title")}
                    />
                  ) : (
                    t("solutions.chatbots.title")
                  )}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-chatbots-description"
                      defaultText={t("solutions.chatbots.description")}
                    />
                  ) : (
                    t("solutions.chatbots.description")
                  )}
                </p>
                <p className="text-gray-600">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-futureproof-description"
                      defaultText={t("solutions.futureproof.description")}
                    />
                  ) : (
                    t("solutions.futureproof.description")
                  )}
                </p>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt={t("solutions.chatbots.title")} 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiWorkflowFeatures.map((feature, index) => (
                <ProductFeature 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  isEditable={isAuthenticated}
                />
              ))}
            </div>
          </div>
          
          {/* Conversational AI Section */}
          <div className="mb-24 scroll-mt-24" id="conversational-ai">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-socialmedia-title"
                      defaultText={t("solutions.socialMedia.title")}
                    />
                  ) : (
                    t("solutions.socialMedia.title")
                  )}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-socialmedia-description"
                      defaultText={t("solutions.socialMedia.description")}
                    />
                  ) : (
                    t("solutions.socialMedia.description")
                  )}
                </p>
                <p className="text-gray-600">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-futureproof-subtitle"
                      defaultText={t("solutions.futureproof.subtitle")}
                    />
                  ) : (
                    t("solutions.futureproof.subtitle")
                  )}
                </p>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt={t("solutions.socialMedia.title")} 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conversationalAIFeatures.map((feature, index) => (
                <ProductFeature 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  isEditable={isAuthenticated}
                />
              ))}
            </div>
          </div>
          
          {/* Data Intelligence Section */}
          <div className="mb-24 scroll-mt-24" id="data-intelligence">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-aiagents-title"
                      defaultText={t("solutions.aiAgents.title")}
                    />
                  ) : (
                    t("solutions.aiAgents.title")
                  )}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-aiagents-description"
                      defaultText={t("solutions.aiAgents.description")}
                    />
                  ) : (
                    t("solutions.aiAgents.description")
                  )}
                </p>
                <p className="text-gray-600">
                  {isAuthenticated ? (
                    <EditableText 
                      id="solutions-futureproof-title"
                      defaultText={t("solutions.futureproof.title")}
                    />
                  ) : (
                    t("solutions.futureproof.title")
                  )}
                </p>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt={t("solutions.aiAgents.title")} 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataIntelligenceFeatures.map((feature, index) => (
                <ProductFeature 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  isEditable={isAuthenticated}
                />
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gray-50 rounded-2xl p-10 lg:p-16 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {isAuthenticated ? (
                <EditableText 
                  id="solutions-cta-title"
                  defaultText={t("solutions.cta.title")}
                />
              ) : (
                t("solutions.cta.title")
              )}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {isAuthenticated ? (
                <EditableText 
                  id="solutions-cta-subtitle"
                  defaultText={t("solutions.cta.subtitle")}
                />
              ) : (
                t("solutions.cta.subtitle")
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gray-900 hover:bg-gray-800 py-6 px-8 rounded-xl text-base">
                {isAuthenticated ? (
                  <EditableText 
                    id="solutions-cta-button"
                    defaultText={t("solutions.cta.button")}
                  />
                ) : (
                  t("solutions.cta.button")
                )}
              </Button>
              <Button variant="outline" className="border-gray-300 py-6 px-8 rounded-xl text-base">
                {isAuthenticated ? (
                  <EditableText 
                    id="solutions-contact-button"
                    defaultText={t("contact.form.submit")}
                  />
                ) : (
                  t("contact.form.submit")
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Solutions;
