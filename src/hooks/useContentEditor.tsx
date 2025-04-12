
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
            } catch (error) {
              console.log(`Error loading content for ${section.pageName}-${section.sectionName}, using default`);
              contentData[pageName][section.sectionName] = `<h2>Content for ${section.sectionName} on ${section.pageName} page</h2>`;
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
        console.log("Loaded images data:", imagesData);
        
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
    setContent(prev => ({
      ...prev,
      [pageName]: {
        ...prev[pageName],
        [sectionName]: newContent
      }
    }));
  };

  const handleSaveContent = async (pageName: string, sectionName: string) => {
    try {
      await updatePageContent(pageName, sectionName, content[pageName][sectionName]);
      toast.success("Content updated successfully!");
      return true;
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
      throw error;
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
  };
};
