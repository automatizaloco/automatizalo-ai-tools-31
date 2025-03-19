
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactHeader from "@/components/contact/ContactHeader";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Calendar, User, Bot, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define chat message types
interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const Contact = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { fetchContactInfo, contactInfo } = useContactInfo();
  const [chatComplete, setChatComplete] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Fetch contact info when the page loads
  useEffect(() => {
    console.log("Contact page: Fetching contact info");
    fetchContactInfo();
  }, [fetchContactInfo]);

  // Chat simulation logic
  useEffect(() => {
    if (!chatStarted) return;
    
    const steps = [
      // Initial greeting from bot
      () => {
        addMessage('bot', t('contact.chat.greeting'));
      },
      // User asking about services
      () => {
        setTimeout(() => {
          addMessage('user', t('contact.chat.askServices'));
        }, 1500);
      },
      // Bot explaining services
      () => {
        setTimeout(() => {
          addMessage('bot', t('contact.chat.explainServices'));
        }, 2000);
      },
      // User asking about meeting
      () => {
        setTimeout(() => {
          addMessage('user', t('contact.chat.askMeeting'));
        }, 2000);
      },
      // Bot confirming meeting
      () => {
        setTimeout(() => {
          addMessage('bot', t('contact.chat.confirmMeeting'));
        }, 2000);
      },
      // User confirming meeting time
      () => {
        setTimeout(() => {
          addMessage('user', t('contact.chat.acceptTime'));
        }, 2000);
      },
      // Bot final message
      () => {
        setTimeout(() => {
          addMessage('bot', t('contact.chat.scheduledSuccess'));
          setChatComplete(true);
        }, 2000);
      }
    ];

    if (currentStep < steps.length) {
      steps[currentStep]();
      setCurrentStep(currentStep + 1);
    }
  }, [chatStarted, currentStep, t]);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        sender,
        text,
        timestamp: `${hours}:${minutes}`
      }
    ]);
  };

  const handleStartChat = () => {
    setChatStarted(true);
  };

  const handleChatClick = () => {
    // Clean the phone number - remove any non-digit characters
    const phoneNumber = contactInfo.whatsapp || contactInfo.phone;
    const cleanPhone = phoneNumber?.replace(/\D/g, '') || '';
    const defaultMessage = t('contact.whatsapp.defaultMessage');
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Main content */}
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <ContactHeader />
          
          {/* Contact Info and WhatsApp Animation */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ContactInfo />
              </div>
              
              <div className="p-8 rounded-2xl shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {t('contact.whatsapp.title')}
                </h2>
                
                {/* Chat Simulation */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-[#075E54] text-white p-3 flex items-center">
                    <div className="mr-3 bg-gray-200 rounded-full p-1">
                      <Bot size={24} className="text-[#075E54]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Automatizalo AI</h3>
                      <p className="text-xs opacity-80">{chatStarted ? t('contact.chat.online') : t('contact.chat.available')}</p>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="p-4 h-80 overflow-y-auto bg-[#E5DDD5] dark:bg-gray-700">
                    {!chatStarted ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                          {t('contact.chat.startPrompt')}
                        </p>
                        <Button 
                          onClick={handleStartChat}
                          className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                        >
                          <MessageCircle className="mr-2" size={16} />
                          {t('contact.chat.startButton')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg px-3 py-2 relative ${
                                msg.sender === 'user' 
                                  ? 'bg-[#DCF8C6] dark:bg-green-700 dark:text-white mr-2' 
                                  : 'bg-white dark:bg-gray-600 dark:text-white ml-2'
                              }`}
                            >
                              <div className="flex items-center mb-1">
                                {msg.sender === 'user' ? (
                                  <User size={14} className="mr-1 text-gray-600 dark:text-gray-300" />
                                ) : (
                                  <Bot size={14} className="mr-1 text-gray-600 dark:text-gray-300" />
                                )}
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                  {msg.sender === 'user' ? t('contact.chat.you') : 'Automatizalo AI'}
                                </span>
                              </div>
                              <p className="text-sm">{msg.text}</p>
                              <div className="text-right">
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                                  <Clock size={10} />
                                  {msg.timestamp}
                                  {msg.sender === 'user' && (
                                    <CheckCircle2 size={10} className="text-blue-500" />
                                  )}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Animation when chat is complete */}
                        {chatComplete && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                            className="flex justify-center mt-4"
                          >
                            <div className="bg-white dark:bg-gray-600 rounded-lg p-3 shadow-md text-center">
                              <Calendar className="mx-auto mb-2 text-[#25D366]" size={24} />
                              <p className="text-sm font-medium dark:text-white">
                                {t('contact.chat.meetingScheduled')}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('contact.whatsapp.cta')}
                </p>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleChatClick}
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg"
                  >
                    <MessageCircle className="mr-2" size={20} />
                    {t('contact.chat.chatWithUs')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
