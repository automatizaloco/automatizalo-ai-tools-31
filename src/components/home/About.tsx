import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('about-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="about-section" className="py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`order-2 lg:order-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-tag"
                  defaultText="About Us"
                />
              ) : (
                t("home.about.tagline")
              )}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-title"
                  defaultText="We're Building the Future of AI Automation"
                />
              ) : (
                t("home.about.title")
              )}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-paragraph1"
                  defaultText="At Automatízalo, we're a team of young, passionate AI specialists and automation experts. We connect, fine-tune, and optimize automation tools like Make.com, N8N, AI chatbots, and custom workflows to help businesses and individuals become more efficient, scalable, and future-ready."
                  multiline={true}
                />
              ) : (
                t("home.about.description")
              )}
            </p>
            
            <p className="text-gray-600 mb-8">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-paragraph2"
                  defaultText="Our mission is to empower businesses of all sizes with cutting-edge AI solutions that are affordable, scalable, and easy to implement. We believe that automation should be accessible to everyone, not just tech giants."
                  multiline={true}
                />
              ) : (
                t("home.about.mission")
              )}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-automatizalo-blue mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature1-title"
                        defaultText="Automated Workflows"
                      />
                    ) : (
                      t("home.about.feature1.title")
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature1-description"
                        defaultText="Connect and automate your workflows using cutting-edge AI and Make.com/N8N tools."
                      />
                    ) : (
                      t("home.about.feature1.description")
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-automatizalo-blue mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature2-title"
                        defaultText="AI Chatbots"
                      />
                    ) : (
                      t("home.about.feature2.title")
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature2-description"
                        defaultText="Personalized chatbots to handle customer service, scheduling, and lead engagement."
                      />
                    ) : (
                      t("home.about.feature2.description")
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-automatizalo-blue mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature3-title"
                        defaultText="Smart Systems"
                      />
                    ) : (
                      t("home.about.feature3.title")
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature3-description"
                        defaultText="AI-driven systems that learn and adapt to your business needs over time."
                      />
                    ) : (
                      t("home.about.feature3.description")
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-automatizalo-blue mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature4-title"
                        defaultText="Customized Solutions"
                      />
                    ) : (
                      "Customized Solutions"
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isAuthenticated ? (
                      <EditableText 
                        id="about-feature4-description"
                        defaultText="Tailored AI solutions designed specifically for your business challenges and goals."
                      />
                    ) : (
                      "Tailored AI solutions designed specifically for your business challenges and goals."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`order-1 lg:order-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                  alt="Team working with AI and automation" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
