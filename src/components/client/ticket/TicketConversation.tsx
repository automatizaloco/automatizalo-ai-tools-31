
import React from 'react';
import { TicketResponse } from '@/types/automation';

interface TicketConversationProps {
  responses: TicketResponse[];
}

const TicketConversation: React.FC<TicketConversationProps> = ({ responses }) => {
  return (
    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
      {responses.length > 0 ? (
        responses.map((response) => (
          <div key={response.id} className={`p-3 rounded-lg ${
            response.is_admin ? 'bg-blue-50 mr-6' : 'bg-gray-50 ml-6'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">
                {response.is_admin ? 'Support Team' : 'You'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(response.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          No responses yet
        </div>
      )}
    </div>
  );
};

export default TicketConversation;
