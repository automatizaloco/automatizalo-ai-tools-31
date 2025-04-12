
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroAnimationCards from './HeroAnimationCards';
import HeroMainContent from './HeroMainContent';
import HeroImage from './HeroImage';

interface HeroSectionProps {
  isEditable?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isEditable = false }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [animationStep, setAnimationStep] = React.useState(0);
  const { t } = useLanguage();
  
  React.useEffect(() => {
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
          <HeroMainContent 
            isVisible={isVisible} 
            getStartedText={t('home.hero.getStarted')} 
            learnMoreText={t('home.hero.learnMore')}
            tagline={t('home.hero.tagline')}
            title={t('home.hero.title')}
            description={t('home.hero.description')}
          />
          
          <div className={`relative w-full max-w-md transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <HeroImage isEditable={isEditable} />
            <HeroAnimationCards animationStep={animationStep} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
