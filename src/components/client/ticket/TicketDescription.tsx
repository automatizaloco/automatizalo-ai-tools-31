
import React from 'react';
import { SupportTicket } from '@/types/automation';

interface TicketDescriptionProps {
  ticket: SupportTicket;
}

const TicketDescription: React.FC<TicketDescriptionProps> = ({ ticket }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md">
      <h3 className="font-bold mb-2">Description</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
    </div>
  );
};

export default TicketDescription;
