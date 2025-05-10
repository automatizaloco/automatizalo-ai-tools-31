
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminPageLoader: React.FC = () => {
  const navigate = useNavigate();
  const [showRetry, setShowRetry] = React.useState(false);
  
  // Add a timeout to show retry button if loading takes too long
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, 5000); // Show retry after 5 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
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
        
        {showRetry && (
          <div className="mt-6 space-y-4">
            <p className="text-amber-600 text-sm">Loading is taking longer than expected.</p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
              <Button 
                onClick={() => window.location.reload()}
              >
                Retry Loading
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageLoader;
