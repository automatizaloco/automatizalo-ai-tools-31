
import React, { createContext, useContext, useState, useRef } from 'react';

interface RichTextEditorContextType {
  value: string;
  onChange: (value: string) => void;
  selectionRange: Range | null;
  setSelectionRange: (range: Range | null) => void;
  currentCursorPosition: number | null;
  setCurrentCursorPosition: (position: number | null) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  saveSelection: () => void;
  execCommand: (command: string, value?: string) => void;
  isInitialRender: boolean;
  setIsInitialRender: (value: boolean) => void;
  placeholder?: string;
}

const RichTextEditorContext = createContext<RichTextEditorContextType | undefined>(undefined);

export const RichTextEditorProvider: React.FC<{
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ children, value, onChange, placeholder }) => {
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [currentCursorPosition, setCurrentCursorPosition] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  // Save the current cursor position and selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSelectionRange(range.cloneRange());
      
      // Store cursor position for restoration
      if (editorRef.current) {
        const editorElement = editorRef.current;
        
        // Create a range from the beginning of the editor to the cursor
        const cursorRange = document.createRange();
        cursorRange.setStart(editorElement, 0);
        cursorRange.setEnd(range.startContainer, range.startOffset);
        
        setCurrentCursorPosition(cursorRange.toString().length);
      }
    }
  };

  const execCommand = (command: string, value: string = "") => {
    // Store current selection position
    saveSelection();
    
    // Restore selection if we have one saved
    if (selectionRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRange);
    }
    
    document.execCommand(command, false, value);
    
    // Update the value after making changes
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <RichTextEditorContext.Provider
      value={{
        value,
        onChange,
        selectionRange,
        setSelectionRange,
        currentCursorPosition,
        setCurrentCursorPosition,
        editorRef,
        saveSelection,
        execCommand,
        isInitialRender,
        setIsInitialRender,
        placeholder
      }}
    >
      {children}
    </RichTextEditorContext.Provider>
  );
};

export const useRichTextEditor = () => {
  const context = useContext(RichTextEditorContext);
  if (context === undefined) {
    throw new Error('useRichTextEditor must be used within a RichTextEditorProvider');
  }
  return context;
};
