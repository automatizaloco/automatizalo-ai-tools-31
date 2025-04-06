
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useContactInfo } from '@/stores/contactInfoStore';
import { useAuth } from '@/context/AuthContext';
import { Instagram } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const MobileFooter = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { contactInfo } = useContactInfo();
  const currentYear = new Date().getFullYear();

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
          <div className="flex space-x-4 justify-center mt-4 mb-6">
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
              <Instagram size={20} />
            </a>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="company">
            <AccordionTrigger className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
              {t("footer.company")}
            </AccordionTrigger>
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
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
              {t("footer.resources")}
            </AccordionTrigger>
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
          </AccordionItem>

          <AccordionItem value="contact">
            <AccordionTrigger className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>
              {t("contact.title")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-2">
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  <span className="font-medium">Phone:</span> {contactInfo.phone}
                </p>
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
          </AccordionItem>
        </Accordion>

        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} pt-4 text-center`}>
          <p className={theme === 'dark' ? 'text-gray-500 text-sm' : 'text-gray-600 text-sm'}>
            &copy; {currentYear} Automatízalo.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
            <Link 
              to="/privacy-policy" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors px-2`}
            >
              Privacy
            </Link>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
            <Link 
              to="/privacy-policy?tab=terms" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors px-2`}
            >
              Terms
            </Link>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
            <Link 
              to="/unsubscribe" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors px-2`}
            >
              Unsubscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
