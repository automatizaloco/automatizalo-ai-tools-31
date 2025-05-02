
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import FooterSection from './FooterSection';
import FooterLink from './FooterLink';

const CompanySection = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  return (
    <FooterSection titleId="footer-company" defaultTitle={t("footer.company")}>
      <li>
        <FooterLink 
          to="/about" 
          textId="footer-about" 
          defaultText={t("footer.about")}
        />
      </li>
      <li>
        <FooterLink 
          to="/blog" 
          textId="footer-blog" 
          defaultText={t("footer.blog")}
        />
      </li>
      <li>
        <FooterLink 
          to="/contact" 
          textId="footer-contact" 
          defaultText={t("footer.contact")}
        />
      </li>
      <li>
        <FooterLink 
          to="/blog" 
          textId="footer-subscribe" 
          defaultText="Subscribe"
        />
      </li>
      {!isAuthenticated && (
        <li>
          <FooterLink 
            to="/login" 
            textId="nav-login" 
            defaultText={t('nav.login')}
          />
        </li>
      )}
    </FooterSection>
  );
};

export default CompanySection;
