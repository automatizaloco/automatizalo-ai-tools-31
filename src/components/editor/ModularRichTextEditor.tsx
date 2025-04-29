
import React from 'react';
import { RichTextEditorProvider } from './RichTextEditorContext';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
import HTMLEditor from './HTMLEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ModularRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder 
}: RichTextEditorProps) => {
  return (
    <RichTextEditorProvider value={value} onChange={onChange} placeholder={placeholder}>
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <Tabs defaultValue="editor" className="w-full">
          <div className="bg-gray-50 border-b border-gray-200 p-1 flex items-center justify-between">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="editor">Visual Editor</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="editor" className="p-0">
            <EditorToolbar />
            <EditorContent />
          </TabsContent>
          
          <TabsContent value="html" className="p-0">
            <HTMLEditor />
          </TabsContent>
        </Tabs>
      </div>
    </RichTextEditorProvider>
  );
};

export default ModularRichTextEditor;
