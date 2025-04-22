
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminContentProps {
  children: ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-white shadow rounded-lg ${isMobile ? 'p-3' : 'p-6'}`}>
      {children}
    </div>
  );
};

export default AdminContent;
