
import React from 'react';

const EmptyClientAutomationsState: React.FC = () => {
  return (
    <div className="border rounded-lg p-8 text-center">
      <p className="text-gray-500 mb-1">No client automations found</p>
      <p className="text-gray-400 text-sm">
        Clients need to purchase automations from the marketplace to appear here
      </p>
    </div>
  );
};

export default EmptyClientAutomationsState;
