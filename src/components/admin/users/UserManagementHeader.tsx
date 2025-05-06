
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserManagementHeaderProps {
  userCount: number;
  isLoading: boolean;
  onAddUserClick: () => void;
  onRefreshClick: () => void;
  onSyncAccountClick: () => void;
  isSyncing: boolean;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  userCount,
  isLoading,
  onAddUserClick,
  onRefreshClick,
  onSyncAccountClick,
  isSyncing
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onAddUserClick}
            className="w-full sm:w-auto"
          >
            Add New User
          </Button>
          <Button 
            variant="outline" 
            onClick={onRefreshClick} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Refresh User List
          </Button>
          <Button 
            variant="secondary" 
            onClick={onSyncAccountClick} 
            disabled={isSyncing}
            className="w-full sm:w-auto"
          >
            {isSyncing ? 'Syncing...' : 'Sync My Account'}
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600">Total users: {userCount}</p>
      </div>
    </>
  );
};

export default UserManagementHeader;
