
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TicketResponseFormProps {
  ticketId: string;
  ticketStatus: string;
  onResponseSent: () => void;
}

const TicketResponseForm: React.FC<TicketResponseFormProps> = ({ 
  ticketId, 
  ticketStatus,
  onResponseSent
}) => {
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
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
      onResponseSent();
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast.error(error.message || 'Failed to send your response');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (ticketStatus === 'closed') {
    return null;
  }
  
  return (
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
  );
};

export default TicketResponseForm;
