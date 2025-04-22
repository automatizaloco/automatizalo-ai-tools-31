
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { AdminRouteType } from './types';

interface AdminNavItemProps {
  route: AdminRouteType;
  isActive: boolean;
  onClick: () => void;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({ route, isActive, onClick }) => {
  const Icon = route.icon || Globe;
  
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className="justify-start rounded-none h-12 px-4"
      onClick={onClick}
    >
      <Icon className="h-4 w-4 mr-2" />
      {route.label}
    </Button>
  );
};
