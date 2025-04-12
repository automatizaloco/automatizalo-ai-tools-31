
import React from 'react';
import { Button } from "@/components/ui/button";
import { List, ListOrdered } from "lucide-react";
import { useRichTextEditor } from '../RichTextEditorContext';

const ListControls = () => {
  const { execCommand } = useRichTextEditor();
  
  return (
    <div className="flex items-center">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('insertUnorderedList')}
        className="h-8 w-8 p-1"
        title="Bullet List"
      >
        <List size={16} />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => execCommand('insertOrderedList')}
        className="h-8 w-8 p-1"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </Button>
    </div>
  );
};

export default ListControls;
