
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRichTextEditor } from '../RichTextEditorContext';

const FONT_SIZES = [
  "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px", "60px"
];

const FontSizePicker = () => {
  const { execCommand, saveSelection } = useRichTextEditor();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 p-1 text-xs"
          title="Font Size"
          onClick={saveSelection}
        >
          Font Size
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <div className="flex flex-col gap-1">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => execCommand('fontSize', size)}
              className="text-left px-2 py-1 hover:bg-gray-100 rounded"
              style={{ fontSize: size }}
            >
              {size}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontSizePicker;
