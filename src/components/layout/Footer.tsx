
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import EditableText from '@/components/admin/EditableText';
import { useState, useEffect } from 'react';

const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  const [footerContent, setFooterContent] = useState({
    description: "We help businesses leverage automation technologies to grow and scale efficiently.",
    company: "Company",
    about: "About Us",
    blog: "Blog",
    contact: "Contact",
    solutions: "Solutions",
    chatbots: "Chatbots",
    leadGeneration: "Lead Generation",
    socialMedia: "Social Media",
    aiAgents: "AI Agents",
    contactUs: "Contact Us",
    phone: "+1 (555) 123-4567",
    email: "contact@automatizalo.co",
    address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
    website: "https://automatizalo.co",
    allRightsReserved: "All rights reserved."
  });

  // Load saved footer content from localStorage
  useEffect(() => {
    try {
      const savedFooterContent = localStorage.getItem('footerContent');
      if (savedFooterContent) {
        setFooterContent(JSON.parse(savedFooterContent));
      }
    } catch (error) {
      console.error("Error loading footer content:", error);
    }
  }, []);

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
              <EditableText 
                id="footer-description" 
                defaultText={footerContent.description} 
                multiline={true} 
              />
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
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.053-.059 1.37-.059 4.04 0 2.672.01 2.988.059 4.042.045.975.207 1.504.344 1.856.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.059 4.04.059 2.672 0 2.988-.01 4.042-.059.975-.045 1.504-.207 1.856-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.352.3-.881.344-1.856.048-1.054.059-1.37.059-4.041 0-2.67-.01-2.987-.059-4.04-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.684-.566-1.15-.748-.352-.137-.881-.3-1.856-.344-1.054-.048-1.37-.059-4.042-.059zm0 11.531a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm0-8.468a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm6.538-.203a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <EditableText 
                id="footer-company" 
                defaultText={footerContent.company}
              />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-about" 
                    defaultText={footerContent.about}
                  />
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-blog" 
                    defaultText={footerContent.blog}
                  />
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-contact" 
                    defaultText={footerContent.contact}
                  />
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <EditableText 
                id="footer-solutions" 
                defaultText={footerContent.solutions}
              />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/solutions#chatbots" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-chatbots" 
                    defaultText={footerContent.chatbots}
                  />
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#lead-generation" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-lead-generation" 
                    defaultText={footerContent.leadGeneration}
                  />
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#social-media" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-social-media" 
                    defaultText={footerContent.socialMedia}
                  />
                </Link>
              </li>
              <li>
                <Link 
                  to="/solutions#ai-agents" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  <EditableText 
                    id="footer-ai-agents" 
                    defaultText={footerContent.aiAgents}
                  />
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left`}>
              <EditableText 
                id="footer-contact-us" 
                defaultText={footerContent.contactUs}
              />
            </h3>
            <div className="text-left">
              <p className={theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>
                <span className="font-medium">Phone:</span> <EditableText id="footer-phone" defaultText={footerContent.phone} />
              </p>
              <p className={theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>
                <span className="font-medium">Email:</span> <EditableText id="footer-email" defaultText={footerContent.email} />
              </p>
              <p className={theme === 'dark' ? 'text-gray-400 mb-4' : 'text-gray-600 mb-4'}>
                <span className="font-medium">Address:</span> <EditableText id="footer-address" defaultText={footerContent.address} multiline={true} />
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                <a 
                  href="https://automatizalo.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
                >
                  <EditableText id="footer-website" defaultText={footerContent.website} />
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
            &copy; {currentYear} Automatízalo. <EditableText id="footer-rights" defaultText={footerContent.allRightsReserved} />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
