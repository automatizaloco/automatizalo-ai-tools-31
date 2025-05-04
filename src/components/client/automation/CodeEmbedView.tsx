
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodeEmbedViewProps {
  data: {
    integration_code?: string;
  };
  title: string;
  icon: React.ReactNode;
}

const CodeEmbedView: React.FC<CodeEmbedViewProps> = ({
  data,
  title,
  icon
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.integration_code ? (
          <div>
            <div className="border rounded-md p-4">
              <div dangerouslySetInnerHTML={{ __html: data.integration_code }} />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-500">No code has been configured for this integration.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeEmbedView;
