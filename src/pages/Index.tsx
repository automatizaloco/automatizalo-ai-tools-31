import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, PieChart, Smartphone, Brain, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlides, setMaxSlides] = useState(0);
  
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
      const loadedTestimonials = JSON.parse(savedTestimonials);
      setTestimonials(loadedTestimonials);
      setMaxSlides(Math.max(0, Math.ceil(loadedTestimonials.length / 3) - 1));
    } else {
      const defaultTestimonials = [
        {
          id: 1,
          name: t("testimonials.client1.name"),
          company: "Company A",
          text: t("testimonials.client1.text")
        },
        {
          id: 2,
          name: t("testimonials.client2.name"),
          company: "Company B",
          text: t("testimonials.client2.text")
        },
        {
          id: 3,
          name: "John Smith",
          company: "Company C",
          text: "Their AI solutions have completely transformed how we operate our business. Highly recommended!"
        },
        {
          id: 4,
          name: "Sarah Johnson",
          company: "Company D",
          text: "Outstanding service and exceptional results. Would definitely recommend!"
        },
        {
          id: 5,
          name: "Michael Brown",
          company: "Company E",
          text: "The team's expertise in AI implementation is unmatched. Great experience working with them!"
        }
      ];
      setTestimonials(defaultTestimonials);
      localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
      setMaxSlides(Math.max(0, Math.ceil(defaultTestimonials.length / 3) - 1));
    }
  }, [t]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSlide < maxSlides) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setCurrentSlide(0);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, maxSlides]);

  const handleSliderChange = (values: number[]) => {
    setCurrentSlide(values[0]);
  };

  const goPrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const goNextSlide = () => {
    setCurrentSlide(prev => Math.min(maxSlides, prev + 1));
  };

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
            
            {testimonials.length > 0 && (
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
                        {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial) => (
                          <div 
                            key={testimonial.id} 
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-center mb-4">
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
                            
                            <p className="text-gray-600 italic">
                              {isAuthenticated ? (
                                <EditableText 
                                  id={`testimonial-text-${testimonial.id}`}
                                  defaultText={testimonial.text}
                                  multiline={true}
                                />
                              ) : testimonial.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                {maxSlides > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md z-10"
                      onClick={goPrevSlide}
                      disabled={currentSlide === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md z-10"
                      onClick={goNextSlide}
                      disabled={currentSlide >= maxSlides}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="mt-8 flex justify-center items-center gap-3">
                      <Slider
                        value={[currentSlide]}
                        min={0}
                        max={maxSlides}
                        step={1}
                        onValueChange={handleSliderChange}
                        className="w-48"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            {testimonials.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                No testimonials available.
              </div>
            )}
            
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
