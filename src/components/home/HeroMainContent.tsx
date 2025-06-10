
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface HeroMainContentProps {
  isVisible: boolean;
  getStartedText: string;
  learnMoreText: string;
}

const HeroMainContent: React.FC<HeroMainContentProps> = ({
  isVisible,
  getStartedText,
  learnMoreText
}) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`max-w-xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <span className="inline-block py-1 px-3 mb-4 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
        {isAuthenticated ? (
          <EditableText 
            id="hero-tagline"
            defaultText="🚀 Automated Business Solutions"
            pageName="home"
            sectionName="hero-tagline"
          />
        ) : (
          "🚀 Automated Business Solutions"
        )}
      </span>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
        {isAuthenticated ? (
          <EditableText 
            id="hero-title"
            defaultText="Transform Your Business with AI Automation"
            pageName="home"
            sectionName="hero-title"
          />
        ) : (
          "Transform Your Business with AI Automation"
        )}
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        {isAuthenticated ? (
          <EditableText 
            id="hero-description"
            defaultText="helps businesses automate repetitive tasks, improve efficiency, and scale operations with cutting-edge AI technology. From chatbots to data analysis, we've got you covered."
            pageName="home"
            sectionName="hero-description"
          />
        ) : (
          "helps businesses automate repetitive tasks, improve efficiency, and scale operations with cutting-edge AI technology. From chatbots to data analysis, we've got you covered."
        )}
      </p>
      
      <div className="flex flex-wrap gap-4">
        <Button 
          className="bg-gray-900 hover:bg-gray-800 px-6 text-base transition-all duration-300 rounded-xl h-12" 
          size="lg"
        >
          {getStartedText}
          <ArrowRight size={18} className="ml-2" />
        </Button>
        
        <Link to="#about-section">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-800 hover:bg-gray-100 px-6 text-base transition-all duration-300 rounded-xl h-12" 
            size="lg"
          >
            {learnMoreText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroMainContent;
