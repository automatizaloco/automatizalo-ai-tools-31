
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, PieChart, Smartphone, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SolutionCard from '@/components/ui/SolutionCard';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface SolutionsSectionProps {
  isEditable?: boolean;
}

interface Solution {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  features: string[];
  imageUrl: string;
}

const SolutionsSection: React.FC<SolutionsSectionProps> = ({ isEditable }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const solutions: Solution[] = [
    {
      id: "chatbots",
      titleKey: t('solutions.chatbots.title'),
      descriptionKey: t('solutions.chatbots.description'),
      icon: <MessageSquare size={24} />,
      features: [
        t('solutions.chatbots.feature1'),
        t('solutions.chatbots.feature2'),
        t('solutions.chatbots.feature3')
      ],
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "lead-generation",
      titleKey: t('solutions.leadGeneration.title'),
      descriptionKey: t('solutions.leadGeneration.description'),
      icon: <PieChart size={24} />,
      features: [
        t('solutions.leadGeneration.feature1'),
        t('solutions.leadGeneration.feature2'),
        t('solutions.leadGeneration.feature3')
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "social-media",
      titleKey: t('solutions.socialMedia.title'),
      descriptionKey: t('solutions.socialMedia.description'),
      icon: <Smartphone size={24} />,
      features: [
        t('solutions.socialMedia.feature1'),
        t('solutions.socialMedia.feature2'),
        t('solutions.socialMedia.feature3')
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "ai-agents",
      titleKey: t('solutions.aiAgents.title'),
      descriptionKey: t('solutions.aiAgents.description'),
      icon: <Brain size={24} />,
      features: [
        t('solutions.aiAgents.feature1'),
        t('solutions.aiAgents.feature2'),
        t('solutions.aiAgents.feature3')
      ],
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-blue-50/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
            {isAuthenticated ? (
              <EditableText 
                id="solutions-section-tag"
                defaultText={t('solutions.sectionTag')}
                pageName="home"
                sectionName="solutions-tag"
              />
            ) : (
              t('solutions.sectionTag')
            )}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {isAuthenticated ? (
              <EditableText 
                id="solutions-section-title"
                defaultText={t('solutions.sectionTitle')}
                pageName="home"
                sectionName="solutions-title"
              />
            ) : (
              t('solutions.sectionTitle')
            )}
          </h2>
          <p className="text-gray-600">
            {isAuthenticated ? (
              <EditableText 
                id="solutions-section-description"
                defaultText={t('solutions.sectionDescription')}
                pageName="home"
                sectionName="solutions-description"
              />
            ) : (
              t('solutions.sectionDescription')
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={solution.id}
              title={solution.titleKey}
              description={solution.descriptionKey}
              icon={solution.icon}
              features={solution.features}
              imageUrl={solution.imageUrl}
              delay={index * 100}
              index={index}
              isEditable={isEditable}
              pageName="home"
              sectionName="solutions"
              imageId={solution.id}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/solutions">
            <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 transition-all duration-300 rounded-xl">
              {t('solutions.viewAllButton')}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
