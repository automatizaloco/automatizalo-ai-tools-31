
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode } from 'lucide-react';
import { format } from 'date-fns';

interface FormSubmission {
  id: string;
  form_data: any;
  status: string;
  created_at: string;
}

interface FormSubmissionsListProps {
  submissions: FormSubmission[];
}

const FormSubmissionsList: React.FC<FormSubmissionsListProps> = ({
  submissions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>Latest form submissions and their processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <FileCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
              <p className="text-gray-600">
                No form submissions have been received yet.
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    submission.status === 'processed' ? 'bg-green-500' : 
                    submission.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      Form Submission #{submission.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {Object.keys(submission.form_data).length} fields submitted
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={
                      submission.status === 'processed' 
                        ? 'bg-green-50 text-green-700' 
                        : submission.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }
                  >
                    {submission.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSubmissionsList;
