
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';

const ClientPortalHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useAdminVerification();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Portal</h1>
          <p className="text-gray-600">Manage your automations and support tickets</p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Back to Admin
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientPortalHeader;
