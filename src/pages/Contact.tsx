
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactHeader from "@/components/contact/ContactHeader";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { useEffect } from "react";

const Contact = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { fetchContactInfo } = useContactInfo();
  
  // Fetch contact info when the page loads
  useEffect(() => {
    console.log("Contact page: Fetching contact info");
    fetchContactInfo();
  }, [fetchContactInfo]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />
      
      {/* Main content */}
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <ContactHeader />
          
          {/* Contact Form and Info */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ContactInfo />
              </div>
              
              <div className="p-8 rounded-2xl shadow-sm text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {t('contact.form.title')}
                </h2>
                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('contact.form.subtitle')}
                </p>
                
                <ContactForm />
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
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
