
import { useState, useEffect } from 'react';
import React from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import SolutionsSection from '@/components/home/SolutionsSection';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setGoogleTranslateApiKey, hasGoogleTranslateApiKey } from '@/services/translationService';

const Index = () => {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const handleEditableTextChange = (event: CustomEvent) => {
      const { id, newText } = event.detail;
      console.log(`Content edited: ${id} = ${newText}`);
      toast.success('Content updated successfully');
    };

    window.addEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    
    // Check if API key is already set
    if (!hasGoogleTranslateApiKey()) {
      setShowApiKeyDialog(true);
    }
    
    return () => {
      window.removeEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    };
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setGoogleTranslateApiKey(apiKey.trim());
      toast.success('Google Translate API key saved successfully');
      setShowApiKeyDialog(false);
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <About />
        <SolutionsSection />
        <CTASection />
        <TestimonialsSection />
      </main>
      
      <Footer />

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Google Translate API Setup</DialogTitle>
            <DialogDescription>
              Enter your Google Cloud Translation API key to enable automatic translation of blog posts. 
              This key will be stored in your browser's local storage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter your Google Translate API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
            <p className="text-xs text-gray-500">
              You can get an API key from <a href="https://cloud.google.com/translate/docs/setup" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>.
              Make sure the Cloud Translation API is enabled for your project.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowApiKeyDialog(false)} variant="outline">
              Later
            </Button>
            <Button onClick={handleSaveApiKey}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
