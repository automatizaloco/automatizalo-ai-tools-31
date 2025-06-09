
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity, AlertCircle, CheckCircle, Clock, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWebhookAnalytics } from '@/hooks/useWebhookAnalytics';

interface WebhookAnalyticsDashboardProps {
  clientAutomationId: string;
  automationTitle: string;
}

interface WebhookSetting {
  id: string;
  test_url?: string;
  production_url?: string;
  status: string;
}

const WebhookAnalyticsDashboard: React.FC<WebhookAnalyticsDashboardProps> = ({
  clientAutomationId,
  automationTitle
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState(7);

  // Fetch webhook configuration
  const { data: webhookSetting, isLoading: settingsLoading } = useQuery({
    queryKey: ['webhook-settings', clientAutomationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .eq('integration_type', 'webhook')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as WebhookSetting;
    },
  });

  // Fetch real webhook analytics
  const { 
    data: analyticsData, 
    isLoading: analyticsLoading, 
    refetch: refetchAnalytics 
  } = useWebhookAnalytics(clientAutomationId, timeRange);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  const testWebhook = async (url: string) => {
    try {
      toast.info('Testing webhook...');
      
      // Simular llamada de webhook de prueba
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
      });
      const endTime = Date.now();
      
      // Registrar el resultado
      await supabase.functions.invoke('webhook-analytics', {
        method: 'POST',
        body: {
          client_automation_id: clientAutomationId,
          webhook_url: url,
          method: 'POST',
          status_code: response.status,
          response_time: endTime - startTime,
          payload: { test: true },
          response_body: await response.text(),
          success: response.ok
        }
      });
      
      if (response.ok) {
        toast.success('Webhook test successful!');
      } else {
        toast.error(`Webhook test failed with status ${response.status}`);
      }
      
      // Refrescar datos
      refetchAnalytics();
    } catch (error) {
      toast.error('Webhook test failed');
      console.error('Webhook test error:', error);
    }
  };

  if (settingsLoading || analyticsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading webhook analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!webhookSetting) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Webhook Configuration</h3>
            <p className="text-gray-600">
              Webhook integration is not configured for this automation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = analyticsData?.stats || {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    successRate: 0
  };

  const chartData = analyticsData?.chartData || [];
  const recentLogs = analyticsData?.logs || [];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Webhook Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                    Last {timeRange} days
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                    {stats.successfulRequests}/{stats.totalRequests}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-orange-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Failed Requests</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{stats.failedRequests}</p>
                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-700">
                    {stats.totalRequests > 0 ? Math.round((stats.failedRequests / stats.totalRequests) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Analytics</TabsTrigger>
          <TabsTrigger value="urls">URLs & Testing</TabsTrigger>
          <TabsTrigger value="logs">Request Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
                <CardDescription>Daily webhook requests over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')} />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success vs Failed</CardTitle>
                <CardDescription>Request success breakdown by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')} />
                    <Bar dataKey="successful" fill="#10b981" />
                    <Bar dataKey="failed" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="urls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {webhookSetting.test_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Test URL</CardTitle>
                  <CardDescription>Use this URL for development and testing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                      {webhookSetting.test_url}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(webhookSetting.test_url!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => testWebhook(webhookSetting.test_url!)}
                    >
                      Test Webhook
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={webhookSetting.test_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {webhookSetting.production_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Production URL</CardTitle>
                  <CardDescription>Live webhook endpoint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                      {webhookSetting.production_url}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(webhookSetting.production_url!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => testWebhook(webhookSetting.production_url!)}
                    >
                      Test Webhook
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={webhookSetting.production_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Webhook Logs</CardTitle>
              <CardDescription>Latest webhook requests and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Webhook Logs</h3>
                    <p className="text-gray-600">
                      No webhook calls have been made yet.
                    </p>
                  </div>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{log.method} {log.webhook_url}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${log.success ? 'text-green-600' : 'text-red-600'}`}>
                          {log.status_code}
                        </p>
                        <p className="text-sm text-gray-500">{log.response_time}ms</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhookAnalyticsDashboard;
