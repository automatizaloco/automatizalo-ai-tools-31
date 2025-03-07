
import { CheckCircle2, Zap, Brain, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const features = [
    { 
      icon: <Zap size={20} />, 
      title: t('home.about.feature1.title'), 
      description: t('home.about.feature1.description')
    },
    { 
      icon: <Bot size={20} />, 
      title: t('home.about.feature2.title'), 
      description: t('home.about.feature2.description')
    },
    { 
      icon: <Brain size={20} />, 
      title: t('home.about.feature3.title'), 
      description: t('home.about.feature3.description')
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className={`inline-block py-1 px-3 mb-4 rounded-full text-sm font-medium ${
              theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {t('home.about.tagline')}
            </span>
            
            <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : ''
            }`}>
              {t('home.about.title')}
            </h2>
            
            <p className={`mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('home.about.description')}
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`mt-1 p-1.5 rounded-full mr-4 ${
                    theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-white' : ''
                    }`}>{feature.title}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <Button className={`transition-all duration-300 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}>
                {t('home.about.learnMore')}
              </Button>
              <Button variant="ghost" className={
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }>
                {t('home.about.contactUs')}
              </Button>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" 
                alt="Our Team" 
                className="w-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            
            <div className={`absolute -bottom-6 right-6 md:right-8 rounded-xl p-5 shadow-lg max-w-xs ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex flex-col">
                <h3 className={`font-medium text-lg mb-2 ${
                  theme === 'dark' ? 'text-white' : ''
                }`}>{t('home.about.whyWorkWithUs')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>{t('home.about.reason1')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>{t('home.about.reason2')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>{t('home.about.reason3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
