
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';
import { useContactInfo } from '@/stores/contactInfoStore';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { contactInfo } = useContactInfo();
  
  // Clean phone number for WhatsApp
  const cleanPhone = contactInfo.phone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent("Hello, I would like to know more about your services.");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {isAuthenticated ? (
              <EditableText 
                id="cta-title"
                defaultText={t('home.cta.title')}
              />
            ) : (
              t('home.cta.title')
            )}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            {isAuthenticated ? (
              <EditableText 
                id="cta-description"
                defaultText={t('home.cta.description')}
              />
            ) : (
              t('home.cta.description')
            )}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 rounded-xl text-base">
                {isAuthenticated ? (
                  <EditableText 
                    id="cta-contact-button"
                    defaultText={t('home.cta.contactButton')}
                  />
                ) : (
                  t('home.cta.contactButton')
                )}
              </Button>
            </Link>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 rounded-xl text-base">
                {isAuthenticated ? (
                  <EditableText 
                    id="cta-talk-button"
                    defaultText={t('home.cta.talkButton')}
                  />
                ) : (
                  t('home.cta.talkButton')
                )}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
