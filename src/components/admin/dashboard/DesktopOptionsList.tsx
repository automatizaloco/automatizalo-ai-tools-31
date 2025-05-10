
import React from 'react';
import AdminOptionCard from './AdminOptionCard';
import { AdminOption } from './types';

interface DesktopOptionsListProps {
  adminOptions: AdminOption[];
}

const DesktopOptionsList: React.FC<DesktopOptionsListProps> = ({ adminOptions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {adminOptions.map((option) => (
        <AdminOptionCard key={option.route} option={option} />
      ))}
    </div>
  );
};

export default DesktopOptionsList;
