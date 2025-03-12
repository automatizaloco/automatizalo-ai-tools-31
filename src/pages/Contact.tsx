
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { contactInfo, updateContactInfo } = useContactInfo();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  const handleContactInfoChange = (id: string, value: string) => {
    const fieldMap: Record<string, keyof typeof contactInfo> = {
      'contact-phone-value': 'phone',
      'contact-email-value': 'email',
      'contact-address-value': 'address',
      'contact-website-value': 'website'
    };
    
    if (id in fieldMap) {
      updateContactInfo({ [fieldMap[id]]: value });
    }
  };

  // Chat simulation messages in all three languages
  const chatMessages = {
    en: [
      { sender: 'user', message: 'Hello, I need information about your services.' },
      { sender: 'bot', message: 'Hi there! I\'d be happy to help. What specific service are you interested in?' },
      { sender: 'user', message: 'Can you schedule a demo for me?' },
      { sender: 'bot', message: 'Of course! I can schedule a demo for you. What day works best for you?' },
      { sender: 'user', message: 'How about Friday afternoon?' },
      { sender: 'bot', message: 'Perfect! I\'ve scheduled a demo for this Friday at 2:00 PM. You\'ll receive a confirmation email shortly.' }
    ],
    fr: [
      { sender: 'user', message: 'Bonjour, j\'ai besoin d\'informations sur vos services.' },
      { sender: 'bot', message: 'Salut! Je serais ravi de vous aider. Quel service spécifique vous intéresse?' },
      { sender: 'user', message: 'Pouvez-vous programmer une démo pour moi?' },
      { sender: 'bot', message: 'Bien sûr! Je peux programmer une démo pour vous. Quel jour vous convient le mieux?' },
      { sender: 'user', message: 'Que diriez-vous de vendredi après-midi?' },
      { sender: 'bot', message: 'Parfait! J\'ai programmé une démo pour ce vendredi à 14h00. Vous recevrez un email de confirmation sous peu.' }
    ],
    es: [
      { sender: 'user', message: 'Hola, necesito información sobre sus servicios.' },
      { sender: 'bot', message: '¡Hola! Estaré encantado de ayudarte. ¿En qué servicio específico estás interesado?' },
      { sender: 'user', message: '¿Pueden programar una demo para mí?' },
      { sender: 'bot', message: '¡Por supuesto! Puedo programar una demo para ti. ¿Qué día te funciona mejor?' },
      { sender: 'user', message: '¿Qué tal el viernes por la tarde?' },
      { sender: 'bot', message: '¡Perfecto! He programado una demo para este viernes a las 14:00. Recibirás un correo de confirmación en breve.' }
    ]
  };

  // Animation effect for the chat
  useEffect(() => {
    if (currentMessageIndex < chatMessages[t('language') || 'en'].length) {
      // Show typing indicator
      setShowTyping(true);
      
      // Delay for typing effect
      const typingDelay = chatMessages[t('language') || 'en'][currentMessageIndex].sender === 'bot' ? 1500 : 800;
      
      const typingTimer = setTimeout(() => {
        setShowTyping(false);
        
        // Delay before showing the next message
        const messageTimer = setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
        }, 300);
        
        return () => clearTimeout(messageTimer);
      }, typingDelay);
      
      return () => clearTimeout(typingTimer);
    } else {
      // Reset the animation after it completes
      const resetTimer = setTimeout(() => {
        setCurrentMessageIndex(0);
      }, 3000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [currentMessageIndex, t]);

  const currentLanguageKey = t('language') || 'en';
  const messages = chatMessages[currentLanguageKey as keyof typeof chatMessages] || chatMessages.en;

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ContactHeader />
          
          <div className="max-w-4xl mx-auto">
            <ContactInfo handleContactInfoChange={handleContactInfoChange} />
            
            <div className="mt-12 p-8 rounded-2xl shadow-sm text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <h2 className={`text-2xl font-heading font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {t('contact.whatsapp.title') || "Chat with us on WhatsApp"}
              </h2>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('contact.whatsapp.description') || "Get instant responses through our WhatsApp business account. Our team is ready to assist you with any questions or inquiries."}
              </p>
              
              {/* WhatsApp Chat Animation */}
              <div className="mb-10 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                {/* Chat Header */}
                <div className="bg-green-500 p-3 flex items-center">
                  <MessageCircle className="text-white mr-2" size={20} />
                  <span className="text-white font-medium">Automatízalo WhatsApp</span>
                </div>
                
                {/* Chat Messages */}
                <div className="p-4 h-80 overflow-y-auto flex flex-col space-y-3" style={{ minHeight: "320px" }}>
                  {messages.slice(0, currentMessageIndex).map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md p-3 rounded-lg animate-fade-in ${
                          msg.sender === 'user' 
                            ? 'bg-green-100 dark:bg-green-800 text-gray-800 dark:text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {showTyping && (
                    <div className={`flex ${messages[currentMessageIndex]?.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-lg ${
                        messages[currentMessageIndex]?.sender === 'user' 
                          ? 'bg-green-50 dark:bg-green-900/30 text-gray-500 dark:text-gray-400' 
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                      }`}>
                        <div className="flex space-x-1">
                          <div className="animate-pulse h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                          <div className="animate-pulse delay-100 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                          <div className="animate-pulse delay-200 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('contact.whatsapp.cta') || "Connect with us now for fast responses, meeting scheduling, and personalized assistance!"}
              </p>
              
              {/* Fixed WhatsApp button at the bottom right */}
              <WhatsAppButton 
                phoneNumber={contactInfo.phone}
                message={t('contact.whatsapp.defaultMessage') || "Hello, I would like to know more about your services"}
              />
              
              {/* Inline WhatsApp button */}
              <Button 
                onClick={() => {
                  const cleanPhone = contactInfo.phone.replace(/\D/g, '');
                  const message = encodeURIComponent(t('contact.whatsapp.defaultMessage') || "Hello, I would like to know more about your services");
                  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                }}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-200 inline-flex items-center gap-2"
              >
                <MessageCircle size={20} />
                {t('contact.whatsapp') || "Chat on WhatsApp"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Contact;
