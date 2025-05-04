
import React from 'react';
import { useParams } from 'react-router-dom';

interface AutomationDetailsProps {
  automationId?: string;
  clientId?: string;
}

const AutomationDetails: React.FC<AutomationDetailsProps> = ({ 
  automationId: propAutomationId,
  clientId: propClientId 
}) => {
  const params = useParams();
  const automationId = propAutomationId || params.automationId;
  const clientId = propClientId;

  // Use automationId and clientId here
  return (
    <div>
      <h1>Automation Details</h1>
      <p>Automation ID: {automationId}</p>
      {clientId && <p>Client ID: {clientId}</p>}
    </div>
  );
};

export default AutomationDetails;
