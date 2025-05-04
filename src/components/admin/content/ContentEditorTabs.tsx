
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageSectionEditor from './PageSectionEditor';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageSection {
  id: string;
  pageName: string;
  sectionName: string;
  displayName: string;
}

interface ContentEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pageSections: Record<string, PageSection[]>;
  content: Record<string, Record<string, string>>;
  images: Record<string, string>;
  handleContentUpdate: (pageName: string, sectionName: string, newContent: string) => void;
  handleSaveContent: (pageName: string, sectionName: string) => Promise<void>;
  uploadingImage: string | null;
  setUploadingImage: (key: string | null) => void;
}

const ContentEditorTabs: React.FC<ContentEditorTabsProps> = ({
  activeTab,
  setActiveTab,
  pageSections,
  content,
  images,
  handleContentUpdate,
  handleSaveContent,
  uploadingImage,
  setUploadingImage
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs 
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <div className="overflow-x-auto pb-2">
        <TabsList className={`${isMobile ? 'w-auto min-w-full' : 'w-full sm:w-auto'} border-b`}>
          <TabsTrigger value="home" className="whitespace-nowrap">Home Page</TabsTrigger>
          <TabsTrigger value="about" className="whitespace-nowrap">About Page</TabsTrigger>
          <TabsTrigger value="solutions" className="whitespace-nowrap">Solutions Page</TabsTrigger>
          <TabsTrigger value="contact" className="whitespace-nowrap">Contact Page</TabsTrigger>
        </TabsList>
      </div>

      {Object.entries(pageSections).map(([pageName, sections]) => (
        <TabsContent key={pageName} value={pageName} className="space-y-8">
          {sections.map(section => (
            <PageSectionEditor
              key={section.id}
              section={section}
              content={content[section.pageName]?.[section.sectionName] || ''}
              images={images}
              onContentChange={handleContentUpdate}
              onSave={handleSaveContent}
              uploadingImage={uploadingImage}
              setUploadingImage={setUploadingImage}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ContentEditorTabs;
