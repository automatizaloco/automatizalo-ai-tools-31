
import React from 'react';
import { SupportTicket } from '@/types/automation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TicketCardProps {
  ticket: SupportTicket;
  automationTitle: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, automationTitle }) => {
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
    <Card key={ticket.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium truncate">{ticket.title}</h3>
          </div>
          <Badge variant={getStatusColor(ticket.status) as any} className="ml-2 shrink-0">
            {ticket.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 truncate">
          {automationTitle} • 
          Created on {new Date(ticket.created_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-3">{ticket.description}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/client-portal/support/${ticket.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
