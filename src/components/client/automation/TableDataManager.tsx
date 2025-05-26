
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, Search, Download, Filter, AlertCircle, Activity } from 'lucide-react';
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

  // Fetch table integration settings
  const { data: tableSetting, isLoading: settingsLoading } = useQuery({
    queryKey: ['table-settings', clientAutomationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_integration_settings')
        .select('*')
        .eq('client_automation_id', clientAutomationId)
        .eq('integration_type', 'table')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as TableSetting;
    },
  });

  // Mock table data
  const mockTableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', lastActive: '2024-01-26', score: 85 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', lastActive: '2024-01-25', score: 92 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', lastActive: '2024-01-24', score: 78 },
    { id: 4, name: 'Alice Wilson', email: 'alice@example.com', status: 'inactive', lastActive: '2024-01-20', score: 65 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'active', lastActive: '2024-01-26', score: 89 },
  ];

  const filteredData = mockTableData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || row.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Status', 'Last Active', 'Score'],
      ...filteredData.map(row => [row.name, row.email, row.status, row.lastActive, row.score])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
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

  const renderTableEmbed = () => {
    if (!tableSetting?.integration_code) {
      return (
        <div className="text-center py-8">
          <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Table Configured</h3>
          <p className="text-gray-600">
            The table integration code has not been set up yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Integrated Table</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            External Source
          </Badge>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px]">
          <div dangerouslySetInnerHTML={{ __html: tableSetting.integration_code }} />
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-50 text-green-700',
      pending: 'bg-yellow-50 text-yellow-700',
      inactive: 'bg-red-50 text-red-700',
    };
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.inactive}>
        {status}
      </Badge>
    );
  };

  if (settingsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <Activity className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading table integration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Table className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{mockTableData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {mockTableData.filter(row => row.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {mockTableData.filter(row => row.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Download className="h-4 w-4 text-purple-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockTableData.reduce((sum, row) => sum + row.score, 0) / mockTableData.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* External Table Integration */}
      {tableSetting?.integration_code && (
        <Card>
          <CardHeader>
            <CardTitle>External Table Integration</CardTitle>
            <CardDescription>
              Your connected external table or spreadsheet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderTableEmbed()}
          </CardContent>
        </Card>
      )}

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
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
              <p className="text-gray-600">
                No records match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableDataManager;
