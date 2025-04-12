
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { useRichTextEditor } from '../RichTextEditorContext';

const ImageButton = () => {
  const { saveSelection } = useRichTextEditor();
  
  const insertImage = (url: string, alt: string = "") => {
    if (!url) return;
    
    const { execCommand } = useRichTextEditor();
    execCommand('insertHTML', `<img src="${url}" alt="${alt}" class="w-full max-w-2xl h-auto rounded-lg my-4" />`);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-1"
          title="Insert Image"
          onClick={saveSelection}
        >
          <Image size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-2">
          <h3 className="font-medium">Insert Image</h3>
          <div className="space-y-2">
            <Input 
              id="image-url" 
              placeholder="https://example.com/image.jpg" 
              className="col-span-3" 
            />
            <Input 
              id="image-alt" 
              placeholder="Alt text (optional)" 
              className="col-span-3" 
            />
            <Button 
              onClick={() => {
                const url = (document.getElementById('image-url') as HTMLInputElement).value;
                const alt = (document.getElementById('image-alt') as HTMLInputElement).value;
                insertImage(url, alt);
              }}
              className="w-full"
            >
              Insert Image
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImageButton;
