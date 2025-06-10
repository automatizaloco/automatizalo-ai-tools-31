
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { Automation } from '@/types/automation';

const MarketplaceView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Fetch all active automations
  const { data: automations, isLoading: loadingAutomations } = useQuery({
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
  
  // Fetch user's purchased automations to check ownership
  const { data: purchasedAutomations, isLoading: loadingPurchased } = useQuery({
    queryKey: ['purchased-automations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('client_automations')
        .select('automation_id')
        .eq('client_id', user.id)
        .eq('status', 'active');  // Only consider active subscriptions

      if (error) throw error;
      return data.map(item => item.automation_id);
    },
    enabled: !!user,
  });
  
  // Function to check if user owns an automation
  const userOwnsAutomation = (automationId: string): boolean => {
    if (!purchasedAutomations) return false;
    return purchasedAutomations.includes(automationId);
  };
  
  // Function to handle automation purchase
  const handlePurchase = async (automationId: string) => {
    try {
      if (!user) {
        toast.error(t('marketplace.loginToPurchase'));
        return;
      }

      // Check if the user already has an active subscription for this automation
      if (userOwnsAutomation(automationId)) {
        toast.info(t('marketplace.alreadyOwned'));
        return;
      }

      const purchaseDate = new Date().toISOString();
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      
      // Create a client automation record
      const { data, error } = await supabase
        .from('client_automations')
        .insert({
          client_id: user.id,
          automation_id: automationId,
          purchase_date: purchaseDate,
          next_billing_date: nextBillingDate.toISOString(),
          status: 'active',
          setup_status: 'pending'  // New automation starts with pending setup
        })
        .select();
        
      if (error) {
        console.error('Error purchasing automation:', error);
        toast.error(t('marketplace.purchaseError'));
        return;
      }
      
      toast.success(t('marketplace.purchaseSuccess'));
      
      // Refresh data
      await supabase.auth.refreshSession();
    } catch (error) {
      console.error('Error purchasing automation:', error);
      toast.error(t('marketplace.purchaseError'));
    }
  };

  const isLoading = loadingAutomations || loadingPurchased;

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
        <h2 className="text-xl font-medium text-gray-800 mb-2">{t('marketplace.noAutomations')}</h2>
        <p className="text-gray-600 mb-4">
          {t('marketplace.noAutomationsDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {automations.map((automation) => {
        const isOwned = userOwnsAutomation(automation.id);
        
        return (
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
                  <span className="text-gray-500">{t('marketplace.setup')}</span>
                  <p className="font-medium">${automation.installation_price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('marketplace.monthly')}</span>
                  <p className="font-medium">${automation.monthly_price.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Features list */}
              {(automation.has_custom_prompt || automation.has_webhook || 
                automation.has_form_integration || automation.has_table_integration) && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">{t('marketplace.features')}:</p>
                  <ul className="text-xs text-gray-600">
                    {automation.has_custom_prompt && <li className="inline-block mr-2">• {t('marketplace.customPrompts')}</li>}
                    {automation.has_webhook && <li className="inline-block mr-2">• {t('marketplace.webhooks')}</li>}
                    {automation.has_form_integration && <li className="inline-block mr-2">• {t('marketplace.forms')}</li>}
                    {automation.has_table_integration && <li className="inline-block mr-2">• {t('marketplace.tables')}</li>}
                  </ul>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              {isOwned ? (
                <Button 
                  className="w-full"
                  variant="secondary"
                  asChild
                >
                  <Link to={`/client-portal/automations/${automation.id}`}>{t('marketplace.viewDetails')}</Link>
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(automation.id)}
                >
                  {t('marketplace.purchase')}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default MarketplaceView;
