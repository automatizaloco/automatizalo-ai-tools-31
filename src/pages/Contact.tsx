import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";
import { useContactInfo } from "@/stores/contactInfoStore";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { contactInfo, updateContactInfo } = useContactInfo();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://juwbamkqkawyibcvllvo.supabase.co/functions/v1/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      toast.success(t('contact.form.success'));
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className={`text-4xl font-heading font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {isAuthenticated ? (
                <EditableText 
                  id="contact-title"
                  defaultText={t('contact.title')}
                />
              ) : (
                t('contact.title')
              )}
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {isAuthenticated ? (
                <EditableText 
                  id="contact-subtitle"
                  defaultText={t('contact.subtitle')}
                />
              ) : (
                t('contact.subtitle')
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {isAuthenticated ? (
                  <EditableText 
                    id="contact-info-title"
                    defaultText={t('contact.title')}
                  />
                ) : (
                  t('contact.title')
                )}
              </h2>
              
              <div className="space-y-6 text-left">
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-phone-label"
                          defaultText={t('contact.phone')}
                        />
                      ) : (
                        t('contact.phone')
                      )}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-phone-value"
                          defaultText={contactInfo.phone}
                          onSave={(value) => handleContactInfoChange('contact-phone-value', value)}
                        />
                      ) : (
                        contactInfo.phone
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-email-label"
                          defaultText={t('contact.email')}
                        />
                      ) : (
                        t('contact.email')
                      )}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-email-value"
                          defaultText={contactInfo.email}
                          onSave={(value) => handleContactInfoChange('contact-email-value', value)}
                        />
                      ) : (
                        contactInfo.email
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-address-label"
                          defaultText={t('contact.address')}
                        />
                      ) : (
                        t('contact.address')
                      )}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-address-value"
                          defaultText={contactInfo.address}
                          onSave={(value) => handleContactInfoChange('contact-address-value', value)}
                          multiline={true}
                        />
                      ) : (
                        contactInfo.address
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-website-label"
                          defaultText="Website"
                        />
                      ) : (
                        "Website"
                      )}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-website-value"
                          defaultText={contactInfo.website}
                          onSave={(value) => handleContactInfoChange('contact-website-value', value)}
                        />
                      ) : (
                        contactInfo.website
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {isAuthenticated ? (
                    <EditableText 
                      id="contact-connect-title"
                      defaultText="Connect with us"
                    />
                  ) : (
                    "Connect with us"
                  )}
                </h3>
                <div className="flex space-x-4">
                  <a 
                    href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" className={theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-100'}>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-whatsapp-button"
                          defaultText={t('contact.whatsapp')}
                        />
                      ) : (
                        t('contact.whatsapp')
                      )}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            <div className={`p-8 rounded-2xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {isAuthenticated ? (
                  <EditableText 
                    id="contact-form-title"
                    defaultText={t('contact.form.submit')}
                  />
                ) : (
                  t('contact.form.submit')
                )}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {isAuthenticated ? (
                      <EditableText 
                        id="contact-form-name-label"
                        defaultText={t('contact.form.name')}
                      />
                    ) : (
                      t('contact.form.name')
                    )}
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
                    {isAuthenticated ? (
                      <EditableText 
                        id="contact-form-email-label"
                        defaultText={t('contact.form.email')}
                      />
                    ) : (
                      t('contact.form.email')
                    )}
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
                    {isAuthenticated ? (
                      <EditableText 
                        id="contact-form-subject-label"
                        defaultText="Subject"
                      />
                    ) : (
                      "Subject"
                    )}
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
                    {isAuthenticated ? (
                      <EditableText 
                        id="contact-form-message-label"
                        defaultText={t('contact.form.message')}
                      />
                    ) : (
                      t('contact.form.message')
                    )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('contact.form.submitting')}
                    </div>
                  ) : (
                    isAuthenticated ? (
                      <EditableText 
                        id="contact-form-submit-button"
                        defaultText={t('contact.form.submit')}
                      />
                    ) : (
                      t('contact.form.submit')
                    )
                  )}
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
