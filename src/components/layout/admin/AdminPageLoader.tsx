
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminPageLoader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-sm">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">Loading admin dashboard...</p>
          <p className="text-sm text-gray-500">Please wait while we prepare your experience</p>
        </div>
        
        <div className="w-full max-w-md mt-4 space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-4/5" />
          <Skeleton className="h-2 w-3/5" />
        </div>
      </div>
    </div>
  );
};

export default AdminPageLoader;
