
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { getPageContent, updatePageContent } from "@/services/pageContentService";
import { Input } from '@/components/ui/input';
import { FileUploader } from '@/components/admin/FileUploader';

interface PageSection {
  id: string;
  pageName: string;
  sectionName: string;
  displayName: string;
}

interface ImageMap {
  [key: string]: string;
}

const ContentEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [images, setImages] = useState<ImageMap>({});
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

  // Load content and images for all sections
  useEffect(() => {
    const loadAllContent = async () => {
      setLoading(true);
      try {
        const contentData: Record<string, Record<string, string>> = {};
        const imagesData: ImageMap = {};
        
        // For each page
        for (const [pageName, sections] of Object.entries(pageSections)) {
          contentData[pageName] = {};
          
          // Load content for each section
          for (const section of sections) {
            const sectionContent = await getPageContent(section.pageName, section.sectionName);
            contentData[pageName][section.sectionName] = sectionContent;
            
            // Get section images from storage
            const { data: sectionImages } = await supabase
              .from('page_images')
              .select('section_id, image_url')
              .eq('page', section.pageName)
              .eq('section_name', section.sectionName);
              
            if (sectionImages && sectionImages.length > 0) {
              sectionImages.forEach(item => {
                imagesData[`${section.pageName}-${section.sectionName}-${item.section_id}`] = item.image_url;
              });
            }
          }
        }
        
        setContent(contentData);
        setImages(imagesData);
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

  const handleImageUpload = async (file: File, pageName: string, sectionName: string, sectionId: string) => {
    try {
      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageName}-${sectionName}-${sectionId}.${fileExt}`;
      const filePath = `content-images/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Save to database
      const { error: dbError } = await supabase
        .from('page_images')
        .upsert({ 
          page: pageName, 
          section_name: sectionName,
          section_id: sectionId,
          image_url: imageUrl
        }, { onConflict: 'page,section_name,section_id' });
      
      if (dbError) throw dbError;
      
      // Update local state
      setImages({
        ...images,
        [`${pageName}-${sectionName}-${sectionId}`]: imageUrl
      });
      
      toast.success("Image updated successfully!");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Website Content Editor</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Edit content and images for different pages of your website
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
                  
                  {/* Image section */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-medium mb-2">Section Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {['main', 'header', 'background'].map(imageId => {
                        const imageKey = `${section.pageName}-${section.sectionName}-${imageId}`;
                        const imageUrl = images[imageKey];
                        
                        return (
                          <div key={imageKey} className="bg-white p-3 border rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">
                              {imageId.charAt(0).toUpperCase() + imageId.slice(1)} Image:
                            </p>
                            {imageUrl ? (
                              <div className="relative">
                                <img 
                                  src={imageUrl} 
                                  alt={`${imageId} for ${section.displayName}`} 
                                  className="w-full h-40 object-cover rounded-lg mb-2"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                                <p className="text-gray-500 text-sm">No image</p>
                              </div>
                            )}
                            
                            <FileUploader
                              onUpload={(file) => handleImageUpload(file, section.pageName, section.sectionName, imageId)}
                              label="Change image"
                              buttonVariant="outline"
                              buttonSize="sm"
                              acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
                            />
                          </div>
                        );
                      })}
                    </div>
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
    </AdminLayout>
  );
};

export default ContentEditor;
