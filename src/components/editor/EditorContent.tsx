import React, { useEffect } from 'react';
import { useRichTextEditor } from './RichTextEditorContext';

const EditorContent = () => {
  const { 
    value, 
    onChange, 
    editorRef,
    saveSelection,
    isInitialRender,
    setIsInitialRender,
    placeholder,
    selectionRange,
    currentCursorPosition
  } = useRichTextEditor();

  // Load initial content
  useEffect(() => {
    if (editorRef.current && isInitialRender && value) {
      // Process the initial content for proper formatting
      const processedContent = processHtmlContent(value);
      editorRef.current.innerHTML = processedContent;
      setIsInitialRender(false);
      onChange(processedContent);
    }
  }, [value, isInitialRender, onChange, editorRef, setIsInitialRender]);

  // Process HTML content safely
  const processHtmlContent = (content: string): string => {
    if (!content) return '';
    
    // If content already has HTML formatting, use it as is
    if (content.includes('<p>') || content.includes('<div>') || 
        content.includes('<h1>') || content.includes('<strong>')) {
      return content;
    }
    
    // Otherwise process markdown-like syntax
    let processedContent = content;
    
    // Handle headings
    processedContent = processedContent.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    processedContent = processedContent.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    processedContent = processedContent.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    
    // Handle bold text
    processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processedContent = processedContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Handle line breaks - preserve double line breaks as paragraphs
    processedContent = processedContent.replace(/\n\n/g, '</p><p>');
    
    // Ensure content is wrapped in paragraph tags
    if (!processedContent.startsWith('<h1>') && !processedContent.startsWith('<h2>') && 
        !processedContent.startsWith('<h3>') && !processedContent.startsWith('<p>')) {
      processedContent = '<p>' + processedContent;
    }
    if (!processedContent.endsWith('</p>') && !processedContent.endsWith('</h1>') && 
        !processedContent.endsWith('</h2>') && !processedContent.endsWith('</h3>')) {
      processedContent += '</p>';
    }
    
    return processedContent;
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (editorRef.current) {
      // Only update if the content actually changed
      const newContent = editorRef.current.innerHTML;
      
      // Prevent jumping by storing selection position
      saveSelection();
      
      onChange(newContent);
    }
  };

  // Focus handler to prevent cursor jumping
  const handleFocus = () => {
    // Do not try to restore the cursor position during initial content load
    if (isInitialRender) return;
    
    // If we've stored a cursor position, try to restore it
    if (currentCursorPosition !== null && editorRef.current) {
      try {
        // Use a slight delay to ensure the editor is ready
        setTimeout(() => {
          // Try to restore from saved range first
          const selection = window.getSelection();
          if (selection && selectionRange) {
            selection.removeAllRanges();
            selection.addRange(selectionRange);
          }
        }, 10);
      } catch (error) {
        console.error("Error restoring cursor position:", error);
      }
    }
  };

  return (
    <div
      ref={editorRef}
      className="min-h-[300px] p-4 focus:outline-none editor-placeholder"
      contentEditable
      suppressContentEditableWarning
      onKeyUp={handleKeyUp}
      onBlur={saveSelection}
      onFocus={handleFocus}
      onClick={saveSelection}
      dangerouslySetInnerHTML={{ __html: value }}
      data-placeholder={placeholder || "Write your content here..."}
    />
  );
};

export default EditorContent;
