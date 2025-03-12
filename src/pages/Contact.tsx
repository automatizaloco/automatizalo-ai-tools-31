
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";

const Contact = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { contactInfo, updateContactInfo } = useContactInfo();

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
              <WhatsAppButton 
                phoneNumber={contactInfo.phone}
                message={t('contact.whatsapp.defaultMessage') || "Hello, I would like to know more about your services"}
              />
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

