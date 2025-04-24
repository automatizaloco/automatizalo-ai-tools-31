
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Automation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';

const MarketplaceView = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      toast.error('Failed to load available automations');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (automationId: string) => {
    if (!user) {
      toast.error('You must be logged in to purchase automations');
      return;
    }
    
    setPurchasingId(automationId);
    
    try {
      // Check if user already has this automation
      const { data: existingData, error: existingError } = await supabase
        .from('client_automations')
        .select('*')
        .eq('client_id', user.id)
        .eq('automation_id', automationId)
        .eq('status', 'active')
        .maybeSingle();
      
      if (existingError) throw existingError;
      
      if (existingData) {
        toast.info('You already have this automation');
        return;
      }
      
      // Create new client automation
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      
      const { error } = await supabase
        .from('client_automations')
        .insert([{
          client_id: user.id,
          automation_id: automationId,
          purchase_date: new Date().toISOString(),
          status: 'active',
          next_billing_date: nextBillingDate.toISOString()
        }]);
        
      if (error) throw error;
      
      toast.success('Automation purchased successfully');
      // Redirect to my automations page or refresh the current page
    } catch (error: any) {
      console.error('Error purchasing automation:', error);
      toast.error(error.message || 'Failed to purchase automation');
    } finally {
      setPurchasingId(null);
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
        <h2 className="text-xl font-bold mb-2">No Automations Available</h2>
        <p className="text-gray-500">Check back soon for new automation solutions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {automations.map((automation) => (
        <Card key={automation.id} className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-lg">{automation.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 mb-4">{automation.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Installation</span>
                <span className="font-semibold">${automation.installation_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Monthly</span>
                <span className="font-semibold">${automation.monthly_price.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handlePurchase(automation.id)}
              disabled={purchasingId === automation.id}
            >
              {purchasingId === automation.id ? 'Processing...' : 'Purchase'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MarketplaceView;
