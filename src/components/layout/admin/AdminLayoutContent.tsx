
import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

interface AdminLayoutContentProps {
  children: React.ReactNode;
  title?: string;
  hideTitle?: boolean;
  isPageLoading: boolean;
}

const AdminLayoutContent: React.FC<AdminLayoutContentProps> = ({
  children,
  title,
  hideTitle = true, // Mantener en true por defecto para ocultar todos los títulos
  isPageLoading
}) => {
  const isMobile = useIsMobile();
  
  return <div className="w-full overflow-hidden">
      {isPageLoading && <div className="fixed top-0 left-0 right-0 z-50">
          <Progress value={100} className="h-1 animate-pulse" />
        </div>}
      
      <div className={`${isMobile ? 'mt-2 px-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'}`}>
        {/* El título ahora está oculto por defecto */}
        {!hideTitle && title && <h2 className="sr-only">{title}</h2>}
        
        <div className="mt-2 overflow-hidden">
          {children}
        </div>
      </div>
    </div>;
};

export default memo(AdminLayoutContent);
