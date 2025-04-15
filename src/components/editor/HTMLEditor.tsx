
import React, { useEffect, useRef } from 'react';
import { useRichTextEditor } from './RichTextEditorContext';

const HTMLEditor = () => {
  const { value, onChange, placeholder } = useRichTextEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // When value changes from outside, update the textarea
    if (textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value;
      console.log("Updated textarea with new value from context");
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Ensure the content is properly updated in the context
    onChange(e.target.value);
    
    // Log content changes to verify they're being captured
    console.log("HTML content updated:", e.target.value.substring(0, 50) + "...");
  };
  
  return (
    <textarea
      ref={textareaRef}
      className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none"
      value={value}
      onChange={handleChange}
      placeholder={placeholder || "Write your content here..."}
      rows={15}
    />
  );
};

export default HTMLEditor;
