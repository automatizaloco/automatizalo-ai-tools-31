
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heading1, Heading2, Heading3, Type } from "lucide-react";
import { useRichTextEditor } from '../RichTextEditorContext';

const HeadingControls = () => {
  const { execCommand } = useRichTextEditor();
  
  return (
    <div className="flex items-center">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('formatBlock', '<h1>')}
        className="h-8 w-8 p-1"
        title="Heading 1"
      >
        <Heading1 size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('formatBlock', '<h2>')}
        className="h-8 w-8 p-1"
        title="Heading 2"
      >
        <Heading2 size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('formatBlock', '<h3>')}
        className="h-8 w-8 p-1"
        title="Heading 3"
      >
        <Heading3 size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('formatBlock', '<p>')}
        className="h-8 w-8 p-1"
        title="Paragraph"
      >
        <Type size={16} />
      </Button>
    </div>
  );
};

export default HeadingControls;
