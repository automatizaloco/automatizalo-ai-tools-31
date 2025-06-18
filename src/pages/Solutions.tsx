import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageSquare, PieChart, Smartphone, Brain, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductFeature from '@/components/solutions/ProductFeature';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useContactInfo } from '@/stores/contactInfoStore';
import EditableText from '@/components/admin/EditableText';
const Solutions = () => {
  const [visibleSection, setVisibleSection] = useState(0);
  const {
    t
  } = useLanguage();
  const {
    isAuthenticated
  } = useAuth();
  const {
    contactInfo
  } = useContactInfo();
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSection(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const handleWhatsAppClick = () => {
    const phoneNumber = contactInfo.whatsapp || contactInfo.phone || "+57 3192963363";
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent("Hello, I would like more information about your solutions");
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };
  const solutions = [{
    id: "chatbots",
    icon: <MessageSquare size={32} />,
    title: t('solutions.chatbots.title'),
    description: t('solutions.chatbots.description'),
    features: [t('solutions.chatbots.feature1'), t('solutions.chatbots.feature2'), t('solutions.chatbots.feature3')],
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=600"
  }, {
    id: "lead-generation",
    icon: <PieChart size={32} />,
    title: t('solutions.leadGeneration.title'),
    description: t('solutions.leadGeneration.description'),
    features: [t('solutions.leadGeneration.feature1'), t('solutions.leadGeneration.feature2'), t('solutions.leadGeneration.feature3')],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"
  }, {
    id: "social-media",
    icon: <Smartphone size={32} />,
    title: t('solutions.socialMedia.title'),
    description: t('solutions.socialMedia.description'),
    features: [t('solutions.socialMedia.feature1'), t('solutions.socialMedia.feature2'), t('solutions.socialMedia.feature3')],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=600"
  }, {
    id: "ai-agents",
    icon: <Brain size={32} />,
    title: t('solutions.aiAgents.title'),
    description: t('solutions.aiAgents.description'),
    features: [t('solutions.aiAgents.feature1'), t('solutions.aiAgents.feature2'), t('solutions.aiAgents.feature3')],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"
  }];
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
            {isAuthenticated ? <EditableText id="solutions-hero-title" defaultText={t('solutions.title')} /> : t('solutions.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {isAuthenticated ? <EditableText id="solutions-hero-subtitle" defaultText={t('solutions.subtitle')} /> : t('solutions.subtitle')}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAuthenticated ? <EditableText id="solutions-hero-description" defaultText={t('solutions.description')} /> : t('solutions.description')}
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {solutions.map((solution, index) => <ProductFeature key={solution.id} icon={solution.icon} title={solution.title} description={solution.description} features={solution.features} image={solution.image} reverse={index % 2 !== 0} delay={index * 200} />)}
          </div>
        </div>
      </section>

      {/* Future-proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              {isAuthenticated ? <EditableText id="solutions-futureproof-title" defaultText={t('solutions.futureproof.title')} /> : t('solutions.futureproof.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              {isAuthenticated ? <EditableText id="solutions-futureproof-description" defaultText={t('solutions.futureproof.description')} /> : t('solutions.futureproof.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[{
              icon: <Zap size={24} />,
              text: t('solutions.futureproof.features.0') || 'Scalable Solutions'
            }, {
              icon: <Brain size={24} />,
              text: t('solutions.futureproof.features.1') || 'Advanced AI'
            }, {
              icon: <Shield size={24} />,
              text: t('solutions.futureproof.features.2') || 'Custom Integration'
            }, {
              icon: <Clock size={24} />,
              text: t('solutions.futureproof.features.3') || '24/7 Support'
            }].map((feature, index) => <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.text}</h3>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-automatizalo-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {isAuthenticated ? <EditableText id="solutions-cta-title" defaultText={t('solutions.cta.title')} /> : t('solutions.cta.title')}
          </h2>
          <p className="text-xl mb-8">
            {isAuthenticated ? <EditableText id="solutions-cta-subtitle" defaultText={t('solutions.cta.subtitle')} /> : t('solutions.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleWhatsAppClick} className="bg-white text-automatizalo-blue hover:bg-gray-100 px-8 py-3 text-lg">
              {t('solutions.cta.button')}
              <ArrowRight size={20} className="ml-2" />
            </Button>
            
          </div>
        </div>
      </section>
    </div>;
};
export default Solutions;