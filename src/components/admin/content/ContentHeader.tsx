
import React from 'react';

const ContentHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Website Content Editor</h1>
      </div>
      <p className="text-gray-600 mt-2">
        Edit content and images for different pages of your website
      </p>
    </div>
  );
};

export default ContentHeader;
