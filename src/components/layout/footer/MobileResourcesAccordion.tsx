
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { AccordionContent } from '@/components/ui/accordion';

const MobileResourcesAccordion = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <AccordionContent>
      <div className="space-y-2 pl-2">
        <div>
          <Link 
            to="/solutions#chatbots" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("solutions.chatbots.title")}
          </Link>
        </div>
        <div>
          <Link 
            to="/solutions#lead-generation" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("solutions.leadGeneration.title")}
          </Link>
        </div>
        <div>
          <Link 
            to="/solutions#social-media" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("solutions.socialMedia.title")}
          </Link>
        </div>
        <div>
          <Link 
            to="/solutions#ai-agents" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("solutions.aiAgents.title")}
          </Link>
        </div>
      </div>
    </AccordionContent>
  );
};

export default MobileResourcesAccordion;
