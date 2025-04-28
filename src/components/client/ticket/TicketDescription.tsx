
import React from 'react';

interface TicketDescriptionProps {
  description: string;
}

const TicketDescription: React.FC<TicketDescriptionProps> = ({ description }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md">
      <h3 className="font-bold mb-2">Description</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
    </div>
  );
};

export default TicketDescription;
