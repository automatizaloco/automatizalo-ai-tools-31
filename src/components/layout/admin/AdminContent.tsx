
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AdminContentProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

const AdminContent: React.FC<AdminContentProps> = ({ 
  children, 
  className, 
  padded = true 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border",
        padded && (isMobile ? "p-3" : "p-6"), 
        "overflow-x-auto overflow-y-visible",
        className
      )}
    >
      {children}
    </div>
  );
};

export default React.memo(AdminContent);
