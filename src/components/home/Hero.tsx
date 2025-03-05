
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Animation sequence timer
    const animationInterval = setInterval(() => {
      setAnimationStep(prev => (prev >= 4 ? 0 : prev + 1));
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(animationInterval);
    };
  }, []);

  // Animation steps for the process automation
  const automationSteps = [
    { title: "Step 1: Voice Command", content: "User speaks prompt: 'Create a post about our new product launch'" },
    { title: "Step 2: AI Processing", content: "AI analyzes request and generates optimized content for multiple platforms" },
    { title: "Step 3: Content Creation", content: "Generates tailored content for Instagram, Twitter, LinkedIn and Facebook" },
    { title: "Step 4: Preview & Approval", content: "User reviews and approves with a single click" },
    { title: "Step 5: Multi-Platform Publishing", content: "Content automatically published across all social networks" }
  ];

  // Animation steps for the AI assistant
  const assistantSteps = [
    { title: "Email Management", content: "AI reads and categorizes emails, drafting responses for review" },
    { title: "Meeting Scheduling", content: "AI coordinates calendars and arranges meetings based on availability" },
    { title: "Task Automation", content: "AI handles follow-ups and sends reminders for pending tasks" },
    { title: "Research Assistant", content: "AI conducts research and prepares summaries on any topic" },
    { title: "Document Creation", content: "AI creates reports, presentations and documents based on instructions" }
  ];

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl opacity-30"></div>
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
                className="bg-gray-900 hover:bg-gray-800 px-6 text-base transition-all duration-300 rounded-xl h-12" 
                size="lg"
              >
                Get Started
                <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-800 hover:bg-gray-100 px-6 text-base transition-all duration-300 rounded-xl h-12" 
                size="lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Animation Card 1: Process Automation */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-1 border border-gray-100 w-full max-w-md">
              <div className="p-5 rounded-xl bg-gray-50">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Automation Process</h3>
                
                <div className="bg-white rounded-xl p-4 border border-gray-100 min-h-[160px] relative">
                  {automationSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`absolute inset-0 p-4 transition-all duration-500 flex flex-col ${
                        animationStep === index 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8 pointer-events-none'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{step.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4">
                  {automationSteps.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        animationStep === index ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Animation Card 2: AI Assistant */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-200">
              <h3 className="text-md font-semibold mb-2 text-gray-900">Personal AI Assistant</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{assistantSteps[animationStep % assistantSteps.length].title}</p>
                  <p className="text-xs text-gray-600">{assistantSteps[animationStep % assistantSteps.length].content}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
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
