
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, PieChart, Smartphone, Zap, Brain, Bot, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Solutions = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Set initial scroll position to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const solutions = [
    {
      id: "chatbots",
      category: "chatbots",
      title: "Chatbots & AI Assistants",
      description: "Personalized chatbots to handle customer service, scheduling, lead engagement, and more.",
      icon: <MessageSquare size={24} />,
      features: [
        "AI chatbots tailored for businesses",
        "WhatsApp, email & social media integration",
        "24/7 automated responses",
        "Multi-language support",
        "Customizable conversation flows",
        "Analytics and performance tracking"
      ],
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "lead-generation",
      category: "leads",
      title: "Lead Generation & Smart Follow-Up",
      description: "We find leads, engage them, and keep the conversation going until you get the information you need.",
      icon: <PieChart size={24} />,
      features: [
        "Automated prospecting & qualification",
        "Personalized email follow-ups",
        "AI-driven conversation handling",
        "CRM integration",
        "Lead scoring and prioritization",
        "Conversion optimization"
      ],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "social-media",
      category: "content",
      title: "Social Media & Content Creation",
      description: "Let AI generate posts, blogs, Instagram stories, and social content for you.",
      icon: <Smartphone size={24} />,
      features: [
        "AI-generated Instagram stories & posts",
        "Blog & article creation",
        "Multi-platform content scheduling",
        "Content performance analytics",
        "Brand voice customization",
        "SEO optimization"
      ],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "ai-agents",
      category: "agents",
      title: "Personal AI Agents",
      description: "Your own AI-powered virtual assistant to streamline daily tasks, manage emails, organize meetings, and more.",
      icon: <Brain size={24} />,
      features: [
        "Connects to emails, calendar & WhatsApp",
        "For businesses and individuals",
        "Learns & optimizes continuously",
        "Task prioritization",
        "Meeting scheduling and reminders",
        "Document summarization"
      ],
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "workflow-automation",
      category: "automation",
      title: "Workflow Automation",
      description: "Connect and automate your business processes across multiple platforms and applications.",
      icon: <Zap size={24} />,
      features: [
        "Make.com & N8N integration",
        "Custom automation workflows",
        "API connections",
        "Data synchronization",
        "Trigger-based actions",
        "Error handling and notifications"
      ],
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "customer-support",
      category: "chatbots",
      title: "Automated Customer Support",
      description: "Provide instant support to your customers with AI-powered assistants that learn from each interaction.",
      icon: <Bot size={24} />,
      features: [
        "24/7 customer support automation",
        "Knowledge base integration",
        "Ticket creation and routing",
        "Sentiment analysis",
        "Multilingual support",
        "Continuous learning and improvement"
      ],
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "data-analytics",
      category: "leads",
      title: "AI-Powered Analytics",
      description: "Transform your data into actionable insights with advanced analytics and visualization tools.",
      icon: <BarChart3 size={24} />,
      features: [
        "Custom dashboards and reports",
        "Predictive analytics",
        "Data visualization",
        "Business intelligence",
        "Trend analysis",
        "Real-time monitoring"
      ],
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "document-automation",
      category: "content",
      title: "Document Automation",
      description: "Automate document creation, processing, and analysis to save time and reduce errors.",
      icon: <FileText size={24} />,
      features: [
        "Template-based document generation",
        "PDF processing and extraction",
        "Contract analysis",
        "Document classification",
        "Digital signatures integration",
        "Document workflow automation"
      ],
      imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const categories = [
    { id: "all", label: "All Solutions" },
    { id: "chatbots", label: "Chatbots" },
    { id: "leads", label: "Lead Generation" },
    { id: "content", label: "Content Creation" },
    { id: "agents", label: "AI Agents" },
    { id: "automation", label: "Workflow Automation" }
  ];

  const filteredSolutions = activeTab === "all" 
    ? solutions 
    : solutions.filter(solution => solution.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block py-1 px-3 mb-4 bg-blue-100 text-automatizalo-blue rounded-full text-sm font-medium">
                Our Solutions
              </span>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                AI-Powered Services for Every Business & Individual
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                At Automatízalo, we connect and automate your workflows using cutting-edge AI and automation tools to help you work smarter, grow faster, and stay ahead of the future.
              </p>
              
              <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 transition-all duration-300 rounded-xl">
                Get Started
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Solutions Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center mb-12 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm transition-all
                    ${activeTab === category.id
                      ? 'bg-automatizalo-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            {/* Solutions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSolutions.map((solution, index) => (
                <div
                  key={solution.id}
                  id={solution.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={solution.imageUrl}
                      alt={solution.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-50 p-2 rounded-lg text-automatizalo-blue mr-3">
                        {solution.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{solution.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-5">{solution.description}</p>
                    
                    <ul className="space-y-2 mb-8">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-automatizalo-blue shrink-0 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full bg-automatizalo-blue hover:bg-automatizalo-blue/90 transition-all duration-300 rounded-xl">
                      Learn More
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                    Ready to Transform Your Workflows?
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    Our team of AI specialists and automation experts is ready to help you integrate AI into your life or business.
                  </p>
                  
                  <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 transition-all duration-300 rounded-xl">
                    Contact Us Today
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
                
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
                    alt="Contact Us"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  
                  <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-automatizalo-blue h-10 w-10 rounded-full flex items-center justify-center text-white mr-3">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Fast Implementation</p>
                        <p className="text-sm text-gray-600">Get started in days, not months</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Solutions;
