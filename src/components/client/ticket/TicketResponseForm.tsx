
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface TicketResponseFormProps {
  ticketId: string;
}

const TicketResponseForm: React.FC<TicketResponseFormProps> = ({ ticketId }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to respond");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ticket_responses')
        .insert({
          ticket_id: ticketId,
          message: message.trim(),
          created_by: user.id,
          is_admin: false
        });

      if (error) throw error;

      toast.success("Response submitted successfully");
      setMessage('');
      
      // Invalidate and refetch ticket responses
      queryClient.invalidateQueries({ queryKey: ['ticket-responses', ticketId] });
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h4 className="font-medium mb-2">Your Response</h4>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        rows={4}
        className="resize-none mb-3"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || !message.trim()}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? 'Sending...' : 'Send Response'}
      </Button>
    </form>
  );
};

export default TicketResponseForm;
