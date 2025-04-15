
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
    onChange(e.target.value);
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
