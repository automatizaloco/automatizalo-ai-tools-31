
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

const CTASection: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-automatizalo-blue/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-automatizalo-blue/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {isAuthenticated ? (
              <EditableText 
                id="cta-section-title"
                defaultText={t("solutions.futureproof.title")}
              />
            ) : (
              t("solutions.futureproof.title")
            )}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {isAuthenticated ? (
              <EditableText 
                id="cta-section-description"
                defaultText={t("solutions.futureproof.description")}
              />
            ) : (
              t("solutions.futureproof.description")
            )}
          </p>
          <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 px-8 py-6 h-auto text-base transition-all duration-300 rounded-xl" size="lg">
            {isAuthenticated ? (
              <EditableText 
                id="cta-button-text"
                defaultText={t("solutions.cta.button")}
              />
            ) : (
              t("solutions.cta.button")
            )}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
