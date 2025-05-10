
import React from 'react';
import { Globe } from 'lucide-react';
import { AdminRouteType } from './types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminNavItemProps {
  route: AdminRouteType;
  isActive: boolean;
  onClick: () => void;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({ route, isActive, onClick }) => {
  const Icon = route.icon || Globe;
  const isMobile = useIsMobile();
  
  return (
    <button
      className={cn(
        "relative w-full flex items-center text-left px-4 py-3 transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-gray-100 text-gray-700"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="truncate">{route.label}</span>
      
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className={cn(
            "absolute left-0 w-1 bg-primary", 
            isMobile ? "h-full" : "top-0 bottom-0"
          )}
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
    </button>
  );
};

export default AdminNavItem;
