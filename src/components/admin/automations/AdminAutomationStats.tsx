
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  BarChart3,
  Zap,
  Users
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AdminStats {
  totalClientAutomations: number;
  activeClientAutomations: number;
  totalWebhookCalls: number;
  successfulWebhookCalls: number;
  totalFormSubmissions: number;
  totalTableEntries: number;
  setupStatusCounts: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  activityByDay: { date: string; webhooks: number; forms: number }[];
  topAutomations: { title: string; count: number }[];
  averageResponseTime: number;
}

const AdminAutomationStats: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-automation-stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Obtener automatizaciones de clientes
      const { data: clientAutomations } = await supabase
        .from('client_automations')
        .select(`
          *,
          automation:automation_id (title)
        `);

      // Obtener logs de webhook
      const { data: webhookLogs } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Obtener form submissions
      const { data: formSubmissions } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      // Obtener table entries
      const { data: tableEntries } = await supabase
        .from('table_data_entries')
        .select('*')
        .order('created_at', { ascending: false });

      // Calcular estadísticas generales
      const totalClientAutomations = clientAutomations?.length || 0;
      const activeClientAutomations = clientAutomations?.filter(ca => ca.status === 'active').length || 0;
      const totalWebhookCalls = webhookLogs?.length || 0;
      const successfulWebhookCalls = webhookLogs?.filter(log => log.success).length || 0;
      const totalFormSubmissions = formSubmissions?.length || 0;
      const totalTableEntries = tableEntries?.length || 0;

      // Calcular conteos por estado de setup
      const setupStatusCounts = {
        pending: clientAutomations?.filter(ca => ca.setup_status === 'pending').length || 0,
        in_progress: clientAutomations?.filter(ca => ca.setup_status === 'in_progress').length || 0,
        completed: clientAutomations?.filter(ca => ca.setup_status === 'completed').length || 0,
      };

      // Actividad por día (últimos 7 días)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const activityByDay = last7Days.map(date => ({
        date,
        webhooks: webhookLogs?.filter(log => log.created_at.startsWith(date)).length || 0,
        forms: formSubmissions?.filter(sub => sub.created_at.startsWith(date)).length || 0
      }));

      // Top automatizaciones por uso
      const automationCounts: { [key: string]: number } = {};
      webhookLogs?.forEach(log => {
        const automation = clientAutomations?.find(ca => ca.id === log.client_automation_id);
        if (automation?.automation?.title) {
          automationCounts[automation.automation.title] = (automationCounts[automation.automation.title] || 0) + 1;
        }
      });

      const topAutomations = Object.entries(automationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([title, count]) => ({ title, count }));

      // Tiempo promedio de respuesta
      const averageResponseTime = webhookLogs?.length 
        ? webhookLogs.reduce((acc, log) => acc + (log.response_time || 0), 0) / webhookLogs.length 
        : 0;

      return {
        totalClientAutomations,
        activeClientAutomations,
        totalWebhookCalls,
        successfulWebhookCalls,
        totalFormSubmissions,
        totalTableEntries,
        setupStatusCounts,
        activityByDay,
        topAutomations,
        averageResponseTime: Math.round(averageResponseTime)
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-500">Error al cargar las estadísticas generales</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  const pieData = [
    { name: 'Completadas', value: stats.setupStatusCounts.completed, color: '#10b981' },
    { name: 'En Progreso', value: stats.setupStatusCounts.in_progress, color: '#3b82f6' },
    { name: 'Pendientes', value: stats.setupStatusCounts.pending, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estadísticas Generales</h2>
          <p className="text-gray-600 mt-1">Resumen de todas las automatizaciones de clientes</p>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          <Activity className="h-3 w-3 mr-1" />
          En tiempo real
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automatizaciones Totales</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientAutomations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeClientAutomations} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Llamadas Webhook</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebhookCalls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.successfulWebhookCalls} exitosas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formularios</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFormSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Envíos totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Respuesta</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Promedio general
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad general */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividad General (7 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.activityByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value as string)}
                />
                <Line 
                  type="monotone" 
                  dataKey="webhooks" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Webhooks"
                />
                <Line 
                  type="monotone" 
                  dataKey="forms" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Formularios"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estado de configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Estado de Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top automatizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Automatizaciones Más Utilizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topAutomations.length > 0 ? (
            <div className="space-y-3">
              {stats.topAutomations.map((automation, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{automation.title}</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {automation.count} llamadas
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No hay datos de uso disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAutomationStats;
