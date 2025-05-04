
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminContentProps {
  children: ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-white shadow rounded-lg ${isMobile ? 'p-3 mx-2 overflow-hidden' : 'p-6'}`}>
      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminContent;
