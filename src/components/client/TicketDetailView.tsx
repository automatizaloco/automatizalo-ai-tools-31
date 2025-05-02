
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SupportTicket, TicketResponse } from '@/types/automation';
import { TicketHeader } from './ticket/TicketHeader';
import { TicketDescription } from './ticket/TicketDescription';
import { TicketConversation } from './ticket/TicketConversation';
import { TicketResponseForm } from './ticket/TicketResponseForm';

interface TicketDetailViewProps {
  ticketId?: string;
}

const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticketId: propTicketId }) => {
  const { ticketId: paramTicketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  
  // Use the prop ticketId if provided, otherwise use the one from URL params
  const ticketId = propTicketId || paramTicketId;
  
  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      if (!ticketId) throw new Error('No ticket ID provided');
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
        
      if (error) throw error;
      return data as SupportTicket;
    },
    enabled: !!ticketId,
  });
  
  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ['ticket-responses', ticketId],
    queryFn: async () => {
      if (!ticketId) throw new Error('No ticket ID provided');
      
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data as TicketResponse[];
    },
    enabled: !!ticketId,
  });
  
  if (!ticketId) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Ticket ID is required.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={() => navigate('/client-portal')}
        >
          Back to Client Portal
        </Button>
      </div>
    );
  }
  
  const isLoading = ticketLoading || responsesLoading;
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/client-portal')}
          className="flex items-center gap-1 mb-4 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Support
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : ticket ? (
        <div className="space-y-6">
          <TicketHeader ticket={ticket} />
          <TicketDescription ticket={ticket} />
          <Card>
            <CardContent className="pt-6">
              <TicketConversation responses={responses || []} />
              
              {ticket.status !== 'closed' && (
                <TicketResponseForm ticketId={ticketId} />
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-700">Ticket not found or you don't have permission to view it.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => navigate('/client-portal')}
          >
            Back to Client Portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketDetailView;
