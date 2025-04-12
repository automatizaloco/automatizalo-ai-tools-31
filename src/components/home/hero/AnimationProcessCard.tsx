
import React from 'react';
import { useAnimationSteps } from '@/hooks/useAnimationSteps';

interface AnimationProcessCardProps {
  animationStep: number;
  language: string;
}

const AnimationProcessCard: React.FC<AnimationProcessCardProps> = ({ 
  animationStep,
  language
}) => {
  const automationSteps = useAnimationSteps().getAutomationSteps(language);

  return (
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
  );
};

export default AnimationProcessCard;
