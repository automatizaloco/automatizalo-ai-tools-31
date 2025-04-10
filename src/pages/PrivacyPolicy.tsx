
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
import { useLocation } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Get the tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const defaultTab = tabParam === 'terms' || tabParam === 'cookies' ? tabParam : 'privacy';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
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

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">
          {isAuthenticated ? (
            <EditableText 
              id="legal-title"
              defaultText="Legal Information"
            />
          ) : (
            "Legal Information"
          )}
        </h1>
        
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full sm:w-auto grid-cols-1 sm:grid-cols-3 mb-8">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="cookies" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Cookie Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Introduction</h3>
                  <div className="text-base">
                    Welcome to Automatízalo's Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our website and services.
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">2. Information We Collect</h3>
                  <div className="mb-2">We may collect the following types of information:</div>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Personal information (name, email address)</li>
                    <li>Usage data (how you interact with our website)</li>
                    <li>Device information (browser type, IP address)</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">3. How We Use Your Information</h3>
                  <div className="mb-2">We use your information to:</div>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide and improve our services</li>
                    <li>Communicate with you about our products and services</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">4. Contact Us</h3>
                  <div>
                    If you have questions about our Privacy Policy, please contact us at contact@automatizalo.co.
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="terms" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
              <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Acceptance of Terms</h3>
                  <div>
                    By accessing or using Automatízalo's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">2. Use of Services</h3>
                  <div className="mb-2">
                    You agree to use our services only for lawful purposes and in accordance with these Terms.
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">3. Governing Law</h3>
                  <div>
                    These Terms shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions.
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="cookies" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookie Settings</h2>
              <div className="mb-6">
                Manage how we use cookies on this website. You can customize your preferences below.
              </div>
              
              <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">All Cookies</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Enable/disable all optional cookies
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
                        Necessary Cookies
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Required for the website to function properly
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
                        Functional Cookies
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enable personalized features and remember your preferences
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
                        Analytics Cookies
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Help us improve our website by collecting anonymous usage information
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
                        Marketing Cookies
                      </Label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Allow us to provide relevant advertisements and track their performance
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
            </section>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
