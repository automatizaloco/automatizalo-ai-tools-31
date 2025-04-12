
import React from 'react';
import { useRichTextEditor } from './RichTextEditorContext';

const HTMLEditor = () => {
  const { value, onChange, placeholder } = useRichTextEditor();
  
  return (
    <textarea
      className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Write your content here..."}
      rows={15}
    />
  );
};

export default HTMLEditor;
