
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const NoIntegrations: React.FC = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No integrations have been enabled for this automation.</p>
        <p className="text-sm text-gray-400 mt-1">Edit the automation to enable integrations.</p>
      </div>
    </CardContent>
  </Card>
);

export default NoIntegrations;
