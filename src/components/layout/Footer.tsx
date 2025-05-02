
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import EditableText from '@/components/admin/EditableText';
import { useContactInfo } from '@/stores/contactInfoStore';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFooter from './MobileFooter';
import SocialLinks from './footer/SocialLinks';
import CompanySection from './footer/CompanySection';
import ResourcesSection from './footer/ResourcesSection';
import ContactSection from './footer/ContactSection';
import FooterCopyright from './footer/FooterCopyright';

const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { fetchContactInfo } = useContactInfo();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("Footer component: Fetching contact info");
    fetchContactInfo();
  }, [fetchContactInfo]);

  // Return the mobile version for small screens
  if (isMobile) {
    return <MobileFooter />;
  }

  // Return the desktop version for larger screens
  return (
    <footer className={theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}>
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/cee7d990-3366-4a2e-9120-691c1267c62c.png"
                alt="Automatízalo Logo"
                className="h-10 mb-4"
              />
            </Link>
            <p className={theme === 'dark' ? 'text-gray-400 mb-6' : 'text-gray-600 mb-6'}>
              {isAuthenticated ? (
                <EditableText 
                  id="footer-description" 
                  defaultText={t("footer.description")} 
                  multiline={true} 
                />
              ) : (
                t("footer.description")
              )}
            </p>
            <SocialLinks />
          </div>

          <div className="md:col-span-2">
            <CompanySection />
          </div>

          <div className="md:col-span-2">
            <ResourcesSection />
          </div>

          <ContactSection />
        </div>

        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;
