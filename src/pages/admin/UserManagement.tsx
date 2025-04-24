
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/admin/users/UserForm';
import { UserTable } from '@/components/admin/users/UserTable';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    fetchUsers();
  }, []);

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
                Create a new user by clicking the "Add New User" button
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
