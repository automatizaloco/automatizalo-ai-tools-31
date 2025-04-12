
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageSectionEditor from './PageSectionEditor';

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
  return (
    <Tabs 
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
