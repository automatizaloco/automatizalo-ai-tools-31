
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AnimationProcessCard from './hero/AnimationProcessCard';
import AnimationAssistantCard from './hero/AnimationAssistantCard';
import AnimationTimeSavingCard from './hero/AnimationTimeSavingCard';

interface HeroAnimationCardsProps {
  animationStep: number;
}

const HeroAnimationCards: React.FC<HeroAnimationCardsProps> = ({ animationStep }) => {
  const { language } = useLanguage();
  
  return (
    <>
      <AnimationProcessCard 
        animationStep={animationStep}
        language={language}
      />
      <AnimationAssistantCard 
        animationStep={animationStep}
        language={language}
      />
      <AnimationTimeSavingCard 
        language={language}
      />
    </>
  );
};

export default HeroAnimationCards;
