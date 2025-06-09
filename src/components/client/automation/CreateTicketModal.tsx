
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Ticket, MessageSquare } from 'lucide-react';

interface CreateTicketModalProps {
  automationId: string;
  automationTitle: string;
  clientAutomationId: string;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  automationId,
  automationTitle,
  clientAutomationId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'support' // support or feature_request
  });
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a support ticket');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const ticketTitle = `[${formData.type === 'feature_request' ? 'Feature Request' : 'Support'}] ${formData.title}`;
      const ticketDescription = `**Automation:** ${automationTitle}\n**Type:** ${formData.type === 'feature_request' ? 'Feature Request' : 'Support Issue'}\n\n${formData.description}`;

      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          client_id: user.id,
          automation_id: automationId,
          title: ticketTitle,
          description: ticketDescription,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      toast.success('Support ticket created successfully');
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        type: 'support'
      });
    } catch (error: any) {
      console.error('Error creating support ticket:', error);
      toast.error(error.message || 'Failed to create support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Create Support Ticket
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Automation</Label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {automationTitle}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === 'support' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeChange('support')}
                className="flex-1"
              >
                Support Issue
              </Button>
              <Button
                type="button"
                variant={formData.type === 'feature_request' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeChange('feature_request')}
                className="flex-1"
              >
                Feature Request
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={formData.type === 'feature_request' ? 'New feature idea...' : 'Brief description of the issue...'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                formData.type === 'feature_request' 
                  ? 'Describe the feature you would like to see...' 
                  : 'Please provide details about the issue...'
              }
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
