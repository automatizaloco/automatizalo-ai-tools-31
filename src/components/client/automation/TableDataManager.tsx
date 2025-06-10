import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, Search, Download, AlertCircle, Activity, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
interface TableDataManagerProps {
  clientAutomationId: string;
  automationTitle: string;
}
interface TableSetting {
  id: string;
  integration_code?: string;
  status: string;
}
const TableDataManager: React.FC<TableDataManagerProps> = ({
  clientAutomationId,
  automationTitle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Fetch table integration settings
  const {
    data: tableSetting,
    isLoading: settingsLoading
  } = useQuery({
    queryKey: ['table-settings', clientAutomationId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('client_integration_settings').select('*').eq('client_automation_id', clientAutomationId).eq('integration_type', 'table').eq('status', 'active').single();
      if (error) throw error;
      return data as TableSetting;
    }
  });

  // Fetch real table data
  const {
    data: tableData,
    isLoading: dataLoading
  } = useQuery({
    queryKey: ['table-data', clientAutomationId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('table_data_entries').select('*').eq('client_automation_id', clientAutomationId).eq('status', 'active').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientAutomationId
  });
  const filteredData = (tableData || []).filter(row => {
    const searchString = JSON.stringify(row.data).toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || row.entry_type === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const exportData = () => {
    if (!tableData || tableData.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Extract all unique keys from the data
    const allKeys = new Set<string>();
    tableData.forEach(row => {
      Object.keys(row.data || {}).forEach(key => allKeys.add(key));
    });
    const headers = Array.from(allKeys);
    const csvContent = [headers, ...tableData.map(row => headers.map(header => row.data?.[header] || ''))].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${automationTitle}-data.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Data exported successfully');
  };
  const renderTableEmbed = (isFullscreen: boolean = false) => {
    if (!tableSetting?.integration_code) {
      return <div className="text-center py-8">
          <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Table Configured</h3>
          <p className="text-gray-600">
            The table integration code has not been set up yet.
          </p>
        </div>;
    }
    return <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Integrated Table</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              External Source
            </Badge>
            {!isFullscreen && <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4 mr-1" />
                    Fullscreen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Table Integration - Fullscreen View</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden p-6 pt-2">
                    <div className="w-full h-[calc(95vh-8rem)] border rounded-lg overflow-hidden">
                      <div dangerouslySetInnerHTML={{
                    __html: tableSetting.integration_code
                  }} className="w-full h-full" />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>}
          </div>
        </div>
        
        <div className={`border rounded-lg overflow-hidden ${isFullscreen ? 'w-full h-[calc(100vh-8rem)]' : 'h-[500px]'}`}>
          <div dangerouslySetInnerHTML={{
          __html: tableSetting.integration_code
        }} className="w-full h-full" />
        </div>
      </div>;
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-50 text-green-700',
      manual: 'bg-blue-50 text-blue-700',
      automated: 'bg-purple-50 text-purple-700',
      imported: 'bg-yellow-50 text-yellow-700'
    };
    return <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.active}>
        {status}
      </Badge>;
  };
  if (settingsLoading || dataLoading) {
    return <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <Activity className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading table integration...</span>
          </div>
        </CardContent>
      </Card>;
  }
  const totalRecords = tableData?.length || 0;
  const manualEntries = tableData?.filter(row => row.entry_type === 'manual').length || 0;
  const automatedEntries = tableData?.filter(row => row.entry_type === 'automated').length || 0;
  const importedEntries = tableData?.filter(row => row.entry_type === 'imported').length || 0;
  return <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        

        

        

        
      </div>

      {/* External Table Integration */}
      {tableSetting?.integration_code && <Card>
          <CardHeader>
            <CardTitle>External Table Integration</CardTitle>
            <CardDescription>
              Your connected external table or spreadsheet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderTableEmbed()}
          </CardContent>
        </Card>}

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            View, filter, and export your automation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search data..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Types</option>
                <option value="manual">Manual</option>
                <option value="automated">Automated</option>
                <option value="imported">Imported</option>
              </select>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Data Table */}
          {totalRecords === 0 ? <div className="text-center py-8">
              <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600">
                No table data has been collected yet.
              </p>
            </div> : <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map(row => <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {JSON.stringify(row.data).slice(0, 100)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(row.entry_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}

          {filteredData.length === 0 && totalRecords > 0 && <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
              <p className="text-gray-600">
                No records match your current filters.
              </p>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default TableDataManager;