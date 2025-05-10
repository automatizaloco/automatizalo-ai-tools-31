
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { AdminOption } from './types';

interface MobileOptionsListProps {
  groupedOptions: Record<string, AdminOption[]>;
  sortedCategories: string[];
}

const MobileOptionsList: React.FC<MobileOptionsListProps> = ({ 
  groupedOptions, 
  sortedCategories 
}) => {
  const navigate = useNavigate();
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {sortedCategories.map((category) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger className="px-2">
            <span className="font-medium">{category}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 px-2">
              {groupedOptions[category].map((option) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={option.route} 
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">{option.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{option.description}</p>
                      <Button 
                        onClick={() => navigate(option.route)}
                        className="w-full"
                        size="sm"
                      >
                        Manage
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default MobileOptionsList;
