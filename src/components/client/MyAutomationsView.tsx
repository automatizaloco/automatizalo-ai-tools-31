
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Activity, Webhook, FileCode, Table, FileText, Settings, BarChart3 } from 'lucide-react';
import type { ClientAutomation } from '@/types/automation';

const MyAutomationsView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Fetch client automations
  const { data: clientAutomations, isLoading, refetch } = useQuery({
    queryKey: ['client-automations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('client_automations')
        .select(`
          *,
          automation:automation_id (*)
        `)
        .eq('client_id', user.id)
        .eq('status', 'active')
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      
      // Sort automations: completed first, then in_progress, then pending
      const sortedData = (data as ClientAutomation[]).sort((a, b) => {
        const statusOrder = { 'completed': 0, 'in_progress': 1, 'pending': 2 };
        return statusOrder[a.setup_status as keyof typeof statusOrder] - statusOrder[b.setup_status as keyof typeof statusOrder];
      });
      
      return sortedData;
    },
    enabled: !!user,
  });

  const handleCancelSubscription = async (clientAutomationId: string) => {
    try {
      const { error } = await supabase
        .from('client_automations')
        .update({ status: 'canceled' })
        .eq('id', clientAutomationId);

      if (error) throw error;
      
      toast.success(t('clientPortal.cancelSuccess'));
      refetch();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error(t('clientPortal.cancelError'));
    }
  };

  const getSetupStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t('clientPortal.setupPending')}</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{t('clientPortal.setupInProgress')}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t('clientPortal.readyToUse')}</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getIntegrationBadges = (automation: any) => {
    const badges = [];
    if (automation?.has_webhook) badges.push({ icon: Webhook, label: t('clientPortal.webhook'), color: 'bg-purple-50 text-purple-700' });
    if (automation?.has_custom_prompt) badges.push({ icon: FileText, label: t('clientPortal.customPrompt'), color: 'bg-blue-50 text-blue-700' });
    if (automation?.has_form_integration) badges.push({ icon: FileCode, label: t('clientPortal.form'), color: 'bg-green-50 text-green-700' });
    if (automation?.has_table_integration) badges.push({ icon: Table, label: t('clientPortal.table'), color: 'bg-amber-50 text-amber-700' });
    return badges;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
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
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Activity className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('clientPortal.noActiveAutomations')}</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t('clientPortal.noActiveAutomationsDesc')}
        </p>
        <Button 
          onClick={() => navigate('/client-portal?tab=marketplace')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {t('clientPortal.browseMarketplace')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('clientPortal.myAutomationsTitle')}</h2>
          <p className="text-gray-600">{t('clientPortal.myAutomationsDesc')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {clientAutomations.filter(ca => ca.setup_status === 'completed').length} {t('clientPortal.ready')}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {clientAutomations.length} {t('clientPortal.total')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clientAutomations.map((clientAutomation) => {
          const integrationBadges = getIntegrationBadges(clientAutomation.automation);
          
          return (
            <Card key={clientAutomation.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
              {clientAutomation.automation?.image_url && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img 
                    src={clientAutomation.automation.image_url} 
                    alt={clientAutomation.automation?.title || 'Automation'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Automation';
                    }}
                  />
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg leading-tight">
                    {clientAutomation.automation?.title || 'Unknown Automation'}
                  </CardTitle>
                  {getSetupStatusBadge(clientAutomation.setup_status)}
                </div>
                <CardDescription className="text-sm line-clamp-2 leading-relaxed">
                  {clientAutomation.automation?.description || 'No description available'}
                </CardDescription>
                
                {/* Integration Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {integrationBadges.map((badge, index) => (
                    <Badge key={index} variant="outline" className={`text-xs ${badge.color}`}>
                      <badge.icon className="w-3 h-3 mr-1" />
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">{t('clientPortal.purchaseDate')}</span>
                    <p className="font-medium">{format(new Date(clientAutomation.purchase_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t('clientPortal.nextBilling')}</span>
                    <p className="font-medium">
                      {clientAutomation.status === 'active' 
                        ? format(new Date(clientAutomation.next_billing_date), 'MMM d, yyyy') 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t('clientPortal.monthlyPrice')}</span>
                    <p className="font-bold text-green-600">
                      ${clientAutomation.automation?.monthly_price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t('clientPortal.status')}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {t(`clientPortal.${clientAutomation.status}`)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/client-portal/automations/${clientAutomation.automation_id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={clientAutomation.setup_status === 'pending'}
                >
                  {clientAutomation.setup_status === 'pending' ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      {t('clientPortal.settingUp')}
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {t('clientPortal.manage')}
                    </>
                  )}
                </Button>
                
                {clientAutomation.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleCancelSubscription(clientAutomation.id)}
                  >
                    {t('clientPortal.cancel')}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyAutomationsView;
