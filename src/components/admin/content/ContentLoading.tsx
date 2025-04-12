
import React from 'react';

const ContentLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading content...</p>
      </div>
    </div>
  );
};

export default ContentLoading;
