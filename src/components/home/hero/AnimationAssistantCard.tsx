
import React from 'react';
import { useAnimationSteps } from '@/hooks/useAnimationSteps';

interface AnimationAssistantCardProps {
  animationStep: number;
  language: string;
}

const AnimationAssistantCard: React.FC<AnimationAssistantCardProps> = ({ 
  animationStep,
  language
}) => {
  const assistantSteps = useAnimationSteps().getAssistantSteps(language);

  return (
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
  );
};

export default AnimationAssistantCard;
