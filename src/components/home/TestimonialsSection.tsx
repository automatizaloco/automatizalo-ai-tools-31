
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlides, setMaxSlides] = useState(0);

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

  return (
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
                  <div key={slideIndex} className="min-w-full w-full grid grid-cols-1 md:grid-cols-3 gap-6">
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
  );
};

export default TestimonialsSection;
