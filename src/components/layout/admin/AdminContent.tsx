
import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AdminContentProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  minHeight?: string;
}

const AdminContent: React.FC<AdminContentProps> = ({ 
  children, 
  className, 
  padded = true,
  minHeight = 'auto'
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
      style={{ minHeight }}
    >
      {children}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(AdminContent);
