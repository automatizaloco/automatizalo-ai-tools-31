
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Section {
  id: number;
  name: string;
  visible: boolean;
  component: string;
  order: number;
}

const LayoutManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sections, setSections] = useState<Section[]>([
    { id: 1, name: 'Hero Section', visible: true, component: 'Hero', order: 1 },
    { id: 2, name: 'About Section', visible: true, component: 'About', order: 2 },
    { id: 3, name: 'Solutions Section', visible: true, component: 'SolutionsSection', order: 3 },
    { id: 4, name: 'Testimonials Section', visible: true, component: 'TestimonialsSection', order: 4 },
    { id: 5, name: 'Call to Action Section', visible: true, component: 'CTASection', order: 5 },
  ]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin/layout-manager');
    }
  }, [user, navigate]);

  const moveSection = (id: number, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && sectionIndex === 0) || 
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    // Swap the sections
    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    // Update order values
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });
    
    setSections(newSections);
    toast.success(`${sections[sectionIndex].name} moved ${direction}`);
  };

  const toggleVisibility = (id: number) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
    const section = sections.find(s => s.id === id);
    toast.success(`${section?.name} ${section?.visible ? 'hidden' : 'visible'}`);
  };

  const saveLayout = async () => {
    setLoading(true);
    try {
      // In production, this would save to your database
      // For now we'll just simulate a successful save
      console.log('Saving layout:', sections);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
      toast.success('Layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error('Failed to save layout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Page Layout Manager</h1>
              <Button onClick={() => navigate("/admin")}>Back to Admin</Button>
            </div>
            <p className="text-gray-600 mt-2">
              Arrange, show, or hide sections on the homepage
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Homepage Sections</h2>
            <div className="space-y-4">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                <div 
                  key={section.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    section.visible ? 'bg-gray-50' : 'bg-gray-100 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={section.visible}
                      onCheckedChange={() => toggleVisibility(section.id)}
                      aria-label={`Toggle ${section.name} visibility`}
                    />
                    <span className={`font-medium ${!section.visible && 'text-gray-500'}`}>
                      {section.name}
                    </span>
                    {!section.visible && (
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={section.order === 1}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={section.order === sections.length}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => toggleVisibility(section.id)}
                      className={section.visible ? "text-green-500" : "text-red-500"}
                    >
                      {section.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                onClick={saveLayout} 
                className="w-full sm:w-auto" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Layout Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LayoutManager;
