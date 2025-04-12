
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
import { useRichTextEditor } from '../RichTextEditorContext';
import ColorPicker from './ColorPicker';
import FontSizePicker from './FontSizePicker';

const TextFormattingControls = () => {
  const { execCommand, saveSelection } = useRichTextEditor();
  
  return (
    <div className="flex items-center">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('bold')}
        className="h-8 w-8 p-1"
        title="Bold"
      >
        <Bold size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('italic')}
        className="h-8 w-8 p-1"
        title="Italic"
      >
        <Italic size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('underline')}
        className="h-8 w-8 p-1"
        title="Underline"
      >
        <Underline size={16} />
      </Button>

      <ColorPicker />
      <FontSizePicker />
    </div>
  );
};

export default TextFormattingControls;
