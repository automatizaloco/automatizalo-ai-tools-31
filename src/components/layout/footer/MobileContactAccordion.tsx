
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useContactInfo } from '@/stores/contactInfoStore';
import { AccordionContent } from '@/components/ui/accordion';
import FooterWhatsAppButton from './FooterWhatsAppButton';

const MobileContactAccordion = () => {
  const { theme } = useTheme();
  const { contactInfo } = useContactInfo();
  
  return (
    <AccordionContent>
      <div className="space-y-2 pl-2">
        <FooterWhatsAppButton />
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          <span className="font-medium">Email:</span> {contactInfo.email}
        </p>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          <span className="font-medium">Address:</span> {contactInfo.address}
        </p>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          <a 
            href={contactInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            {contactInfo.website}
          </a>
        </p>
      </div>
    </AccordionContent>
  );
};

export default MobileContactAccordion;
