
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WebhookUrlFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  description?: string;
}

const WebhookUrlField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder,
  description 
}: WebhookUrlFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default WebhookUrlField;
