
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ClientAutomation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface NewSupportTicketFormProps {
  preselectedAutomationId?: string;
}

const NewSupportTicketForm: React.FC<NewSupportTicketFormProps> = ({ preselectedAutomationId }) => {
  const [automations, setAutomations] = useState<ClientAutomation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    automationId: preselectedAutomationId || ''
  });
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMyAutomations();
    }
  }, [user]);

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
      
      // Properly type the data from the database
      const typedData = (data || []).map(item => ({
        ...item,
        id: item.id,
        client_id: item.client_id,
        automation_id: item.automation_id,
        purchase_date: item.purchase_date,
        status: item.status as 'active' | 'canceled' | 'pending',
        next_billing_date: item.next_billing_date,
        setup_status: item.setup_status as 'pending' | 'in_progress' | 'completed',
        automation: item.automation
      }) as ClientAutomation);
      
      setAutomations(typedData);
      
      if (typedData.length > 0 && !preselectedAutomationId) {
        setFormData(prev => ({
          ...prev,
          automationId: typedData[0].automation_id
        }));
      }
    } catch (error) {
      console.error('Error fetching client automations:', error);
      toast.error(t('support.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutomationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      automationId: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('marketplace.loginToPurchase'));
      return;
    }
    
    if (!formData.automationId) {
      toast.error(t('support.selectAutomation'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          client_id: user.id,
          automation_id: formData.automationId,
          title: formData.title,
          description: formData.description,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      toast.success(t('support.createSuccess'));
      navigate('/client-portal');
    } catch (error: any) {
      console.error('Error creating support ticket:', error);
      toast.error(error.message || t('support.createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (automations.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-2">{t('support.noActiveAutomations')}</h2>
        <p className="text-gray-500 mb-4">{t('support.noActiveAutomationsDesc')}</p>
        <Button onClick={() => navigate('/client-portal/marketplace')}>
          {t('support.browseMarketplace')}
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('support.createNewTicket')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="automationId">{t('support.selectAutomation')}</Label>
            <Select 
              value={formData.automationId} 
              onValueChange={handleAutomationChange}
              disabled={!!preselectedAutomationId}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('support.selectAutomationPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {automations.map((item) => (
                  <SelectItem key={item.automation_id} value={item.automation_id}>
                    {item.automation?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">{t('support.title')}</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('support.titlePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('support.description')}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('support.descriptionPlaceholder')}
              rows={6}
              required
            />
          </div>

          <div className="pt-2 flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/client-portal/support')}
            >
              {t('support.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('support.submitting') : t('support.submit')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewSupportTicketForm;
