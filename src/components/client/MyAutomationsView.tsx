
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ClientAutomation } from '@/types/automation';
import { useAuth } from '@/context/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const MyAutomationsView = () => {
  const [automations, setAutomations] = useState<ClientAutomation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyAutomations();
    }
  }, [user]);

  const fetchMyAutomations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_automations')
        .select('*, automation:automation_id(*)')
        .eq('client_id', user.id)
        .order('purchase_date', { ascending: false });
        
      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching my automations:', error);
      toast.error('Failed to load your automations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAutomation = async () => {
    if (!cancelingId) return;
    
    try {
      const { error } = await supabase
        .from('client_automations')
        .update({ status: 'canceled' })
        .eq('id', cancelingId);
        
      if (error) throw error;
      
      toast.success('Automation canceled successfully');
      fetchMyAutomations();
    } catch (error: any) {
      console.error('Error canceling automation:', error);
      toast.error(error.message || 'Failed to cancel automation');
    } finally {
      setCancelingId(null);
      setShowCancelDialog(false);
    }
  };

  const startCancelProcess = (id: string) => {
    setCancelingId(id);
    setShowCancelDialog(true);
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
        <h2 className="text-xl font-bold mb-2">No Active Automations</h2>
        <p className="text-gray-500 mb-4">You haven't purchased any automations yet.</p>
        <Button onClick={() => window.location.href = '/client-portal/marketplace'}>
          Browse Marketplace
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((clientAutomation) => {
          const automation = clientAutomation.automation;
          if (!automation) return null;
          
          const isActive = clientAutomation.status === 'active';
          const nextBilling = new Date(clientAutomation.next_billing_date);
          const purchaseDate = new Date(clientAutomation.purchase_date);
          
          return (
            <Card key={clientAutomation.id} className={!isActive ? 'opacity-75' : ''}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{automation.title}</CardTitle>
                  <div className="mt-1">
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {clientAutomation.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{automation.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purchase Date:</span>
                    <span>{purchaseDate.toLocaleDateString()}</span>
                  </div>
                  {isActive && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Billing:</span>
                      <span>{nextBilling.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Fee:</span>
                    <span>${automation.monthly_price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = `/client-portal/support/new?automation=${clientAutomation.id}`}
                >
                  Get Support
                </Button>
                {isActive && (
                  <Button 
                    variant="destructive" 
                    onClick={() => startCancelProcess(clientAutomation.id)}
                  >
                    Cancel Service
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Automation Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this automation service? This will stop all recurring charges, but you will lose access to the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelingId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelAutomation}>Confirm Cancellation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyAutomationsView;
