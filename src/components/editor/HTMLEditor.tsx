
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
    const newValue = e.target.value;
    onChange(newValue);
    
    // Log content changes to verify they're being captured properly with HTML formatting
    console.log("HTML content updated:", newValue.substring(0, 50) + "...");
    console.log("Contains HTML formatting:", 
      newValue.includes("<p>") || newValue.includes("<strong>") || 
      newValue.includes("<em>") || newValue.includes("<h"));
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
