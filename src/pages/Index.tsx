import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, PieChart, Smartphone, Brain, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import SolutionCard from '@/components/ui/SolutionCard';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';
import { toast } from 'sonner';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testimonials, setTestimonials] = React.useState<any[]>([]);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEditableTextChange = (event: CustomEvent) => {
      const { id, newText } = event.detail;
      console.log(`Content edited: ${id} = ${newText}`);
      toast.success('Content updated successfully');
    };

    window.addEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    
    return () => {
      window.removeEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const savedTestimonials = localStorage.getItem('testimonials');
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    }
  }, []);

  const solutions = [
    {
      id: "chatbots",
      title: t("solutions.chatbots.title"),
      description: t("solutions.chatbots.description"),
      icon: <MessageSquare size={24} />,
      features: [
        t("solutions.chatbots.feature1"),
        t("solutions.chatbots.feature2"),
        t("solutions.chatbots.feature3")
      ],
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "lead-generation",
      title: t("solutions.leadGeneration.title"),
      description: t("solutions.leadGeneration.description"),
      icon: <PieChart size={24} />,
      features: [
        t("solutions.leadGeneration.feature1"),
        t("solutions.leadGeneration.feature2"),
        t("solutions.leadGeneration.feature3")
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "social-media",
      title: t("solutions.socialMedia.title"),
      description: t("solutions.socialMedia.description"),
      icon: <Smartphone size={24} />,
      features: [
        t("solutions.socialMedia.feature1"),
        t("solutions.socialMedia.feature2"),
        t("solutions.socialMedia.feature3")
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "ai-agents",
      title: t("solutions.aiAgents.title"),
      description: t("solutions.aiAgents.description"),
      icon: <Brain size={24} />,
      features: [
        t("solutions.aiAgents.feature1"),
        t("solutions.aiAgents.feature2"),
        t("solutions.aiAgents.feature3")
      ],
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <About />
        
        <section className="py-16 md:py-24 bg-blue-50/50">
          <div className="container mx-auto px-4 md:px-8">
            <div className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
                {isAuthenticated ? (
                  <EditableText 
                    id="solutions-section-tag"
                    defaultText={t("solutions.sectionTag")}
                  />
                ) : (
                  t("solutions.sectionTag")
                )}
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {isAuthenticated ? (
                  <EditableText 
                    id="solutions-section-title"
                    defaultText={t("solutions.sectionTitle")}
                  />
                ) : (
                  t("solutions.sectionTitle")
                )}
              </h2>
              <p className="text-gray-600">
                {isAuthenticated ? (
                  <EditableText 
                    id="solutions-section-description"
                    defaultText={t("solutions.sectionDescription")}
                  />
                ) : (
                  t("solutions.sectionDescription")
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
              {solutions.map((solution, index) => (
                <SolutionCard
                  key={solution.id}
                  title={solution.title}
                  description={solution.description}
                  icon={solution.icon}
                  features={solution.features}
                  imageUrl={solution.imageUrl}
                  delay={index * 100}
                  index={index}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/solutions">
                <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 transition-all duration-300 rounded-xl">
                  {t("solutions.viewAllButton")}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
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
        
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
                {isAuthenticated ? (
                  <EditableText 
                    id="testimonials-section-tag"
                    defaultText={t("testimonials.title")}
                  />
                ) : (
                  t("testimonials.title")
                )}
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {isAuthenticated ? (
                  <EditableText 
                    id="testimonials-section-title"
                    defaultText={t("testimonials.subtitle")}
                  />
                ) : (
                  t("testimonials.subtitle")
                )}
              </h2>
              <p className="text-gray-600">
                {isAuthenticated ? (
                  <EditableText 
                    id="testimonials-section-description"
                    defaultText={t("testimonials.description")}
                  />
                ) : (
                  t("testimonials.description")
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <p className="text-gray-600 mb-6 italic">
                    {isAuthenticated ? (
                      <EditableText 
                        id={`testimonial-text-${testimonial.id}`}
                        defaultText={testimonial.text}
                      />
                    ) : testimonial.text}
                  </p>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {isAuthenticated ? (
                          <EditableText 
                            id={`testimonial-name-${testimonial.id}`}
                            defaultText={testimonial.name}
                          />
                        ) : testimonial.name}
                      </h4>
                      {testimonial.company && (
                        <p className="text-sm text-gray-500">
                          {isAuthenticated ? (
                            <EditableText 
                              id={`testimonial-company-${testimonial.id}`}
                              defaultText={testimonial.company}
                            />
                          ) : testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {isAuthenticated && (
              <div className="mt-8 text-center">
                <Link to="/admin/testimonials">
                  <Button variant="outline">
                    Manage Testimonials
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
