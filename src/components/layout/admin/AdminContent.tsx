
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminContentProps {
  children: ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${isMobile ? 'p-3 mx-2' : 'p-6'}`}>
      <div className="w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default AdminContent;
