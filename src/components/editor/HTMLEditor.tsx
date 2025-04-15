
import React, { useEffect, useRef } from 'react';
import { useRichTextEditor } from './RichTextEditorContext';

const HTMLEditor = () => {
  const { value, onChange, placeholder } = useRichTextEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // When value changes from outside, update the textarea
    if (textareaRef.current) {
      textareaRef.current.value = value;
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Ensure the content is properly updated in the context
    onChange(e.target.value);
    
    // Log content changes to verify they're being captured
    console.log("HTML content updated:", e.target.value.substring(0, 50) + "...");
  };
  
  // Force textarea to update if its value doesn't match the context value
  useEffect(() => {
    const syncContentWithValue = () => {
      if (textareaRef.current && textareaRef.current.value !== value) {
        console.log("Syncing HTML editor with context value");
        textareaRef.current.value = value;
      }
    };
    
    // Run immediately and also set up an interval to check periodically
    syncContentWithValue();
    const intervalId = setInterval(syncContentWithValue, 1000);
    
    return () => clearInterval(intervalId);
  }, [value]);
  
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
