
import React from 'react';

interface AnimationTimeSavingCardProps {
  language: string;
}

const AnimationTimeSavingCard: React.FC<AnimationTimeSavingCardProps> = ({ language }) => {
  return (
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
  );
};

export default AnimationTimeSavingCard;
