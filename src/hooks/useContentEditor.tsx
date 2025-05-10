
import { useState, useEffect, useCallback } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Define page sections
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

  // Initialize storage bucket - only runs once
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await ensureContentBucket();
      } catch (error) {
        console.error("Failed to initialize content bucket:", error);
        toast.error("Failed to initialize storage");
      }
    };
    
    initializeStorage();
  }, []);

  // Load content for the active tab only
  const loadTabContent = useCallback(async (pageName: string) => {
    if (!pageSections[pageName] || (content[pageName] && Object.keys(content[pageName]).length > 0)) {
      return; // Skip if content is already loaded or page doesn't exist
    }

    setLoading(true);
    
    try {
      const contentData: Record<string, string> = {};
      
      // Load content for each section in the active tab
      for (const section of pageSections[pageName]) {
        try {
          const sectionContent = await getPageContent(section.pageName, section.sectionName);
          contentData[section.sectionName] = sectionContent;
          
          // Store in localStorage as backup
          const key = `page_content_${section.pageName}_${section.sectionName}`;
          localStorage.setItem(key, sectionContent);
        } catch (error) {
          console.log(`Error loading content for ${section.pageName}-${section.sectionName}, using default or cached version`);
          
          // Try to get from localStorage first
          const key = `page_content_${section.pageName}_${section.sectionName}`;
          const cachedContent = localStorage.getItem(key);
          
          if (cachedContent) {
            contentData[section.sectionName] = cachedContent;
          } else {
            // Use default content as last resort
            const defaultContent = `<h2>Content for ${section.sectionName} on ${section.pageName} page</h2>`;
            contentData[section.sectionName] = defaultContent;
            localStorage.setItem(key, defaultContent);
          }
        }
      }
      
      // Update content state without replacing other pages
      setContent(prev => ({
        ...prev,
        [pageName]: contentData
      }));
      
      // Load images for the page
      try {
        const pageImagesData = await getPageImages(pageName);
        setImages(prev => ({
          ...prev,
          ...pageImagesData
        }));
      } catch (error) {
        console.error(`Error loading images for page ${pageName}:`, error);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
    }
  }, [pageSections]);

  // Load initial content when component mounts
  useEffect(() => {
    if (!isInitialized) {
      loadTabContent(activeTab);
      setIsInitialized(true);
    }
  }, [activeTab, loadTabContent, isInitialized]);

  // Load content when activeTab changes
  useEffect(() => {
    if (isInitialized) {
      loadTabContent(activeTab);
    }
  }, [activeTab, loadTabContent, isInitialized]);

  // Content update handler
  const handleContentUpdate = useCallback((pageName: string, sectionName: string, newContent: string) => {
    console.log(`Updating content for ${pageName}.${sectionName}`, newContent.substring(0, 50) + "...");
    
    setContent(prev => ({
      ...prev,
      [pageName]: {
        ...prev[pageName],
        [sectionName]: newContent
      }
    }));
    
    // Update in localStorage as a fallback
    const key = `page_content_${pageName}_${sectionName}`;
    try {
      localStorage.setItem(key, newContent);
    } catch (e) {
      console.error("Failed to update localStorage:", e);
    }
  }, []);

  // Save content handler
  const handleSaveContent = useCallback(async (pageName: string, sectionName: string): Promise<void> => {
    try {
      setSavingContent({ pageName, sectionName });
      
      // Ensure content is loaded
      if (!content[pageName] || !content[pageName][sectionName]) {
        throw new Error(`Content for ${pageName}.${sectionName} not found`);
      }
      
      await updatePageContent(pageName, sectionName, content[pageName][sectionName]);
      toast.success("Content updated successfully!");
      
      // Double-check the content was saved in localStorage
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
  }, [content]);

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
