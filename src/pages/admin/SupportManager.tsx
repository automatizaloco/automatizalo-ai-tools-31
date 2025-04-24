
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, TicketResponse, Automation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SupportManager = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
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
      setTickets(data || []);
      
      // Select first ticket by default if available
      if (data && data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
        fetchTicketResponses(data[0].id);
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
  
  const handleStatusChange = async (status: string) => {
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
      
      // Update local state
      setSelectedTicket({
        ...selectedTicket,
        status,
        updated_at: new Date().toISOString()
      });
      
      // Update tickets list
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
  
  const handleSubmitResponse = async () => {
    if (!selectedTicket || !user || !newResponse.trim()) return;
    
    try {
      const { error } = await supabase
        .from('ticket_responses')
        .insert([{
          ticket_id: selectedTicket.id,
          message: newResponse,
          created_by: user.email,
          is_admin: true,
          created_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      // Update response list
      fetchTicketResponses(selectedTicket.id);
      
      // Update ticket status to in_progress if it's open
      if (selectedTicket.status === 'open') {
        handleStatusChange('in_progress');
      }
      
      // Clear input
      setNewResponse('');
      
      toast.success('Response submitted successfully');
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast.error(error.message || 'Failed to submit response');
    }
  };

  const filterTickets = (status: string) => {
    setFilter(status);
  };
  
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });
  
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
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tickets</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <Tabs defaultValue="all" onValueChange={filterTickets}>
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
                      onClick={() => handleSelectTicket(ticket)}
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
        </div>
        
        <div className="md:col-span-2">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTicket.title}</CardTitle>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>Automation: {getAutomationTitle(selectedTicket.automation_id)}</p>
                      <p>Created: {new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getStatusColor(selectedTicket.status) as any}>
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                    <Select value={selectedTicket.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
                
                <h3 className="font-bold mb-2">Conversation</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  {responses.length > 0 ? (
                    responses.map((response) => (
                      <div key={response.id} className={`p-3 rounded-lg ${
                        response.is_admin ? 'bg-blue-50 ml-6' : 'bg-gray-50 mr-6'
                      }`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                            {response.is_admin ? 'Support Team' : 'Client'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(response.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No responses yet
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                  />
                  <Button 
                    onClick={handleSubmitResponse}
                    disabled={!newResponse.trim()}
                  >
                    Send Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Select a ticket to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportManager;
