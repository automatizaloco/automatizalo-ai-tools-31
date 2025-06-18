
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, ExternalLink } from 'lucide-react';
import AutomationStatsDashboard from './AutomationStatsDashboard';

interface TableIntegrationViewerProps {
  tableUrl?: string;
  tableTitle?: string;
  automationTitle?: string;
  clientAutomationId?: string;
}

const TableIntegrationViewer: React.FC<TableIntegrationViewerProps> = ({
  tableUrl,
  tableTitle = 'Estadísticas Externas',
  automationTitle,
  clientAutomationId
}) => {
  // Si no tenemos clientAutomationId, mostrar mensaje de error
  if (!clientAutomationId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No se pudo cargar las estadísticas de esta automatización.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard de estadísticas internas */}
      <AutomationStatsDashboard 
        clientAutomationId={clientAutomationId}
        automationTitle={automationTitle}
      />
      
      {/* Tabla externa de NocoDB si está configurada */}
      {tableUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {tableTitle}
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
                title={`${tableTitle} - ${automationTitle}`}
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
};

export default TableIntegrationViewer;
