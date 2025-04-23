
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePersistentToast } from '@/context/PersistentToastContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from '@/components/admin/users/UserForm';
import { UserTable } from '@/components/admin/users/UserTable';
import { User } from '@/types/user';

const UserManagement = () => {
  const { addToast } = usePersistentToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from database...');
      try {
        // Make a direct query to the users table instead of using RPC
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching users:', error);
          addToast({
            title: 'Error Loading Users',
            message: error.message,
            type: 'error'
          });
          throw error;
        }
        
        if (data) {
          console.log('Fetched users successfully:', data);
        } else {
          console.log('No users data returned');
        }
        
        return data as User[];
      } catch (error: any) {
        console.error('Error fetching users:', error);
        addToast({
          title: 'Failed to Load Users',
          message: 'Could not retrieve user list. Please try again.',
          type: 'error'
        });
        return [] as User[];
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleUserCreated = () => {
    setIsDialogOpen(false);
    console.log('User created, refreshing list...');
    refetch();
    toast.success('User successfully created');
    addToast({
      title: 'User Created',
      message: 'New user has been successfully added',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account with email and password.
              </DialogDescription>
            </DialogHeader>
            <UserForm onSuccess={handleUserCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center p-4 border border-red-300 rounded bg-red-50 text-red-800">
          <p>Error loading users: {(error as Error).message}</p>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="mt-2"
            size="sm"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">
                Total users: {users?.length || 0}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              size="sm"
            >
              Refresh User List
            </Button>
          </div>
          <UserTable 
            users={users || []} 
            onUserUpdated={() => refetch()} 
          />
          {users?.length === 0 && (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No users found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new user by clicking the "Add New User" button
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;
