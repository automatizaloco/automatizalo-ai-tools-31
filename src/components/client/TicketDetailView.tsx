
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, TicketResponse, ClientAutomation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';

// Import our new components
import TicketHeader from './ticket/TicketHeader';
import TicketDescription from './ticket/TicketDescription';
import TicketConversation from './ticket/TicketConversation';
import TicketResponseForm from './ticket/TicketResponseForm';

const TicketDetailView = () => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [automation, setAutomation] = useState<ClientAutomation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ticketId } = useParams<{ ticketId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && ticketId) {
      fetchTicketDetails();
      fetchTicketResponses();
    }
  }, [user, ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .eq('client_id', user?.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) {
        toast.error('Ticket not found or you do not have permission to view it');
        navigate('/client-portal');
        return;
      }
      
      // Convert string status to the correct type
      const typedTicket: SupportTicket = {
        ...data,
        status: data.status as 'open' | 'in_progress' | 'resolved' | 'closed'
      };
      
      setTicket(typedTicket);
      
      // Fetch automation details
      const { data: automationData, error: automationError } = await supabase
        .from('client_automations')
        .select('*, automation:automation_id(*)')
        .eq('client_id', user?.id)
        .eq('automation_id', data.automation_id)
        .maybeSingle();
        
      if (automationError) throw automationError;
      
      if (automationData) {
        const typedAutomation: ClientAutomation = {
          ...automationData,
          status: automationData.status as 'active' | 'canceled' | 'pending'
        };
        setAutomation(typedAutomation);
      }
    } catch (error: any) {
      console.error('Error fetching ticket details:', error);
      toast.error(error.message || 'Failed to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTicketResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setResponses(data || []);
    } catch (error: any) {
      console.error('Error fetching ticket responses:', error);
      toast.error(error.message || 'Failed to load ticket responses');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Ticket not found or you do not have permission to view it.</p>
        <button 
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => navigate('/client-portal')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <TicketHeader ticket={ticket} automation={automation} />
        </CardHeader>
        <CardContent>
          <TicketDescription description={ticket.description} />
          
          <h3 className="font-bold mb-2">Conversation</h3>
          <TicketConversation responses={responses} />
          
          <TicketResponseForm 
            ticketId={ticket.id} 
            ticketStatus={ticket.status} 
            onResponseSent={fetchTicketResponses} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetailView;
