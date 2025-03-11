import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import EditableText from '@/components/admin/EditableText';
import { useContactInfo } from '@/stores/contactInfoStore';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { contactInfo, updateContactInfo } = useContactInfo();
  const currentYear = new Date().getFullYear();
  
  const handleContactInfoChange = (id: string, value: string) => {
    const fieldMap: Record<string, keyof typeof contactInfo> = {
      'footer-phone': 'phone',
      'footer-email': 'email',
      'footer-address': 'address',
      'footer-website': 'website'
    };
    
    if (id in fieldMap) {
      updateContactInfo({ [fieldMap[id]]: value });
    }
  };

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
            <div className="flex space-x-4 justify-center">
              <a 
                href="https://www.facebook.com/automatizalo.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors p-2 rounded-full flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                </svg>
              </a>
              <a 
                href="https://x.com/Automatizalo_co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors p-2 rounded-full flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                aria-label="X (Twitter)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/automatizalo.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors p-2 rounded-full flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.053-.059 1.37-.059 4.04 0 2.672.01 2.988.059 4.042.045.975.207 1.504.344 1.856.182.466.399.8.748 1.15.35.35.684.566 1.15.748.352.137.881.3 1.856.344 1.054.048 1.37.059 4.04.059 2.672 0 2.988-.01 4.042-.059.975-.045 1.504-.207 1.856-.344.466-.182.8-.398 1.15-.748.35-.35-.566-.684.748-1.15.137-.352.3-.881.344-1.856.048-1.054.059-1.37.059-4.041 0-2.67-.01-2.987-.059-4.04-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.684-.566-1.15-.748-.352-.137-.881-.3-1.856-.344-1.054-.048-1.37-.059-4.042-.059zm0 11.531a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm0-8.468a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm6.538-.203a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {isAuthenticated ? (
                <EditableText 
                  id="footer-company" 
                  defaultText={t("footer.company")}
                />
              ) : (
                t("footer.company")
              )}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-about" 
                      defaultText={t("footer.about")}
                    />
                  ) : (
                    t("footer.about")
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-blog" 
                      defaultText={t("footer.blog")}
                    />
                  ) : (
                    t("footer.blog")
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-contact" 
                      defaultText={t("footer.contact")}
                    />
                  ) : (
                    t("footer.contact")
                  )}
                </Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link 
                    to="/login" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                  >
                    {t('nav.login')}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {isAuthenticated ? (
                <EditableText 
                  id="footer-solutions" 
                  defaultText={t("footer.resources")}
                />
              ) : (
                t("footer.resources")
              )}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/solutions#chatbots" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-chatbots" 
                      defaultText={t("solutions.chatbots.title")}
                    />
                  ) : (
                    t("solutions.chatbots.title")
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#lead-generation" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-lead-generation" 
                      defaultText={t("solutions.leadGeneration.title")}
                    />
                  ) : (
                    t("solutions.leadGeneration.title")
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#social-media" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-social-media" 
                      defaultText={t("solutions.socialMedia.title")}
                    />
                  ) : (
                    t("solutions.socialMedia.title")
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#ai-agents" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-ai-agents" 
                      defaultText={t("solutions.aiAgents.title")}
                    />
                  ) : (
                    t("solutions.aiAgents.title")
                  )}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left`}>
              {isAuthenticated ? (
                <EditableText 
                  id="footer-contact-us" 
                  defaultText={t("contact.title")}
                />
              ) : (
                t("contact.title")
              )}
            </h3>
            <div className="text-left">
              <p className={theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>
                <span className="font-medium">Phone:</span> 
                {isAuthenticated ? (
                  <EditableText 
                    id="footer-phone" 
                    defaultText={contactInfo.phone}
                    onSave={(value) => handleContactInfoChange('footer-phone', value)}
                  />
                ) : (
                  <span> {contactInfo.phone}</span>
                )}
              </p>
              <p className={theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>
                <span className="font-medium">Email:</span> 
                {isAuthenticated ? (
                  <EditableText 
                    id="footer-email" 
                    defaultText={contactInfo.email}
                    onSave={(value) => handleContactInfoChange('footer-email', value)}
                  />
                ) : (
                  <span> {contactInfo.email}</span>
                )}
              </p>
              <p className={theme === 'dark' ? 'text-gray-400 mb-4' : 'text-gray-600 mb-4'}>
                <span className="font-medium">Address:</span> 
                {isAuthenticated ? (
                  <EditableText 
                    id="footer-address" 
                    defaultText={contactInfo.address}
                    multiline={true}
                    onSave={(value) => handleContactInfoChange('footer-address', value)}
                  />
                ) : (
                  <span> {contactInfo.address}</span>
                )}
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                <a 
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
                >
                  {isAuthenticated ? (
                    <EditableText 
                      id="footer-website" 
                      defaultText={contactInfo.website}
                      onSave={(value) => handleContactInfoChange('footer-website', value)}
                    />
                  ) : (
                    contactInfo.website
                  )}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
              &copy; {currentYear} Automatízalo.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Link 
                to="/privacy-policy" 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                Privacy Policy
              </Link>
              <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <Link 
                to="/privacy-policy?tab=terms" 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                Terms of Service
              </Link>
              <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <Link 
                to="/privacy-policy?tab=cookies" 
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
