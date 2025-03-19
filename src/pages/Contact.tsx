
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactHeader from "@/components/contact/ContactHeader";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { fetchContactInfo, contactInfo } = useContactInfo();
  
  // Fetch contact info when the page loads
  useEffect(() => {
    console.log("Contact page: Fetching contact info");
    fetchContactInfo();
  }, [fetchContactInfo]);

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
                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('contact.whatsapp.description')}
                </p>
                
                {/* WhatsApp Animation */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6"
                  >
                    <motion.div
                      className="absolute inset-0 bg-[#25D366] rounded-full"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "loop"
                      }}
                      style={{ opacity: 0.3 }}
                    />
                    <motion.div
                      className="relative bg-[#25D366] text-white p-6 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <MessageCircle size={48} />
                    </motion.div>
                  </motion.div>
                  
                  <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('contact.whatsapp.cta')}
                  </p>
                  
                  <Button 
                    onClick={handleChatClick}
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg"
                  >
                    <MessageCircle className="mr-2" size={20} />
                    {t('contact.whatsapp.chat')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="rounded-2xl overflow-hidden shadow-md h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63458.37661082223!2d-75.61074418719115!3d6.24439868254899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb80fad05%3A0x42137cfcc7b53b56!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1sen!2sco!4v1697675316120!5m2!1sen!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
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
