
import React from 'react';
import { Button } from "@/components/ui/button";
import { Code, Quote, Smile } from "lucide-react";
import LinkButton from './LinkButton';
import ImageButton from './ImageButton';
import { useRichTextEditor } from '../RichTextEditorContext';

const InsertControls = () => {
  const { execCommand } = useRichTextEditor();
  
  return (
    <div className="flex items-center">
      <LinkButton />
      <ImageButton />
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('insertText', '😊')}
        className="h-8 w-8 p-1"
        title="Insert Emoji"
      >
        <Smile size={16} />
      </Button>
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('formatBlock', '<pre>')}
        className="h-8 w-8 p-1"
        title="Code Block"
      >
        <Code size={16} />
      </Button>
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('formatBlock', '<blockquote>')}
        className="h-8 w-8 p-1"
        title="Quote"
      >
        <Quote size={16} />
      </Button>
    </div>
  );
};

export default InsertControls;
