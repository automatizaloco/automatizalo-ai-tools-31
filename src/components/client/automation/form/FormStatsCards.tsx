
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileCode, BarChart3, Activity } from 'lucide-react';

interface FormStatsCardsProps {
  formConfigured: boolean;
  stats: {
    totalSubmissions: number;
    processedSubmissions: number;
    pendingSubmissions: number;
    processingRate: number;
  };
}

const FormStatsCards: React.FC<FormStatsCardsProps> = ({
  formConfigured,
  stats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <FileCode className="h-4 w-4 text-blue-500" />
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-600">Form Status</p>
              <p className="text-2xl font-bold">
                {formConfigured ? 'Active' : 'Not Configured'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 text-green-500" />
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-orange-500" />
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-600">Processing Rate</p>
              <p className="text-2xl font-bold">{stats.processingRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormStatsCards;
