
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { SupportTicket } from '@/types/automation';

interface TicketHeaderProps {
  ticket: SupportTicket;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ ticket }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-bold">{ticket.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Created on {new Date(ticket.created_at).toLocaleDateString()}
        </p>
      </div>
      <Badge variant={getStatusColor(ticket.status) as any}>
        {ticket.status.replace('_', ' ')}
      </Badge>
    </div>
  );
};

export default TicketHeader;
