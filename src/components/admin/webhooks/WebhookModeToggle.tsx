
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface WebhookModeToggleProps {
  isProduction: boolean;
  onToggle: (checked: boolean) => void;
}

const WebhookModeToggle = ({ isProduction, onToggle }: WebhookModeToggleProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="mode">Production Mode</Label>
        <Switch 
          id="mode"
          checked={isProduction}
          onCheckedChange={onToggle}
        />
      </div>
      <p className="text-xs text-gray-500">
        When enabled, the production URL will be used. Otherwise, the test URL will be used.
      </p>
    </div>
  );
};

export default WebhookModeToggle;
