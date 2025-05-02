
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { Automation } from '@/types/automation';

const MarketplaceView: React.FC = () => {
  const { user } = useAuth();

  // Fetch all active automations
  const { data: automations, isLoading } = useQuery({
    queryKey: ['marketplace-automations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Automation[];
    },
  });
  
  // Function to handle automation purchase
  const handlePurchase = async (automationId: string) => {
    try {
      if (!user) {
        toast.error('Please login to purchase automations');
        return;
      }

      const purchaseDate = new Date().toISOString();
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      
      // Create a client automation record
      const { error } = await supabase
        .from('client_automations')
        .insert({
          client_id: user.id,
          automation_id: automationId,
          purchase_date: purchaseDate,
          next_billing_date: nextBillingDate.toISOString(),
          status: 'active'
        });
        
      if (error) {
        console.error('Error purchasing automation:', error);
        if (error.code === '23505') { // Unique violation
          toast.warning('You already own this automation');
        } else {
          toast.error('Failed to purchase automation');
        }
        return;
      }
      
      toast.success('Automation purchased successfully!');
    } catch (error) {
      console.error('Error purchasing automation:', error);
      toast.error('An error occurred during purchase');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-[180px] rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!automations || automations.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-medium text-gray-800 mb-2">No Automations Available</h2>
        <p className="text-gray-600 mb-4">
          There are currently no automations available in the marketplace.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {automations.map((automation) => (
        <Card key={automation.id} className="flex flex-col">
          <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
            {automation.image_url ? (
              <img 
                src={automation.image_url} 
                alt={automation.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400?text=Automation';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          <CardHeader>
            <CardTitle>{automation.title}</CardTitle>
            <CardDescription className="line-clamp-2">{automation.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Setup</span>
                <p className="font-medium">${automation.installation_price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Monthly</span>
                <p className="font-medium">${automation.monthly_price.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Features list */}
            {(automation.has_custom_prompt || automation.has_webhook || 
              automation.has_form_integration || automation.has_table_integration) && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-1">Features:</p>
                <ul className="text-xs text-gray-600">
                  {automation.has_custom_prompt && <li className="inline-block mr-2">• Custom prompts</li>}
                  {automation.has_webhook && <li className="inline-block mr-2">• Webhooks</li>}
                  {automation.has_form_integration && <li className="inline-block mr-2">• Forms</li>}
                  {automation.has_table_integration && <li className="inline-block mr-2">• Tables</li>}
                </ul>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handlePurchase(automation.id)}
            >
              Purchase
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MarketplaceView;
