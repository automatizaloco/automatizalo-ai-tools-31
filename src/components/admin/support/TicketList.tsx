
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupportTicket, Automation } from '@/types/automation';

interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  automations: Automation[];
  onSelectTicket: (ticket: SupportTicket) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  automations,
  onSelectTicket,
  filter,
  onFilterChange
}) => {
  const getAutomationTitle = (automationId: string) => {
    const automation = automations.find(a => a.id === automationId);
    return automation?.title || 'Unknown Automation';
  };

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

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tickets</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Tabs defaultValue="all" onValueChange={onFilterChange}>
          <TabsList className="w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => onSelectTicket(ticket)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 truncate max-w-[70%]">{ticket.title}</h3>
                  <Badge variant={getStatusColor(ticket.status) as any} className="ml-auto">
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getAutomationTitle(ticket.automation_id)}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No tickets match your filter
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketList;
