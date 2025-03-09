
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const Contact = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactInfo, setContactInfo] = useState({
    phone: "+1 (555) 123-4567",
    email: "contact@automatizalo.co",
    address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
    website: "https://automatizalo.co"
  });

  // Fetch contact information from localStorage (saved from ContentManager)
  useEffect(() => {
    try {
      const savedContactContent = localStorage.getItem('contactContent');
      if (savedContactContent) {
        setContactInfo(JSON.parse(savedContactContent));
      }
    } catch (error) {
      console.error("Error loading contact information:", error);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    // Show success message to user
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className={`text-4xl font-heading font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{t('contact.title')}</h1>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('contact.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{t('contact.title')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('contact.phone')}</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('contact.email')}</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{contactInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{t('contact.address')}</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Website</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{contactInfo.website}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Connect with us</h3>
                <div className="flex space-x-4">
                  <a 
                    href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" className={theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-100'}>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className={`p-8 rounded-2xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{t('contact.form.submit')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' 
                        : 'border-gray-300 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' 
                        : 'border-gray-300 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' 
                        : 'border-gray-300 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' 
                        : 'border-gray-300 focus:ring-gray-500'
                    }`}
                    required
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className={theme === 'dark' ? 'w-full py-3 bg-blue-600 hover:bg-blue-700' : 'w-full py-3 bg-gray-900 hover:bg-gray-800'}
                >
                  {t('contact.form.submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
