
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, ClientAutomation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';

const SupportTicketsView = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [automations, setAutomations] = useState<ClientAutomation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchSupportTickets(),
        fetchMyAutomations()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user]);

  const fetchSupportTickets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast.error('Failed to load your support tickets');
    }
  };
  
  const fetchMyAutomations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('client_automations')
        .select('*, automation:automation_id(*)')
        .eq('client_id', user.id)
        .eq('status', 'active')
        .order('purchase_date', { ascending: false });
        
      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching client automations:', error);
    }
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

  const getAutomationTitle = (automationId: string) => {
    const clientAutomation = automations.find(a => a.automation_id === automationId);
    return clientAutomation?.automation?.title || 'Unknown Automation';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Support Tickets</h2>
        <Button onClick={() => window.location.href = '/client-portal/support/new'}>
          Create New Ticket
        </Button>
      </div>
      
      {tickets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't created any support tickets yet.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/client-portal/support/new'}>
            Create Your First Ticket
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <Badge variant={getStatusColor(ticket.status) as any}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {getAutomationTitle(ticket.automation_id)} • 
                  Created on {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{ticket.description.substring(0, 150)}
                  {ticket.description.length > 150 ? '...' : ''}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = `/client-portal/support/${ticket.id}`}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTicketsView;
