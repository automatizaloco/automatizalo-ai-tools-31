
import React from 'react';
import { Separator } from "@/components/ui/separator";
import HeadingControls from './toolbar/HeadingControls';
import TextFormattingControls from './toolbar/TextFormattingControls';
import AlignmentControls from './toolbar/AlignmentControls';
import ListControls from './toolbar/ListControls';
import InsertControls from './toolbar/InsertControls';

const EditorToolbar = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 p-1 flex flex-wrap gap-1">
      {/* Headings */}
      <HeadingControls />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      {/* Text formatting */}
      <TextFormattingControls />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      {/* Alignment */}
      <AlignmentControls />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      {/* Lists */}
      <ListControls />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      {/* Insert */}
      <InsertControls />
    </div>
  );
};

export default EditorToolbar;
