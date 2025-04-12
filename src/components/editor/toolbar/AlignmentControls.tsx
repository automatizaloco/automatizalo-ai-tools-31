
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { useRichTextEditor } from '../RichTextEditorContext';

const AlignmentControls = () => {
  const { execCommand } = useRichTextEditor();
  
  return (
    <div className="flex items-center">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('justifyLeft')}
        className="h-8 w-8 p-1"
        title="Align Left"
      >
        <AlignLeft size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('justifyCenter')}
        className="h-8 w-8 p-1"
        title="Align Center"
      >
        <AlignCenter size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('justifyRight')}
        className="h-8 w-8 p-1"
        title="Align Right"
      >
        <AlignRight size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('justifyFull')}
        className="h-8 w-8 p-1"
        title="Justify"
      >
        <AlignJustify size={16} />
      </Button>
    </div>
  );
};

export default AlignmentControls;
