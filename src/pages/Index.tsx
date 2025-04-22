
import { useState, useEffect } from 'react';
import React from 'react';
import { toast } from 'sonner';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import SolutionsSection from '@/components/home/SolutionsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { useAuth } from '@/context/AuthContext';
import { ensureContentBucket } from '@/services/blog/ensureBucket';
import { useLocation } from 'react-router-dom';
import { checkSupabaseConnection } from '@/services/supabaseService';

interface SectionState {
  id: number;
  name: string;
  visible: boolean;
  component: string;
  order: number;
}

const Index = () => {
  const [sections, setSections] = useState<SectionState[]>([
    { id: 1, name: 'Hero Section', visible: true, component: 'Hero', order: 1 },
    { id: 2, name: 'About Section', visible: true, component: 'About', order: 2 },
    { id: 3, name: 'Solutions Section', visible: true, component: 'SolutionsSection', order: 3 },
    { id: 4, name: 'Testimonials Section', visible: true, component: 'TestimonialsSection', order: 4 },
  ]);
  const { user } = useAuth();
  const isAdmin = !!user;
  const location = useLocation();

  // Ensure scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Load section layout from localStorage (in a real app, from the database)
    const storedLayout = localStorage.getItem('homepage_layout');
    if (storedLayout) {
      try {
        const parsedLayout = JSON.parse(storedLayout);
        setSections(parsedLayout);
      } catch (error) {
        console.error('Error parsing stored layout:', error);
      }
    }

    // Check Supabase connection when the app starts
    checkSupabaseConnection().then(isConnected => {
      if (!isConnected) {
        toast.warning("Database connection issue detected. Some features may be limited.", {
          duration: 5000,
          id: "connection-warning"
        });
      }
    });

    // Ensure content bucket exists for image uploads
    if (isAdmin) {
      ensureContentBucket().catch(error => {
        console.error('Error ensuring content bucket exists:', error);
      });
    }

    const handleEditableTextChange = (event: CustomEvent) => {
      const { id, newText } = event.detail;
      console.log(`Content edited: ${id} = ${newText}`);
      toast.success('Content updated successfully');
    };

    window.addEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    
    return () => {
      window.removeEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    };
  }, [isAdmin]);

  // Inform admin users they can edit content
  useEffect(() => {
    if (isAdmin) {
      toast.info("You're logged in as admin. Click on any text or image to edit it.", {
        duration: 5000,
      });
    }
  }, [isAdmin]);

  const componentMap: Record<string, React.ReactNode> = {
    'Hero': <Hero isEditable={isAdmin} />,
    'About': <About isEditable={isAdmin} />,
    'SolutionsSection': <SolutionsSection isEditable={isAdmin} />,
    'TestimonialsSection': <TestimonialsSection isEditable={isAdmin} />
  };

  const visibleSections = sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {visibleSections.map(section => (
          <React.Fragment key={section.id}>
            {componentMap[section.component]}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
};

export default Index;
