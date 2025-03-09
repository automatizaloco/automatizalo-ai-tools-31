
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  // Custom X logo component instead of using Twitter from lucide
  const XLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 2.5,4.5 H 8 L 14,19.5 H 22.5" />
      <path d="M 4,19.5 H 10 L 16,4.5 H 21" />
    </svg>
  );

  return (
    <footer className={theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}>
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/a8d9fdf8-e441-4048-ba30-f92269be3e04.png"
                alt="Automatízalo Logo"
                className="h-10 mb-4"
              />
            </Link>
            <p className={theme === 'dark' ? 'text-gray-400 mb-6' : 'text-gray-600 mb-6'}>
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/automatizalo.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://x.com/Automatizalo_co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                aria-label="X (Twitter)"
              >
                <XLogo />
              </a>
              <a 
                href="https://www.instagram.com/automatizalo.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('footer.company')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('footer.blog')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('footer.solutions')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/solutions#chatbots" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('solutions.chatbots.title')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#lead-generation" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('solutions.leadGeneration.title')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#social-media" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('solutions.socialMedia.title')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#ai-agents" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {t('solutions.aiAgents.title')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('footer.contactUs')}
            </h3>
            <p className={theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>
              <span className="font-medium">{t('footer.email')}:</span> contact@automatizalo.co
            </p>
            <p className={theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>
              <span className="font-medium">{t('footer.phone')}:</span> +1 (555) 123-4567
            </p>
            <p className={theme === 'dark' ? 'text-gray-400 mb-4' : 'text-gray-600 mb-4'}>
              <span className="font-medium">{t('footer.address')}:</span> 123 AI Boulevard, Tech District, San Francisco, CA 94105
            </p>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              <a 
                href="https://automatizalo.co"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
              >
                https://automatizalo.co
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
            &copy; {currentYear} Automatízalo. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
