
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from 'lucide-react';
import AutomationStatsDashboard from './AutomationStatsDashboard';

interface TableIntegrationViewerProps {
  tableUrl?: string;
  tableTitle?: string;
  automationTitle?: string;
  clientAutomationId?: string;
}

const TableIntegrationViewer: React.FC<TableIntegrationViewerProps> = ({
  tableUrl,
  tableTitle = 'Estadísticas',
  automationTitle,
  clientAutomationId
}) => {
  // Si tenemos clientAutomationId, mostrar el dashboard completo
  if (clientAutomationId) {
    return (
      <div className="space-y-6">
        <AutomationStatsDashboard 
          clientAutomationId={clientAutomationId}
          automationTitle={automationTitle}
        />
        
        {/* Mostrar la tabla externa si está configurada */}
        {tableUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                {tableTitle} - Vista Externa
              </CardTitle>
              {automationTitle && (
                <p className="text-sm text-gray-500">
                  Datos externos para: {automationTitle}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <iframe
                  src={tableUrl}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  style={{ border: 'none', borderRadius: '8px' }}
                  title={`Estadísticas Externas - ${tableTitle}`}
                  className="w-full"
                  onError={() => {
                    console.error('Error loading external table iframe');
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Fallback al comportamiento original si no hay clientAutomationId
  if (!tableUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            {tableTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Las estadísticas de esta automatización aún no están configuradas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table className="h-5 w-5" />
          {tableTitle}
        </CardTitle>
        {automationTitle && (
          <p className="text-sm text-gray-500">
            Estadísticas para: {automationTitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <iframe
            src={tableUrl}
            width="100%"
            height="600"
            frameBorder="0"
            style={{ border: 'none', borderRadius: '8px' }}
            title={`Estadísticas - ${tableTitle}`}
            className="w-full"
            onError={() => {
              console.error('Error loading table iframe');
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TableIntegrationViewer;
