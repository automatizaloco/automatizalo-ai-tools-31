
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminOption } from './types';

interface AdminOptionCardProps {
  option: AdminOption;
}

const AdminOptionCard: React.FC<AdminOptionCardProps> = ({ option }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const Icon = option.icon;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 md:pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <CardTitle className="text-lg md:text-xl">{option.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2 md:pb-4">
        <CardDescription className="text-sm md:text-base">{option.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(option.route)}
          className="w-full"
          size={isMobile ? "sm" : "default"}
        >
          Manage {option.title}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminOptionCard;
