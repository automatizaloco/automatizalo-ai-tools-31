
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className={`max-w-xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block py-1 px-3 mb-4 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              AI & Automation Solutions
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              Stop wasting time on repetitive tasks
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              <span className="font-semibold">Automatízalo</span> brings cutting-edge AI and automation tools to help you work smarter, grow faster, and stay ahead of the future.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 px-6 text-base transition-all duration-300 rounded-xl h-12" 
                size="lg"
              >
                Get Started
                <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-automatizalo-blue text-automatizalo-blue hover:bg-automatizalo-blue/5 px-6 text-base transition-all duration-300 rounded-xl h-12" 
                size="lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-1 border border-gray-100 w-full max-w-md">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800"
                  alt="AI Automation" 
                  className="w-full object-cover"
                />
              </div>
              
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Automation</h3>
                  <p className="text-white/90 text-sm">Streamline your workflows with intelligent automation</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-automatizalo-blue/10 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-automatizalo-blue h-10 w-10 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">AI-driven systems</p>
                  <p className="text-xs text-gray-600">24/7 automated workflows</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Save 30+ hours</p>
                  <p className="text-xs text-gray-600">per week with automation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
