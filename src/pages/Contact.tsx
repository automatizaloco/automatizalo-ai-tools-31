
import { useTheme } from "@/context/ThemeContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  const { theme } = useTheme();
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactInfo handleContactInfoChange={handleContactInfoChange} />
            <ContactForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
