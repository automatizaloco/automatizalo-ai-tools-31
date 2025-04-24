
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Automation, ClientAutomation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const MarketplaceView = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [purchasedAutomations, setPurchasedAutomations] = useState<ClientAutomation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchAutomations(),
        fetchPurchasedAutomations()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user]);

  const fetchAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('active', true)
        .order('title');
        
      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      toast.error('Failed to load automation marketplace');
    }
  };

  const fetchPurchasedAutomations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('client_automations')
        .select('*')
        .eq('client_id', user.id);
        
      if (error) throw error;
      
      // Cast the data to the correct type
      const typedData = data?.map(item => ({
        ...item,
        status: item.status as 'active' | 'canceled' | 'pending'
      })) || [];
      
      setPurchasedAutomations(typedData);
    } catch (error) {
      console.error('Error fetching purchased automations:', error);
    }
  };

  const handlePurchase = async () => {
    if (!user || !selectedAutomation) return;
    
    try {
      // Calculate next billing date (1 month from now)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const { error } = await supabase
        .from('client_automations')
        .insert([{
          client_id: user.id,
          automation_id: selectedAutomation.id,
          status: 'active' as 'active' | 'canceled' | 'pending',
          next_billing_date: nextMonth.toISOString(),
          purchase_date: new Date().toISOString()
        }]);
        
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('You already own this automation');
        } else {
          throw error;
        }
      } else {
        toast.success(`Successfully purchased ${selectedAutomation.title}`);
        await fetchPurchasedAutomations(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Error purchasing automation:', error);
      toast.error(error.message || 'Failed to purchase automation');
    } finally {
      setShowPurchaseDialog(false);
      setSelectedAutomation(null);
    }
  };

  const startPurchaseProcess = (automation: Automation) => {
    setSelectedAutomation(automation);
    setShowPurchaseDialog(true);
  };

  const isAlreadyPurchased = (automationId: string) => {
    return purchasedAutomations.some(
      item => item.automation_id === automationId && item.status === 'active'
    );
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
        <p className="text-gray-500">There are no automations available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-6">Automation Marketplace</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((automation) => {
          const isPurchased = isAlreadyPurchased(automation.id);
          
          return (
            <Card key={automation.id}>
              {automation.image_url && (
                <div className="w-full h-40 bg-gray-100">
                  <img 
                    src={automation.image_url} 
                    alt={automation.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{automation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{automation.description}</p>
                
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Installation Fee:</span>
                    <span className="font-medium">${automation.installation_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Fee:</span>
                    <span className="font-medium">${automation.monthly_price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={isPurchased}
                  onClick={() => startPurchaseProcess(automation)}
                >
                  {isPurchased ? 'Already Purchased' : 'Purchase'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <AlertDialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAutomation && (
                <>
                  <p className="mb-2">Are you sure you want to purchase {selectedAutomation.title}?</p>
                  <p className="mb-1">One-time installation fee: ${selectedAutomation.installation_price.toFixed(2)}</p>
                  <p>Monthly recurring fee: ${selectedAutomation.monthly_price.toFixed(2)}</p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAutomation(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurchase}>Confirm Purchase</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MarketplaceView;
