
import { Brain, Bot, Zap, Sparkles, BarChart, Clock, Shield, Users, MessageSquare, FileText, Cog, Database } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SolutionCard from "@/components/ui/SolutionCard";
import ProductFeature from "@/components/solutions/ProductFeature";
import { Button } from "@/components/ui/button";

const Solutions = () => {
  // Solution Cards Data
  const solutionCards = [
    {
      title: "AI Workflow Automation",
      description: "Streamline your business processes with intelligent automation",
      icon: <Zap className="h-5 w-5" />,
      features: [
        "Automate repetitive tasks",
        "Integrate with existing systems",
        "Reduce operational costs",
        "Increase productivity"
      ],
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Conversational AI",
      description: "Enhance customer experiences with intelligent virtual assistants",
      icon: <MessageSquare className="h-5 w-5" />,
      features: [
        "24/7 customer support",
        "Natural language processing",
        "Multi-channel deployment",
        "Continuous learning"
      ],
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Data Intelligence",
      description: "Transform your data into actionable business insights",
      icon: <Database className="h-5 w-5" />,
      features: [
        "Advanced analytics",
        "Predictive modeling",
        "Customizable dashboards",
        "Real-time monitoring"
      ],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Features for each product
  const aiWorkflowFeatures = [
    {
      icon: <Bot className="h-5 w-5 text-gray-700" />,
      title: "Intelligent Automation",
      description: "Leverage AI to automate complex business processes, reducing manual effort and increasing accuracy."
    },
    {
      icon: <Cog className="h-5 w-5 text-gray-700" />,
      title: "Process Optimization",
      description: "Analyze and optimize workflows to eliminate bottlenecks and improve operational efficiency."
    },
    {
      icon: <FileText className="h-5 w-5 text-gray-700" />,
      title: "Document Processing",
      description: "Extract, classify, and process information from documents using advanced OCR and AI technologies."
    },
    {
      icon: <Zap className="h-5 w-5 text-gray-700" />,
      title: "API Integrations",
      description: "Seamlessly connect with your existing business systems through our extensive API ecosystem."
    }
  ];

  const conversationalAIFeatures = [
    {
      icon: <MessageSquare className="h-5 w-5 text-gray-700" />,
      title: "Virtual Assistants",
      description: "Deploy intelligent chatbots that understand natural language and provide helpful responses."
    },
    {
      icon: <Brain className="h-5 w-5 text-gray-700" />,
      title: "NLP Capabilities",
      description: "Advanced natural language processing to understand context, intent, and sentiment."
    },
    {
      icon: <Sparkles className="h-5 w-5 text-gray-700" />,
      title: "Contextual Awareness",
      description: "Maintain conversation context for more natural and meaningful interactions."
    },
    {
      icon: <Users className="h-5 w-5 text-gray-700" />,
      title: "Human Handoff",
      description: "Seamless transition to human agents when complex issues require personal attention."
    }
  ];

  const dataIntelligenceFeatures = [
    {
      icon: <Database className="h-5 w-5 text-gray-700" />,
      title: "Data Integration",
      description: "Collect and unify data from multiple sources to create a comprehensive view of your business."
    },
    {
      icon: <BarChart className="h-5 w-5 text-gray-700" />,
      title: "Predictive Analytics",
      description: "Forecast trends and anticipate business outcomes using advanced machine learning models."
    },
    {
      icon: <Clock className="h-5 w-5 text-gray-700" />,
      title: "Real-time Insights",
      description: "Monitor business metrics in real-time to make quick, data-driven decisions."
    },
    {
      icon: <Shield className="h-5 w-5 text-gray-700" />,
      title: "Secure Architecture",
      description: "Enterprise-grade security to protect your sensitive business data at all times."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              AI Solutions for Modern Businesses
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
              Harness the power of artificial intelligence and automation to transform your business operations,
              enhance customer experiences, and drive growth.
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 py-6 px-8 rounded-xl text-base">
              Explore Solutions
            </Button>
          </div>
          
          {/* Main Solutions */}
          <div className="mb-24">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
              Our Core Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionCards.map((solution, index) => (
                <SolutionCard
                  key={index}
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
          </div>
          
          {/* AI Workflow Automation Section */}
          <div className="mb-24 scroll-mt-24" id="ai-workflow">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  AI Workflow Automation
                </h2>
                <p className="text-gray-600 mb-6">
                  Transform your business operations with intelligent automation that reduces manual effort, 
                  minimizes errors, and accelerates processes. Our AI workflow solutions adapt to your 
                  unique business needs and integrate seamlessly with your existing systems.
                </p>
                <p className="text-gray-600 mb-8">
                  From simple task automation to complex business process orchestration, our platform 
                  provides the tools you need to achieve operational excellence.
                </p>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Learn More
                </Button>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="AI Workflow Automation" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiWorkflowFeatures.map((feature, index) => (
                <ProductFeature 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          {/* Conversational AI Section */}
          <div className="mb-24 scroll-mt-24" id="conversational-ai">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  Conversational AI
                </h2>
                <p className="text-gray-600 mb-6">
                  Enhance customer experiences with intelligent virtual assistants that understand 
                  natural language and provide helpful, contextually relevant responses. Our conversational 
                  AI solutions can be deployed across multiple channels to provide consistent, 24/7 support.
                </p>
                <p className="text-gray-600 mb-8">
                  From simple FAQ bots to sophisticated virtual agents capable of handling complex 
                  interactions, our platform adapts to your specific communication needs.
                </p>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Learn More
                </Button>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Conversational AI" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conversationalAIFeatures.map((feature, index) => (
                <ProductFeature 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          {/* Data Intelligence Section */}
          <div className="mb-24 scroll-mt-24" id="data-intelligence">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                  Data Intelligence
                </h2>
                <p className="text-gray-600 mb-6">
                  Transform your data into actionable business insights with our advanced analytics 
                  and machine learning solutions. Our data intelligence platform helps you uncover 
                  patterns, predict trends, and make data-driven decisions with confidence.
                </p>
                <p className="text-gray-600 mb-8">
                  From basic reporting to sophisticated predictive models, our solutions scale to 
                  meet your specific data analysis needs while maintaining the highest standards 
                  of security and compliance.
                </p>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Learn More
                </Button>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Data Intelligence" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataIntelligenceFeatures.map((feature, index) => (
                <ProductFeature 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gray-50 rounded-2xl p-10 lg:p-16 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our team of experts to learn how our AI solutions can be tailored to your 
              specific business needs and objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gray-900 hover:bg-gray-800 py-6 px-8 rounded-xl text-base">
                Request Demo
              </Button>
              <Button variant="outline" className="border-gray-300 py-6 px-8 rounded-xl text-base">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Solutions;
