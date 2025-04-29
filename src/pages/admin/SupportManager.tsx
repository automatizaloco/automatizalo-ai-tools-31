
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, TicketResponse, Automation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';
import TicketList from '@/components/admin/support/TicketList';
import TicketDetail from '@/components/admin/support/TicketDetail';

const SupportManager = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      fetchSupportTickets(),
      fetchAutomations()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchSupportTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const typedData = data?.map(ticket => ({
        ...ticket,
        status: ticket.status as 'open' | 'in_progress' | 'resolved' | 'closed'
      })) || [];
      
      setTickets(typedData);
      
      if (typedData.length > 0 && !selectedTicket) {
        setSelectedTicket(typedData[0]);
        fetchTicketResponses(typedData[0].id);
      } else if (selectedTicket) {
        // If we have a selected ticket, find the updated version
        const updatedTicket = typedData.find(t => t.id === selectedTicket.id);
        if (updatedTicket) setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast.error('Failed to load support tickets');
    }
  };
  
  const fetchAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*');
        
      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
    }
  };
  
  const fetchTicketResponses = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching ticket responses:', error);
      toast.error('Failed to load ticket responses');
    }
  };

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchTicketResponses(ticket.id);
  };
  
  const handleStatusChange = async (status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    if (!selectedTicket) return;
    
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedTicket.id);
        
      if (error) throw error;
      
      setSelectedTicket({
        ...selectedTicket,
        status,
        updated_at: new Date().toISOString()
      });
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, status, updated_at: new Date().toISOString() }
          : ticket
      ));
      
      toast.success(`Ticket status updated to ${status}`);
    } catch (error: any) {
      console.error('Error updating ticket status:', error);
      toast.error(error.message || 'Failed to update ticket status');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Ticket Manager</h1>
        <Button onClick={fetchSupportTickets} variant="outline">Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TicketList
            tickets={tickets}
            selectedTicket={selectedTicket}
            automations={automations}
            onSelectTicket={handleSelectTicket}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
        
        <div className="md:col-span-2">
          <TicketDetail
            ticket={selectedTicket}
            responses={responses}
            automations={automations}
            user={user}
            onStatusChange={handleStatusChange}
            onResponseSubmit={fetchSupportTickets}
            fetchTicketResponses={fetchTicketResponses}
          />
        </div>
      </div>
    </div>
  );
};

export default SupportManager;
