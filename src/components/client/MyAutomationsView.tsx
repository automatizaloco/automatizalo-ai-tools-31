
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { ClientAutomation } from '@/types/automation';

const MyAutomationsView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch client automations
  const { data: clientAutomations, isLoading } = useQuery({
    queryKey: ['client-automations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('client_automations')
        .select(`
          *,
          automation:automation_id (*)
        `)
        .eq('client_id', user.id);

      if (error) throw error;
      return data as ClientAutomation[];
    },
    enabled: !!user,
  });

  const handleCancelSubscription = async (clientAutomationId: string) => {
    try {
      // Update the status to canceled
      const { error } = await supabase
        .from('client_automations')
        .update({ status: 'canceled' })
        .eq('id', clientAutomationId);

      if (error) throw error;
      
      toast.success('Subscription canceled successfully');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <Skeleton className="h-[150px] rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!clientAutomations || clientAutomations.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-medium text-gray-800 mb-2">No Automations</h2>
        <p className="text-gray-600 mb-4">
          You haven't purchased any automations yet.
        </p>
        <Button 
          variant="outline"
          onClick={() => navigate('/client-portal/marketplace')}
        >
          Browse Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clientAutomations.map((clientAutomation) => (
        <Card key={clientAutomation.id} className="flex flex-col">
          {clientAutomation.automation?.image_url && (
            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
              <img 
                src={clientAutomation.automation.image_url} 
                alt={clientAutomation.automation?.title || 'Automation'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400?text=Automation';
                }}
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{clientAutomation.automation?.title || 'Unknown Automation'}</CardTitle>
              <Badge className={getBadgeColor(clientAutomation.status)}>
                {clientAutomation.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {clientAutomation.automation?.description || 'No description available'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Purchase Date</span>
                <p>{format(new Date(clientAutomation.purchase_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <span className="text-gray-500">Next Billing</span>
                <p>{clientAutomation.status === 'active' 
                    ? format(new Date(clientAutomation.next_billing_date), 'MMM d, yyyy') 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Monthly Price</span>
                <p className="font-medium">
                  ${clientAutomation.automation?.monthly_price.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/client-portal/automations/${clientAutomation.automation_id}`)}
            >
              View Details
            </Button>
            
            {clientAutomation.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleCancelSubscription(clientAutomation.id)}
              >
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MyAutomationsView;
