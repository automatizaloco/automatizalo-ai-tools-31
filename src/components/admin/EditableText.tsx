
import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface EditableTextProps {
  id: string;
  defaultText: string;
  multiline?: boolean;
  onSave?: (value: string) => void;
  disabled?: boolean;
}

const EditableText = ({ id, defaultText, multiline = false, onSave, disabled = false }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(defaultText);
  const [pendingText, setPendingText] = useState(defaultText);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setPendingText(text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingText(text);
  };

  const handleSave = () => {
    setText(pendingText);
    setIsEditing(false);
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave(pendingText);
    }
    
    // Show a toast success message
    toast.success('Content updated successfully!');
  };

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <Textarea
            value={pendingText}
            onChange={(e) => setPendingText(e.target.value)}
            className="w-full min-h-[60px] p-2 border-2 border-blue-400 focus:border-blue-500 rounded"
            placeholder="Enter text..."
            disabled={disabled}
          />
        ) : (
          <Input
            value={pendingText}
            onChange={(e) => setPendingText(e.target.value)}
            className="w-full p-2 border-2 border-blue-400 focus:border-blue-500 rounded"
            placeholder="Enter text..."
            disabled={disabled}
          />
        )}
        <div className="flex mt-2 justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="p-1 h-8 w-8"
            onClick={handleCancel}
            disabled={disabled}
          >
            <XIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="p-1 h-8 w-8 bg-green-600 hover:bg-green-700"
            onClick={handleSave}
            disabled={disabled}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`group relative inline-block ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      onClick={handleEdit}
    >
      {text}
      {!disabled && (
        <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <PencilIcon className="h-4 w-4 text-blue-500" />
        </span>
      )}
    </span>
  );
};

export default EditableText;
