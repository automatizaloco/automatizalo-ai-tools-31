
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/admin/users/UserForm';
import { UserTable } from '@/components/admin/users/UserTable';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNotification } from '@/hooks/useNotification';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncingCurrentUser, setSyncingCurrentUser] = useState(false);
  const { user } = useAuth();
  const notification = useNotification();

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

  // Check if current user exists in the users table
  const checkAndSyncCurrentUser = async () => {
    if (!user) return;
    
    try {
      // Check if the current user exists in the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      // If the user doesn't exist in the users table, offer to add them
      if (error || !data) {
        console.log('Current user not found in users table, offering to sync');
        notification.showWarning(
          'User Account Issue', 
          'Your account exists in authentication but not in the users table. Click "Sync Account" to fix this.'
        );
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  };
  
  // Function to manually add the current user to the users table with admin role
  const syncCurrentUser = async () => {
    if (!user) return;
    
    setSyncingCurrentUser(true);
    try {
      // Insert the current user into the users table with admin role
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: 'admin',
        });
      
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          notification.showWarning('Already Exists', 'Your user already exists in the database.');
        } else {
          throw error;
        }
      } else {
        notification.showSuccess('Account Synced', 'Your user account has been synced as an admin.');
        // Refresh the user list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error syncing current user:', error);
      notification.showError('Sync Failed', 'Could not sync your user account. Please try again.');
    } finally {
      setSyncingCurrentUser(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    checkAndSyncCurrentUser();
  }, [user]);

  const handleUserCreated = () => {
    setIsDialogOpen(false);
    toast.success('User created successfully');
    fetchUsers();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsDialogOpen(true)}>Add New User</Button>
          <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
            Refresh User List
          </Button>
          <Button 
            variant="secondary" 
            onClick={syncCurrentUser} 
            disabled={syncingCurrentUser}
          >
            {syncingCurrentUser ? 'Syncing...' : 'Sync My Account'}
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600">Total users: {users.length}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {users.length > 0 ? (
            <UserTable users={users} onUserUpdated={fetchUsers} />
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-1">No users found</p>
              <p className="text-gray-400 text-sm">
                Create a new user by clicking the "Add New User" button or sync your account
              </p>
            </div>
          )}
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={handleUserCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
