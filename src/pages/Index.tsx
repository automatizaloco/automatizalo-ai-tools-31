
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, PieChart, Smartphone, Zap, Brain, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import SolutionCard from '@/components/ui/SolutionCard';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const solutions = [
    {
      id: "chatbots",
      title: "Chatbots & AI Assistants",
      description: "Personalized chatbots to handle customer service, scheduling, lead engagement, and more.",
      icon: <MessageSquare size={24} />,
      features: [
        "AI chatbots tailored for businesses",
        "WhatsApp, email & social media integration",
        "24/7 automated responses"
      ],
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "lead-generation",
      title: "Lead Generation & Smart Follow-Up",
      description: "We find leads, engage them, and keep the conversation going until you get the information you need.",
      icon: <PieChart size={24} />,
      features: [
        "Automated prospecting & qualification",
        "Personalized email follow-ups",
        "AI-driven conversation handling"
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "social-media",
      title: "Social Media & Content Creation",
      description: "Let AI generate posts, blogs, Instagram stories, and social content for you.",
      icon: <Smartphone size={24} />,
      features: [
        "AI-generated Instagram stories & posts",
        "Blog & article creation",
        "Multi-platform content scheduling"
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "ai-agents",
      title: "Personal AI Agents",
      description: "Your own AI-powered virtual assistant to streamline daily tasks, manage emails, organize meetings, and more.",
      icon: <Brain size={24} />,
      features: [
        "Connects to emails, calendar & WhatsApp",
        "For businesses and individuals",
        "Learns & optimizes continuously"
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
        
        {/* Solutions Section */}
        <section className="py-16 md:py-24 bg-blue-50/50">
          <div className="container mx-auto px-4 md:px-8">
            <div className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
                Our Solutions
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                AI-Powered Services for Every Business & Individual
              </h2>
              <p className="text-gray-600">
                At Automatízalo, we connect and automate your workflows using cutting-edge AI and automation tools to help you work smarter.
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
                  View All Solutions
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-automatizalo-blue/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-automatizalo-blue/20 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Future-Proof Your Business with AI
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Let's build the AI-driven future together. Our team of AI specialists and automation experts is ready to help you integrate AI into your life or business.
              </p>
              <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 px-8 py-6 h-auto text-base transition-all duration-300 rounded-xl" size="lg">
                Talk to Us About Custom AI Solutions
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                What Our Clients Say
              </h2>
              <p className="text-gray-600">
                Discover how Automatízalo has helped businesses and individuals transform their workflows and productivity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item} 
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-6 italic">
                    "Automatízalo has completely transformed how we handle customer inquiries. Their AI chatbot solution has reduced response times by 80% and allowed our team to focus on complex issues. The ROI has been incredible."
                  </p>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Client {item}</h4>
                      <p className="text-sm text-gray-500">CEO, Tech Company</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
