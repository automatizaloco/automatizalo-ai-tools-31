
import React from 'react';
import { Loader2 } from 'lucide-react';

const AdminPageLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">Loading admin dashboard...</p>
      </div>
    </div>
  );
};

export default AdminPageLoader;
