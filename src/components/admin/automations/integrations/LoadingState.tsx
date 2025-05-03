
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <span className="ml-2">Loading integrations...</span>
  </div>
);

export default LoadingState;
