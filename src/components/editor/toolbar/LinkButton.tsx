
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { useRichTextEditor } from '../RichTextEditorContext';

const LinkButton = () => {
  const { saveSelection } = useRichTextEditor();
  
  const insertLink = (url: string, text: string) => {
    if (!url) return;
    
    const { execCommand } = useRichTextEditor();
    execCommand('insertHTML', `<a href="${url}" target="_blank" class="text-primary hover:underline">${text || url}</a>`);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-1"
          title="Insert Link"
          onClick={saveSelection}
        >
          <LinkIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-2">
          <h3 className="font-medium">Insert Link</h3>
          <div className="space-y-2">
            <Input 
              id="link-url" 
              placeholder="https://example.com" 
              className="col-span-3" 
            />
            <Input 
              id="link-text" 
              placeholder="Link text (optional)" 
              className="col-span-3" 
            />
            <Button 
              onClick={() => {
                const url = (document.getElementById('link-url') as HTMLInputElement).value;
                const text = (document.getElementById('link-text') as HTMLInputElement).value;
                insertLink(url, text);
              }}
              className="w-full"
            >
              Insert Link
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkButton;
