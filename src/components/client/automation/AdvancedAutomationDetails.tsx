import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Activity, Settings, Webhook, FileText, ExternalLink, Table as TableIcon, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import WebhookUrlDisplay from './WebhookUrlDisplay';
import CustomPromptEditor from './CustomPromptEditor';
import FormIntegrationViewer from './FormIntegrationViewer';
import ButtonIntegrationViewer from './ButtonIntegrationViewer';
import TableIntegrationViewer from './TableIntegrationViewer';
import AutomationStatsDashboard from './AutomationStatsDashboard';
import CreateTicketModal from './CreateTicketModal';
import type { ClientAutomation } from '@/types/automation';

const AdvancedAutomationDetails: React.FC = () => {
  const { automationId } = useParams<{ automationId: string; }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const { data: clientAutomation, isLoading, refetch } = useQuery({
    queryKey: ['client-automation', automationId, user?.id],
    queryFn: async () => {
      if (!user || !automationId) throw new Error('Not authenticated or automationId missing');
      const { data, error } = await supabase
        .from('client_automations')
        .select(`
          *,
          automation:automation_id (*)
        `)
        .eq('automation_id', automationId)
        .eq('client_id', user.id)
        .eq('status', 'active')
        .single();
      if (error) throw error;
      return data as ClientAutomation;
    },
    enabled: !!user && !!automationId
  });

  const { data: integrationSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['integration-settings', clientAutomation?.id],
    queryFn: async () => {
      if (!clientAutomation?.id) return [];
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomation.id)
        .order('integration_type');
      if (error) throw error;
      return data;
    },
    enabled: !!clientAutomation?.id
  });

  const getIntegrationTabs = () => {
    if (!integrationSettings) return [];
    
    const tabs = [
      { id: 'overview', label: 'Overview', icon: Activity },
      { id: 'stats', label: 'Estadísticas', icon: BarChart3 }
    ];

    integrationSettings.forEach(setting => {
      if (setting.status === 'active' || setting.status === 'configured') {
        switch (setting.integration_type) {
          case 'webhook':
            tabs.push({ id: 'webhook', label: 'Webhook', icon: Webhook });
            break;
          case 'custom_prompt':
            tabs.push({ id: 'prompt', label: 'Custom Prompt', icon: FileText });
            break;
          case 'form':
            tabs.push({ id: 'form', label: 'Form', icon: ExternalLink });
            break;
          case 'button':
            tabs.push({ id: 'button', label: 'Editor Button', icon: ExternalLink });
            break;
          case 'table':
            tabs.push({ id: 'table', label: 'Vista Externa', icon: TableIcon });
            break;
        }
      }
    });

    return tabs;
  };

  const renderTabContent = () => {
    const webhookSetting = integrationSettings?.find(s => s.integration_type === 'webhook');
    const promptSetting = integrationSettings?.find(s => s.integration_type === 'custom_prompt');
    const formSetting = integrationSettings?.find(s => s.integration_type === 'form');
    const buttonSetting = integrationSettings?.find(s => s.integration_type === 'button');
    const tableSetting = integrationSettings?.find(s => s.integration_type === 'table');

    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'stats':
        return (
          <AutomationStatsDashboard 
            clientAutomationId={clientAutomation.id}
            automationTitle={clientAutomation.automation?.title}
          />
        );
      case 'webhook':
        if (webhookSetting && (webhookSetting.status === 'active' || webhookSetting.status === 'configured')) {
          return <WebhookUrlDisplay webhookData={{
            test_url: webhookSetting.test_url,
            production_url: webhookSetting.production_url
          }} />;
        }
        return <div>Webhook integration not configured</div>;
      case 'prompt':
        if (promptSetting && (promptSetting.status === 'active' || promptSetting.status === 'configured')) {
          return <CustomPromptEditor 
            clientAutomationId={clientAutomation.id} 
            automationName={clientAutomation.automation?.title || 'Unknown Automation'} 
          />;
        }
        return <div>Custom prompt integration not configured</div>;
      case 'form':
        if (formSetting && (formSetting.status === 'active' || formSetting.status === 'configured')) {
          return <FormIntegrationViewer 
            clientAutomationId={clientAutomation.id} 
            automationTitle={clientAutomation.automation?.title} 
          />;
        }
        return <div>Form integration not configured</div>;
      case 'button':
        if (buttonSetting && (buttonSetting.status === 'active' || buttonSetting.status === 'configured')) {
          return <ButtonIntegrationViewer 
            clientAutomationId={clientAutomation.id} 
            automationTitle={clientAutomation.automation?.title} 
          />;
        }
        return <div>Button integration not configured</div>;
      case 'table':
        if (tableSetting && (tableSetting.status === 'active' || tableSetting.status === 'configured')) {
          return <TableIntegrationViewer 
            tableUrl={tableSetting.table_url} 
            tableTitle={tableSetting.table_title} 
            automationTitle={clientAutomation.automation?.title}
            clientAutomationId={clientAutomation.id}
          />;
        }
        return <div>Table integration not configured</div>;
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Automation Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 block">Purchase Date</span>
              <p className="font-medium">{format(new Date(clientAutomation.purchase_date), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className="text-gray-500 block">Next Billing Date</span>
              <p className="font-medium">{format(new Date(clientAutomation.next_billing_date), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className="text-gray-500 block">Status</span>
              <Badge>{clientAutomation.status}</Badge>
            </div>
            <div>
              <span className="text-gray-500 block">Setup Status</span>
              <Badge>{clientAutomation.setup_status}</Badge>
            </div>
          </CardContent>
        </Card>

        {clientAutomation.automation?.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {clientAutomation.automation.description}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientAutomation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Automation Not Found</h2>
            <p className="text-gray-600 mb-8">
              The automation you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/client-portal')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = getIntegrationTabs();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/client-portal')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portal
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {clientAutomation.automation?.title}
              </h1>
              <p className="text-gray-600">
                Purchased on {format(new Date(clientAutomation.purchase_date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={
              clientAutomation.setup_status === 'completed' 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : clientAutomation.setup_status === 'in_progress' 
                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }>
              {clientAutomation.setup_status === 'completed' && 'Ready to Use'}
              {clientAutomation.setup_status === 'in_progress' && 'Setup In Progress'}
              {clientAutomation.setup_status === 'pending' && 'Setup Pending'}
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        {tabs.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Support Ticket Modal */}
        <CreateTicketModal 
          automationId={automationId!} 
          automationTitle={clientAutomation.automation?.title || ''} 
          clientAutomationId={clientAutomation.id} 
        />
      </div>
    </div>
  );
};

export default AdvancedAutomationDetails;
