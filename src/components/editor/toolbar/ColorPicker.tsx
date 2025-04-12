
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRichTextEditor } from '../RichTextEditorContext';

const COLORS = [
  "#000000", "#5E5E5E", "#1A1F2C", "#7E69AB", "#9b87f5", "#D946EF",
  "#F97316", "#EF4444", "#F59E0B", "#10B981", "#0EA5E9", "#8B5CF6"
];

const ColorPicker = () => {
  const { execCommand, saveSelection } = useRichTextEditor();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 p-1"
          title="Text Color"
          onClick={saveSelection}
        >
          <div className="w-4 h-4 rounded-full bg-black border border-gray-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => execCommand('foreColor', color)}
              className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
