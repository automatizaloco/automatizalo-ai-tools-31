
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from '@/components/admin/users/UserForm';
import { UserTable } from '@/components/admin/users/UserTable';
import { User } from '@/types/user';

const UserManagement = () => {
  const { addToast } = usePersistentToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_users');
        
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
          console.log('Fetched users:', data);
        }
        
        return data as User[];
      } catch (error) {
        console.error('Error in get_users query:', error);
        addToast({
          title: 'Failed to Load Users',
          message: 'Could not retrieve user list. Please try again.',
          type: 'error'
        });
        return [] as User[];
      }
    },
  });

  const handleUserCreated = () => {
    setIsDialogOpen(false);
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
            </DialogHeader>
            <UserForm onSuccess={handleUserCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              size="sm"
            >
              Refresh User List
            </Button>
          </div>
          <UserTable users={users || []} onUserUpdated={() => refetch()} />
        </>
      )}
    </div>
  );
};

export default UserManagement;
