
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPageContent, updatePageContent } from "@/services/pageContentService";

interface PageSection {
  id: string;
  pageName: string;
  sectionName: string;
  displayName: string;
}

const ContentEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Define the sections for each page
  const pageSections: Record<string, PageSection[]> = {
    home: [
      { id: "home-hero", pageName: "home", sectionName: "hero", displayName: "Hero Section" },
      { id: "home-about", pageName: "home", sectionName: "about", displayName: "About Section" },
      { id: "home-solutions", pageName: "home", sectionName: "solutions", displayName: "Solutions Section" },
      { id: "home-cta", pageName: "home", sectionName: "cta", displayName: "Call to Action Section" }
    ],
    about: [
      { id: "about-main", pageName: "about", sectionName: "main", displayName: "Main Content" }
    ],
    solutions: [
      { id: "solutions-overview", pageName: "solutions", sectionName: "overview", displayName: "Overview" }
    ],
    contact: [
      { id: "contact-main", pageName: "contact", sectionName: "main", displayName: "Main Content" }
    ]
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin/content-editor');
    }
  }, [user, navigate]);

  // Load content for all sections
  useEffect(() => {
    const loadAllContent = async () => {
      setLoading(true);
      try {
        const contentData: Record<string, Record<string, string>> = {};
        
        // For each page
        for (const [pageName, sections] of Object.entries(pageSections)) {
          contentData[pageName] = {};
          
          // Load content for each section
          for (const section of sections) {
            const sectionContent = await getPageContent(section.pageName, section.sectionName);
            contentData[pageName][section.sectionName] = sectionContent;
          }
        }
        
        setContent(contentData);
      } catch (error) {
        console.error("Error loading content:", error);
        toast.error("Failed to load page content");
      } finally {
        setLoading(false);
      }
    };
    
    loadAllContent();
  }, []);

  const handleContentUpdate = async (pageName: string, sectionName: string, newContent: string) => {
    // Update local state
    setContent(prev => ({
      ...prev,
      [pageName]: {
        ...prev[pageName],
        [sectionName]: newContent
      }
    }));
  };

  const handleSaveContent = async (pageName: string, sectionName: string) => {
    setSaving(true);
    try {
      await updatePageContent(pageName, sectionName, content[pageName][sectionName]);
      toast.success("Content updated successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Website Content Editor</h1>
              <Button onClick={() => navigate("/admin")}>Back to Admin</Button>
            </div>
            <p className="text-gray-600 mt-2">
              Edit content for different pages of your website
            </p>
          </div>

          <Tabs 
            defaultValue="home" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="w-full sm:w-auto border-b">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="about">About Page</TabsTrigger>
              <TabsTrigger value="solutions">Solutions Page</TabsTrigger>
              <TabsTrigger value="contact">Contact Page</TabsTrigger>
            </TabsList>

            {Object.entries(pageSections).map(([pageName, sections]) => (
              <TabsContent key={pageName} value={pageName} className="space-y-8">
                {sections.map(section => (
                  <div key={section.id} className="space-y-4 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{section.displayName}</h2>
                      <Button 
                        onClick={() => handleSaveContent(section.pageName, section.sectionName)}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="text-xs text-gray-500 mb-2">
                        Preview:
                      </div>
                      <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ 
                          __html: content[section.pageName]?.[section.sectionName] || '' 
                        }} 
                      />
                    </div>
                    
                    <RichTextEditor
                      value={content[section.pageName]?.[section.sectionName] || ''}
                      onChange={(newContent) => 
                        handleContentUpdate(section.pageName, section.sectionName, newContent)
                      }
                    />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentEditor;
