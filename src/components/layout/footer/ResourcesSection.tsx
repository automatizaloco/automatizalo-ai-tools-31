
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import FooterSection from './FooterSection';
import FooterLink from './FooterLink';

const ResourcesSection = () => {
  const { t } = useLanguage();
  
  return (
    <FooterSection titleId="footer-resources" defaultTitle={t("footer.resources")}>
      <li>
        <FooterLink 
          to="/solutions#chatbots" 
          textId="footer-chatbots" 
          defaultText={t("solutions.chatbots.title")}
        />
      </li>
      <li>
        <FooterLink 
          to="/solutions#lead-generation" 
          textId="footer-lead-generation" 
          defaultText={t("solutions.leadGeneration.title")}
        />
      </li>
      <li>
        <FooterLink 
          to="/solutions#social-media" 
          textId="footer-social-media" 
          defaultText={t("solutions.socialMedia.title")}
        />
      </li>
      <li>
        <FooterLink 
          to="/solutions#ai-agents" 
          textId="footer-ai-agents" 
          defaultText={t("solutions.aiAgents.title")}
        />
      </li>
    </FooterSection>
  );
};

export default ResourcesSection;
