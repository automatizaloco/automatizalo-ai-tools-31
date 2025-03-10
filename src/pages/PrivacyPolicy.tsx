
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Info } from "lucide-react";
import EditableText from '@/components/admin/EditableText';

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [acceptAll, setAcceptAll] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  // Load cookie preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
      // If any non-necessary cookies are accepted, set acceptAll accordingly
      const parsedPrefs = JSON.parse(savedPreferences);
      if (parsedPrefs.functional || parsedPrefs.analytics || parsedPrefs.marketing) {
        setAcceptAll(true);
      }
    }
  }, []);

  // Save cookie preferences to localStorage
  const saveCookiePreferences = (newPreferences: typeof preferences) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    console.log('Cookie preferences saved:', newPreferences);
  };

  // Handle toggling all cookies
  const handleAcceptAllToggle = () => {
    const newState = !acceptAll;
    setAcceptAll(newState);
    
    const newPreferences = {
      ...preferences,
      functional: newState,
      analytics: newState,
      marketing: newState
    };
    
    saveCookiePreferences(newPreferences);
  };

  // Handle individual cookie preference changes
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    const newPreferences = { 
      ...preferences, 
      [key]: !preferences[key] 
    };
    
    saveCookiePreferences(newPreferences);
    
    // Update acceptAll state based on preferences
    if (key !== 'necessary') {
      setAcceptAll(
        newPreferences.functional && 
        newPreferences.analytics && 
        newPreferences.marketing
      );
    }
  };

  // Render email link safely
  const renderEmailLink = () => {
    return (
      <>
        If you have questions about our Privacy Policy, please contact us at{' '}
        <a href={`mailto:${t('contact.email')}`} className="text-blue-500 hover:underline">
          {t('contact.email')}
        </a>.
      </>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-36 pb-16">
        <h1 className="text-3xl font-bold mb-10">
          {isAuthenticated ? (
            <EditableText 
              id="legal-title"
              defaultText="Legal Information"
            />
          ) : (
            "Legal Information"
          )}
        </h1>
        
        <Tabs defaultValue="privacy">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {isAuthenticated ? (
                <EditableText 
                  id="privacy-tab-title"
                  defaultText="Privacy Policy"
                />
              ) : (
                "Privacy Policy"
              )}
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isAuthenticated ? (
                <EditableText 
                  id="terms-tab-title"
                  defaultText="Terms of Service"
                />
              ) : (
                "Terms of Service"
              )}
            </TabsTrigger>
            <TabsTrigger value="cookies" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              {isAuthenticated ? (
                <EditableText 
                  id="cookies-tab-title"
                  defaultText="Cookie Settings"
                />
              ) : (
                "Cookie Settings"
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isAuthenticated ? (
                  <EditableText 
                    id="privacy-section-title"
                    defaultText="Privacy Policy"
                  />
                ) : (
                  "Privacy Policy"
                )}
              </h2>
              <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                {/* Introduction Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-1-title"
                        defaultText="1. Introduction"
                      />
                    ) : (
                      "1. Introduction"
                    )}
                  </h3>
                  <div className="text-base">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-1-content"
                        defaultText="Welcome to Automatízalo's Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our website and services."
                        multiline={true}
                      />
                    ) : (
                      "Welcome to Automatízalo's Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our website and services."
                    )}
                  </div>
                </div>
                
                {/* Information We Collect Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-2-title"
                        defaultText="2. Information We Collect"
                      />
                    ) : (
                      "2. Information We Collect"
                    )}
                  </h3>
                  <div className="mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-2-content"
                        defaultText="We may collect the following types of information:"
                        multiline={true}
                      />
                    ) : (
                      "We may collect the following types of information:"
                    )}
                  </div>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-2-item-1"
                          defaultText="Personal information (name, email address, phone number)"
                        />
                      ) : (
                        "Personal information (name, email address, phone number)"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-2-item-2"
                          defaultText="Usage data (how you interact with our website)"
                        />
                      ) : (
                        "Usage data (how you interact with our website)"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-2-item-3"
                          defaultText="Device information (browser type, IP address)"
                        />
                      ) : (
                        "Device information (browser type, IP address)"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-2-item-4"
                          defaultText="Cookies and similar technologies"
                        />
                      ) : (
                        "Cookies and similar technologies"
                      )}
                    </li>
                  </ul>
                </div>
                
                {/* How We Use Your Information Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-3-title"
                        defaultText="3. How We Use Your Information"
                      />
                    ) : (
                      "3. How We Use Your Information"
                    )}
                  </h3>
                  <div className="mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-3-content"
                        defaultText="We use your information to:"
                        multiline={true}
                      />
                    ) : (
                      "We use your information to:"
                    )}
                  </div>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-3-item-1"
                          defaultText="Provide and improve our services"
                        />
                      ) : (
                        "Provide and improve our services"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-3-item-2"
                          defaultText="Communicate with you about our products and services"
                        />
                      ) : (
                        "Communicate with you about our products and services"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-3-item-3"
                          defaultText="Analyze usage patterns to enhance user experience"
                        />
                      ) : (
                        "Analyze usage patterns to enhance user experience"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-3-item-4"
                          defaultText="Comply with legal obligations"
                        />
                      ) : (
                        "Comply with legal obligations"
                      )}
                    </li>
                  </ul>
                </div>
                
                {/* Information Sharing Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-4-title"
                        defaultText="4. Information Sharing"
                      />
                    ) : (
                      "4. Information Sharing"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-4-content"
                        defaultText="We do not sell your personal information. We may share information with third-party service providers who help us operate our business, but these companies are obligated to keep this information confidential."
                        multiline={true}
                      />
                    ) : (
                      "We do not sell your personal information. We may share information with third-party service providers who help us operate our business, but these companies are obligated to keep this information confidential."
                    )}
                  </div>
                </div>
                
                {/* Your Rights Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-5-title"
                        defaultText="5. Your Rights"
                      />
                    ) : (
                      "5. Your Rights"
                    )}
                  </h3>
                  <div className="mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-5-content"
                        defaultText="Depending on your location, you may have rights to:"
                        multiline={true}
                      />
                    ) : (
                      "Depending on your location, you may have rights to:"
                    )}
                  </div>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-5-item-1"
                          defaultText="Access the personal information we hold about you"
                        />
                      ) : (
                        "Access the personal information we hold about you"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-5-item-2"
                          defaultText="Correct inaccurate information"
                        />
                      ) : (
                        "Correct inaccurate information"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-5-item-3"
                          defaultText="Delete your personal information"
                        />
                      ) : (
                        "Delete your personal information"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-5-item-4"
                          defaultText="Object to or restrict certain processing"
                        />
                      ) : (
                        "Object to or restrict certain processing"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="privacy-section-5-item-5"
                          defaultText="Data portability"
                        />
                      ) : (
                        "Data portability"
                      )}
                    </li>
                  </ul>
                </div>
                
                {/* Contact Us Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-6-title"
                        defaultText="6. Contact Us"
                      />
                    ) : (
                      "6. Contact Us"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="privacy-section-6-content"
                        defaultText="If you have questions about our Privacy Policy, please contact us at support@automatizalo.com."
                        multiline={true}
                      />
                    ) : (
                      <>{renderEmailLink()}</>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="terms" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isAuthenticated ? (
                  <EditableText 
                    id="terms-section-title"
                    defaultText="Terms of Service"
                  />
                ) : (
                  "Terms of Service"
                )}
              </h2>
              <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                {/* Acceptance of Terms Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-1-title"
                        defaultText="1. Acceptance of Terms"
                      />
                    ) : (
                      "1. Acceptance of Terms"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-1-content"
                        defaultText="By accessing or using Automatízalo's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations."
                        multiline={true}
                      />
                    ) : (
                      "By accessing or using Automatízalo's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations."
                    )}
                  </div>
                </div>
                
                {/* Use of Services Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-2-title"
                        defaultText="2. Use of Services"
                      />
                    ) : (
                      "2. Use of Services"
                    )}
                  </h3>
                  <div className="mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-2-content"
                        defaultText="You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from:"
                        multiline={true}
                      />
                    ) : (
                      "You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from:"
                    )}
                  </div>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="terms-section-2-item-1"
                          defaultText="Using the services in any way that violates applicable laws"
                        />
                      ) : (
                        "Using the services in any way that violates applicable laws"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="terms-section-2-item-2"
                          defaultText="Attempting to interfere with the proper functioning of the services"
                        />
                      ) : (
                        "Attempting to interfere with the proper functioning of the services"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="terms-section-2-item-3"
                          defaultText="Engaging in any activity that disrupts or diminishes the quality of our services"
                        />
                      ) : (
                        "Engaging in any activity that disrupts or diminishes the quality of our services"
                      )}
                    </li>
                    <li>
                      {isAuthenticated ? (
                        <EditableText 
                          id="terms-section-2-item-4"
                          defaultText="Attempting to gain unauthorized access to any part of our services"
                        />
                      ) : (
                        "Attempting to gain unauthorized access to any part of our services"
                      )}
                    </li>
                  </ul>
                </div>
                
                {/* Intellectual Property Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-3-title"
                        defaultText="3. Intellectual Property"
                      />
                    ) : (
                      "3. Intellectual Property"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-3-content"
                        defaultText="All content, features, and functionality on our website, including text, graphics, logos, and code, are owned by Automatízalo and are protected by copyright, trademark, and other intellectual property laws."
                        multiline={true}
                      />
                    ) : (
                      "All content, features, and functionality on our website, including text, graphics, logos, and code, are owned by Automatízalo and are protected by copyright, trademark, and other intellectual property laws."
                    )}
                  </div>
                </div>
                
                {/* Limitation of Liability Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-4-title"
                        defaultText="4. Limitation of Liability"
                      />
                    ) : (
                      "4. Limitation of Liability"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-4-content"
                        defaultText="Automatízalo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, our services."
                        multiline={true}
                      />
                    ) : (
                      "Automatízalo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, our services."
                    )}
                  </div>
                </div>
                
                {/* Changes to Terms Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-5-title"
                        defaultText="5. Changes to Terms"
                      />
                    ) : (
                      "5. Changes to Terms"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-5-content"
                        defaultText="We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our website."
                        multiline={true}
                      />
                    ) : (
                      "We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our website."
                    )}
                  </div>
                </div>
                
                {/* Governing Law Section */}
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-6-title"
                        defaultText="6. Governing Law"
                      />
                    ) : (
                      "6. Governing Law"
                    )}
                  </h3>
                  <div>
                    {isAuthenticated ? (
                      <EditableText 
                        id="terms-section-6-content"
                        defaultText="These Terms shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions."
                        multiline={true}
                      />
                    ) : (
                      "These Terms shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions."
                    )}
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="cookies" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isAuthenticated ? (
                  <EditableText 
                    id="cookies-section-title"
                    defaultText="Cookie Settings"
                  />
                ) : (
                  "Cookie Settings"
                )}
              </h2>
              <div className="mb-6">
                {isAuthenticated ? (
                  <EditableText 
                    id="cookies-section-description"
                    defaultText="Manage how we use cookies on this website. You can customize your preferences below."
                    multiline={true}
                  />
                ) : (
                  "Manage how we use cookies on this website. You can customize your preferences below."
                )}
              </div>
              
              <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">
                      {isAuthenticated ? (
                        <EditableText 
                          id="cookies-all-title"
                          defaultText="All Cookies"
                        />
                      ) : (
                        "All Cookies"
                      )}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="cookies-all-description"
                          defaultText="Enable/disable all optional cookies"
                        />
                      ) : (
                        "Enable/disable all optional cookies"
                      )}
                    </p>
                  </div>
                  <Switch 
                    checked={acceptAll} 
                    onCheckedChange={handleAcceptAllToggle} 
                    id="accept-all"
                  />
                </div>
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="necessary-cookies" className="text-base font-medium">
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-necessary-title"
                            defaultText="Necessary Cookies"
                          />
                        ) : (
                          "Necessary Cookies"
                        )}
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-necessary-description"
                            defaultText="Required for the website to function properly"
                          />
                        ) : (
                          "Required for the website to function properly"
                        )}
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.necessary} 
                      onCheckedChange={() => {}} 
                      id="necessary-cookies"
                      disabled={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="functional-cookies" className="text-base font-medium">
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-functional-title"
                            defaultText="Functional Cookies"
                          />
                        ) : (
                          "Functional Cookies"
                        )}
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-functional-description"
                            defaultText="Enable personalized features and remember your preferences"
                          />
                        ) : (
                          "Enable personalized features and remember your preferences"
                        )}
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.functional} 
                      onCheckedChange={() => handlePreferenceChange('functional')} 
                      id="functional-cookies"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="analytics-cookies" className="text-base font-medium">
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-analytics-title"
                            defaultText="Analytics Cookies"
                          />
                        ) : (
                          "Analytics Cookies"
                        )}
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-analytics-description"
                            defaultText="Help us improve our website by collecting anonymous usage information"
                          />
                        ) : (
                          "Help us improve our website by collecting anonymous usage information"
                        )}
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.analytics} 
                      onCheckedChange={() => handlePreferenceChange('analytics')} 
                      id="analytics-cookies"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="marketing-cookies" className="text-base font-medium">
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-marketing-title"
                            defaultText="Marketing Cookies"
                          />
                        ) : (
                          "Marketing Cookies"
                        )}
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isAuthenticated ? (
                          <EditableText 
                            id="cookies-marketing-description"
                            defaultText="Allow us to provide relevant advertisements and track their performance"
                          />
                        ) : (
                          "Allow us to provide relevant advertisements and track their performance"
                        )}
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.marketing} 
                      onCheckedChange={() => handlePreferenceChange('marketing')} 
                      id="marketing-cookies"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">
                  {isAuthenticated ? (
                    <EditableText 
                      id="cookies-about-title"
                      defaultText="About Cookies"
                    />
                  ) : (
                    "About Cookies"
                  )}
                </h3>
                <div className="mb-4">
                  {isAuthenticated ? (
                    <EditableText 
                      id="cookies-about-content1"
                      defaultText="Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners."
                      multiline={true}
                    />
                  ) : (
                    "Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners."
                  )}
                </div>
                <div>
                  {isAuthenticated ? (
                    <EditableText 
                      id="cookies-about-content2"
                      defaultText="You can also manage cookies through your browser settings. However, blocking certain cookies may impact your experience on our website and limit the services we can provide."
                      multiline={true}
                    />
                  ) : (
                    "You can also manage cookies through your browser settings. However, blocking certain cookies may impact your experience on our website and limit the services we can provide."
                  )}
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
