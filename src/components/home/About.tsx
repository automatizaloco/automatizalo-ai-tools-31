
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';
import withEditableImage from '@/components/admin/withEditableImage';

interface AboutProps {
  isEditable?: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
}

const About: React.FC<AboutProps> = ({ isEditable }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  
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

  // Create features list - they're loaded from the database directly by EditableText now
  useEffect(() => {
    // Define fixed feature IDs for consistent database storage
    const featureList = [
      { id: 'feature-1', title: '', description: '' },
      { id: 'feature-2', title: '', description: '' },
      { id: 'feature-3', title: '', description: '' },
      { id: 'feature-4', title: '', description: '' }
    ];
    
    setFeatures(featureList);
  }, [language]);

  // Create an editable image component using withEditableImage HOC
  const EditableImage = withEditableImage(({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ));

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
                  pageName="home"
                  sectionName="about-tagline"
                />
              ) : (
                <EditableText 
                  id="about-section-tag"
                  defaultText="About Us"
                  pageName="home"
                  sectionName="about-tagline"
                  disabled={true}
                />
              )}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-title"
                  defaultText="Transform Your Business with AI"
                  pageName="home"
                  sectionName="about-title"
                />
              ) : (
                <EditableText 
                  id="about-section-title"
                  defaultText="Transform Your Business with AI"
                  pageName="home"
                  sectionName="about-title"
                  disabled={true}
                />
              )}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-paragraph1"
                  defaultText="We specialize in creating intelligent automation solutions that help businesses streamline operations, reduce costs, and improve customer experiences."
                  multiline={true}
                  pageName="home"
                  sectionName="about-description"
                />
              ) : (
                <EditableText 
                  id="about-section-paragraph1"
                  defaultText="We specialize in creating intelligent automation solutions that help businesses streamline operations, reduce costs, and improve customer experiences."
                  multiline={true}
                  pageName="home"
                  sectionName="about-description"
                  disabled={true}
                />
              )}
            </p>
            
            <p className="text-gray-600 mb-8">
              {isAuthenticated ? (
                <EditableText 
                  id="about-section-paragraph2"
                  defaultText="Our mission is to make AI technology accessible to businesses of all sizes, helping them stay competitive in the digital age."
                  multiline={true}
                  pageName="home"
                  sectionName="about-mission"
                />
              ) : (
                <EditableText 
                  id="about-section-paragraph2"
                  defaultText="Our mission is to make AI technology accessible to businesses of all sizes, helping them stay competitive in the digital age."
                  multiline={true}
                  pageName="home"
                  sectionName="about-mission"
                  disabled={true}
                />
              )}
            </p>

            {/* Features section with database-stored content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-automatizalo-blue mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {isAuthenticated ? (
                        <EditableText 
                          id={`about-section-${feature.id}-title`}
                          defaultText={`Feature ${feature.id} Title`}
                          pageName="home"
                          sectionName={`about-${feature.id}-title`}
                        />
                      ) : (
                        <EditableText 
                          id={`about-section-${feature.id}-title`}
                          defaultText={`Feature ${feature.id} Title`}
                          pageName="home"
                          sectionName={`about-${feature.id}-title`}
                          disabled={true}
                        />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isAuthenticated ? (
                        <EditableText 
                          id={`about-section-${feature.id}-description`}
                          defaultText={`Description for feature ${feature.id}`}
                          pageName="home"
                          sectionName={`about-${feature.id}-description`}
                        />
                      ) : (
                        <EditableText 
                          id={`about-section-${feature.id}-description`}
                          defaultText={`Description for feature ${feature.id}`}
                          pageName="home"
                          sectionName={`about-${feature.id}-description`}
                          disabled={true}
                        />
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image section */}
          <div className={`order-1 lg:order-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                {isEditable ? (
                  <EditableImage 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                    alt="About us image"
                    pageName="home"
                    sectionName="about"
                    imageId="main"
                    className="w-full h-auto"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                    alt="About us image"
                    className="w-full h-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
