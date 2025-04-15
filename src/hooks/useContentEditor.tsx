
import { useState, useEffect } from 'react';
import { getPageContent, updatePageContent } from "@/services/pageContentService";
import { getPageImages } from '@/services/imageService';
import { toast } from "sonner";
import { ensureContentBucket } from '@/services/blog/ensureBucket';

interface PageSection {
  id: string;
  pageName: string;
  sectionName: string;
  displayName: string;
}

export const useContentEditor = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [savingContent, setSavingContent] = useState<{pageName: string, sectionName: string} | null>(null);

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

  useEffect(() => {
    // Ensure the content bucket exists when component loads
    const initializeStorage = async () => {
      await ensureContentBucket();
    };
    
    initializeStorage();
  }, []);

  useEffect(() => {
    const loadAllContent = async () => {
      setLoading(true);
      try {
        const contentData: Record<string, Record<string, string>> = {};
        const imagesData: Record<string, string> = {};
        
        for (const [pageName, sections] of Object.entries(pageSections)) {
          contentData[pageName] = {};
          
          for (const section of sections) {
            try {
              const sectionContent = await getPageContent(section.pageName, section.sectionName);
              contentData[pageName][section.sectionName] = sectionContent;
              
              // Also store in localStorage as backup
              const key = `page_content_${section.pageName}_${section.sectionName}`;
              localStorage.setItem(key, sectionContent);
            } catch (error) {
              console.log(`Error loading content for ${section.pageName}-${section.sectionName}, using default`);
              const defaultContent = `<h2>Content for ${section.sectionName} on ${section.pageName} page</h2>`;
              contentData[pageName][section.sectionName] = defaultContent;
              
              // Store default in localStorage too
              const key = `page_content_${section.pageName}_${section.sectionName}`;
              localStorage.setItem(key, defaultContent);
            }
          }
          
          try {
            const pageImagesData = await getPageImages(pageName);
            Object.assign(imagesData, pageImagesData);
          } catch (error) {
            console.error(`Error loading images for page ${pageName}:`, error);
          }
        }
        
        console.log("Loaded content data:", contentData);
        
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

  const handleContentUpdate = (pageName: string, sectionName: string, newContent: string) => {
    console.log(`Updating content for ${pageName}.${sectionName}`, newContent.substring(0, 50) + "...");
    
    setContent(prev => ({
      ...prev,
      [pageName]: {
        ...prev[pageName],
        [sectionName]: newContent
      }
    }));
    
    // Also update in localStorage as a fallback
    const key = `page_content_${pageName}_${sectionName}`;
    try {
      localStorage.setItem(key, newContent);
    } catch (e) {
      console.error("Failed to update localStorage:", e);
    }
  };

  const handleSaveContent = async (pageName: string, sectionName: string): Promise<void> => {
    try {
      setSavingContent({ pageName, sectionName });
      console.log(`Saving content for ${pageName}.${sectionName}:`, content[pageName][sectionName].substring(0, 50) + "...");
      
      // Ensure content is loaded
      if (!content[pageName] || !content[pageName][sectionName]) {
        throw new Error(`Content for ${pageName}.${sectionName} not found`);
      }
      
      await updatePageContent(pageName, sectionName, content[pageName][sectionName]);
      toast.success("Content updated successfully!");
      
      // Double-check the content was actually saved in localStorage
      const key = `page_content_${pageName}_${sectionName}`;
      localStorage.setItem(key, content[pageName][sectionName]);
      
      console.log(`Content saved successfully for ${pageName}.${sectionName}`);
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
      throw error;
    } finally {
      setSavingContent(null);
    }
  };

  return {
    activeTab,
    setActiveTab,
    content,
    images,
    loading,
    uploadingImage,
    setUploadingImage,
    pageSections,
    handleContentUpdate,
    handleSaveContent,
    savingContent,
  };
};
