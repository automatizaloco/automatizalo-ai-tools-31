
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, TicketResponse, ClientAutomation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';

const TicketDetailView = () => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [automation, setAutomation] = useState<ClientAutomation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim() || !user || !ticketId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('ticket_responses')
        .insert([{
          ticket_id: ticketId,
          message: newResponse,
          created_by: user.id,
          is_admin: false,
          created_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      toast.success('Response sent successfully');
      setNewResponse('');
      fetchTicketResponses();
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast.error(error.message || 'Failed to send your response');
    } finally {
      setIsSubmitting(false);
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
        <Button onClick={() => navigate('/client-portal')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/client-portal')}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{ticket.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {automation?.automation?.title} • 
                Created on {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={getStatusColor(ticket.status) as any}>
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>
          
          <h3 className="font-bold mb-2">Conversation</h3>
          
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {responses.length > 0 ? (
              responses.map((response) => (
                <div key={response.id} className={`p-3 rounded-lg ${
                  response.is_admin ? 'bg-blue-50 mr-6' : 'bg-gray-50 ml-6'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">
                      {response.is_admin ? 'Support Team' : 'You'}
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
          
          {ticket.status !== 'closed' && (
            <form onSubmit={handleSubmitResponse} className="space-y-3">
              <Textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                required
              />
              <Button 
                type="submit"
                disabled={isSubmitting || !newResponse.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send Response'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetailView;
