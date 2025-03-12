
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
    { id: 5, name: 'Call to Action Section', visible: true, component: 'CTASection', order: 5 },
  ]);

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

    const handleEditableTextChange = (event: CustomEvent) => {
      const { id, newText } = event.detail;
      console.log(`Content edited: ${id} = ${newText}`);
      toast.success('Content updated successfully');
    };

    window.addEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    
    return () => {
      window.removeEventListener('editableTextChanged', handleEditableTextChange as EventListener);
    };
  }, []);

  // Component map for dynamic rendering
  const componentMap: Record<string, React.ReactNode> = {
    'Hero': <Hero />,
    'About': <About />,
    'SolutionsSection': <SolutionsSection />,
    'TestimonialsSection': <TestimonialsSection />,
    'CTASection': <CTASection />
  };

  // Sort sections by order and filter visible ones
  const visibleSections = sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {visibleSections.map(section => (
          <React.Fragment key={section.id}>
            {componentMap[section.component]}
          </React.Fragment>
        ))}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
