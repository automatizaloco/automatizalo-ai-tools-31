
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RequestMethod } from "@/stores/webhookStore";

interface WebhookMethodSelectorProps {
  value: RequestMethod;
  onValueChange: (value: RequestMethod) => void;
}

const WebhookMethodSelector = ({ value, onValueChange }: WebhookMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Request Method</Label>
      <RadioGroup 
        value={value}
        onValueChange={(value) => onValueChange(value as RequestMethod)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="POST" id="post" />
          <Label htmlFor="post">POST</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="GET" id="get" />
          <Label htmlFor="get">GET</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default WebhookMethodSelector;
