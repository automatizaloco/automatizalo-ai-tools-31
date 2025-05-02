
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useContactInfo } from '@/stores/contactInfoStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import MobileSocialLinks from './footer/MobileSocialLinks';
import MobileCompanyAccordion from './footer/MobileCompanyAccordion';
import MobileResourcesAccordion from './footer/MobileResourcesAccordion';
import MobileContactAccordion from './footer/MobileContactAccordion';
import MobileFooterCopyright from './footer/MobileFooterCopyright';

const MobileFooter = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <footer className={theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="inline-block mb-4">
            <img 
              src="/lovable-uploads/cee7d990-3366-4a2e-9120-691c1267c62c.png"
              alt="Automatízalo Logo"
              className="h-8 mb-2"
            />
          </Link>
          <MobileSocialLinks />
        </div>
        
        <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="company">
            <AccordionTrigger className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
              {t("footer.company")}
            </AccordionTrigger>
            <MobileCompanyAccordion />
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
              {t("footer.resources")}
            </AccordionTrigger>
            <MobileResourcesAccordion />
          </AccordionItem>

          <AccordionItem value="contact">
            <AccordionTrigger className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
              {t("contact.title")}
            </AccordionTrigger>
            <MobileContactAccordion />
          </AccordionItem>
        </Accordion>

        <MobileFooterCopyright />
      </div>
    </footer>
  );
};

export default MobileFooter;
