
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es, fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { contactInfo, loading } = useContactInfo();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [meetingConfirmed, setMeetingConfirmed] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const getNextFriday = () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilFriday = day <= 5 ? 5 - day : 5 + (7 - day);
    
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    nextFriday.setHours(14, 0, 0, 0);
    
    return nextFriday;
  };

  const meetingDate = getNextFriday();
  
  const getMeetingDateString = () => {
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'es-ES', dateOptions).format(meetingDate);
  };

  const meetingDateString = getMeetingDateString();

  const formatDateForLanguage = (date: Date, lang: string) => {
    if (lang === 'fr') {
      return format(date, "EEEE d MMMM 'à' HH'h'mm", { locale: fr });
    } else if (lang === 'es') {
      return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } else {
      return format(date, "EEEE, MMMM d 'at' h:mm a");
    }
  };

  const chatMessages = {
    en: [
      { sender: 'user', message: 'Hello, I need information about your services.' },
      { sender: 'bot', message: 'Hi there! I\'d be happy to help. What specific service are you interested in?' },
      { sender: 'user', message: 'Can you schedule a demo for me?' },
      { sender: 'bot', message: 'Of course! I can schedule a demo for you. What day works best for you?' },
      { sender: 'user', message: 'How about Friday afternoon?' },
      { sender: 'bot', message: `Perfect! I've scheduled a demo for ${formatDateForLanguage(meetingDate, 'en')}. You'll receive a calendar invitation shortly.` }
    ],
    fr: [
      { sender: 'user', message: 'Bonjour, j\'ai besoin d\'informations sur vos services.' },
      { sender: 'bot', message: 'Salut! Je serais ravi de vous aider. Quel service spécifique vous intéresse?' },
      { sender: 'user', message: 'Pouvez-vous programmer une démo pour moi?' },
      { sender: 'bot', message: 'Bien sûr! Je peux programmer une démo pour vous. Quel jour vous convient le mieux?' },
      { sender: 'user', message: 'Que diriez-vous de vendredi après-midi?' },
      { sender: 'bot', message: `Parfait! J'ai programmé une démo pour ${formatDateForLanguage(meetingDate, 'fr')}. Vous recevrez une invitation à votre calendrier sous peu.` }
    ],
    es: [
      { sender: 'user', message: 'Hola, necesito información sobre sus servicios.' },
      { sender: 'bot', message: '¡Hola! Estaré encantado de ayudarte. ¿En qué servicio específico estás interesado?' },
      { sender: 'user', message: '¿Pueden programar una demo para mí?' },
      { sender: 'bot', message: '¡Por supuesto! Puedo programar una demo para ti. ¿Qué día te funciona mejor?' },
      { sender: 'user', message: '¿Qué tal el viernes por la tarde?' },
      { sender: 'bot', message: `¡Perfecto! He programado una demo para el ${formatDateForLanguage(meetingDate, 'es')}. Recibirás una invitación para tu calendario en breve.` }
    ]
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentMessageIndex, showTyping]);

  // Continuous automatic animation loop
  useEffect(() => {
    const animationHandler = () => {
      if (currentMessageIndex < chatMessages[language || 'en'].length) {
        setShowTyping(true);
        
        const typingDelay = chatMessages[language || 'en'][currentMessageIndex].sender === 'bot' ? 1500 : 800;
        
        const typingTimer = setTimeout(() => {
          setShowTyping(false);
          
          const messageTimer = setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
            
            if (currentMessageIndex === chatMessages[language || 'en'].length - 1) {
              setMeetingConfirmed(true);
            }
          }, 300);
          
          return () => clearTimeout(messageTimer);
        }, typingDelay);
        
        return () => clearTimeout(typingTimer);
      } else {
        // Reset the animation after a short pause
        const resetTimer = setTimeout(() => {
          setCurrentMessageIndex(0);
          setMeetingConfirmed(false);
        }, 3000);
        
        return () => clearTimeout(resetTimer);
      }
    };
    
    const animation = animationHandler();
    
    // Ensure animation restarts when language changes
    return () => {
      if (animation) animation();
    };
  }, [currentMessageIndex, language]);

  const currentLanguageKey = language || 'en';
  const messages = chatMessages[currentLanguageKey as keyof typeof chatMessages] || chatMessages.en;

  const handleChatWithUs = () => {
    const cleanPhone = contactInfo.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `${t('contact.whatsapp.defaultMessage') || "Hello, I would like to know more about your services"}`
    );
    
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const meetingUrl = "https://meet.automatizalo.com/" + Math.random().toString(36).substring(2, 10);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ContactHeader />
          
          <div className="max-w-6xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {!loading && <ContactInfo />}
              </div>
              
              <div className="p-8 rounded-2xl shadow-sm text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <h2 className={`text-2xl font-heading font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {t('contact.whatsapp.title') || "Let Our WhatsApp Bot Assist You 24/7"}
                </h2>
                <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('contact.whatsapp.description') || "Get instant responses through our WhatsApp business account."}
                </p>
                
                <div className="mb-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-green-500 p-3 flex items-center">
                    <MessageCircle className="text-white mr-2" size={20} />
                    <span className="text-white font-medium">Automatízalo WhatsApp</span>
                  </div>
                  
                  <div 
                    ref={chatContainerRef}
                    className="p-4 h-60 overflow-hidden flex flex-col space-y-3"
                  >
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
                    
                    {currentMessageIndex >= messages.length && (
                      <div className="mt-4">
                        <Card className="border border-green-200 dark:border-green-800">
                          <CardHeader className="bg-green-50 dark:bg-green-900/30 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center text-green-800 dark:text-green-300">
                              <Calendar className="mr-2" size={16} />
                              {t('contact.calendar.invitation') || "Calendar Invitation"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-3 pb-4">
                            <div className="text-left space-y-2">
                              <p className="text-sm font-medium">{t('contact.calendar.title') || "Demo"}</p>
                              <p className="text-xs flex items-start">
                                <Calendar className="mr-2 mt-0.5 shrink-0" size={12} />
                                <span>{meetingDateString}</span>
                              </p>
                              <p className="text-xs flex items-start">
                                <Video className="mr-2 mt-0.5 shrink-0" size={12} />
                                <span className="text-blue-600 dark:text-blue-400 underline">{meetingUrl}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('contact.whatsapp.cta') || "Connect with us for fast responses and personalized assistance!"}
                </p>
                
                <Button 
                  onClick={handleChatWithUs}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  {t('contact.whatsapp.chat') || "Chat with us"}
                </Button>
              </div>
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
