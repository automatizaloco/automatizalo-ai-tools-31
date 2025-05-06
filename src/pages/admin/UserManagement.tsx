
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminContent from '@/components/layout/admin/AdminContent';
import { UserForm } from '@/components/admin/users/UserForm';
import { UserTable } from '@/components/admin/users/UserTable';
import UserManagementHeader from '@/components/admin/users/UserManagementHeader';
import EmptyUserState from '@/components/admin/users/EmptyUserState';
import { useUserSyncService } from '@/components/admin/users/UserSyncService';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncingCurrentUser, setSyncingCurrentUser] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const userSyncService = useUserSyncService();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching users...');
      
      // First try using the RPC function (more secure)
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_users');
      
      if (rpcError) {
        console.error('RPC error:', rpcError);
        
        // Fallback: Try direct query if RPC fails
        console.log('Trying direct query...');
        const { data: directData, error: directError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (directError) {
          console.error('Direct query error:', directError);
          toast.error('Failed to load users');
        } else if (directData) {
          console.log('Users loaded via direct query:', directData.length);
          setUsers(directData as User[]);
        }
      } else if (rpcData) {
        console.log('Users loaded via RPC:', rpcData.length);
        setUsers(rpcData as User[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const syncCurrentUser = async () => {
    if (!user) return;
    
    setSyncingCurrentUser(true);
    try {
      const success = await userSyncService.syncCurrentUser(user);
      if (success) {
        // Refresh the user list only if we actually made a change
        fetchUsers();
      }
    } finally {
      setSyncingCurrentUser(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (user) {
      userSyncService.checkAndSyncCurrentUser(user);
    }
  }, [user]);

  const handleUserCreated = () => {
    setIsDialogOpen(false);
    toast.success('User created successfully');
    fetchUsers();
  };

  return (
    <>
      <UserManagementHeader
        userCount={users.length}
        isLoading={isLoading}
        onAddUserClick={() => setIsDialogOpen(true)}
        onRefreshClick={fetchUsers}
        onSyncAccountClick={syncCurrentUser}
        isSyncing={syncingCurrentUser}
      />

      <AdminContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <UserTable users={users} onUserUpdated={fetchUsers} />
              </div>
            ) : (
              <EmptyUserState />
            )}
          </>
        )}
      </AdminContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={isMobile ? "max-w-[95%] p-4" : ""}>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={handleUserCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
