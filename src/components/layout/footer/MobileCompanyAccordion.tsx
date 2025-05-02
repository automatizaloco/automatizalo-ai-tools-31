
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AccordionContent } from '@/components/ui/accordion';

const MobileCompanyAccordion = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  return (
    <AccordionContent>
      <div className="space-y-2 pl-2">
        <div>
          <Link 
            to="/about" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("footer.about")}
          </Link>
        </div>
        <div>
          <Link 
            to="/blog" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("footer.blog")}
          </Link>
        </div>
        <div>
          <Link 
            to="/contact" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            {t("footer.contact")}
          </Link>
        </div>
        <div>
          <Link 
            to="/blog" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
          >
            Subscribe
          </Link>
        </div>
        {!isAuthenticated && (
          <div>
            <Link 
              to="/login" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors block py-1`}
            >
              {t('nav.login')}
            </Link>
          </div>
        )}
      </div>
    </AccordionContent>
  );
};

export default MobileCompanyAccordion;
