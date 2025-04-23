
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Use both type parameters for the RPC call to fix the typing issue
        // First type parameter is for the return data type, second is for input parameters
        const { data, error } = await supabase.rpc<User[], Record<string, never>>('get_users');
        
        if (error) {
          toast.error('Error fetching users');
          throw error;
        }
        
        return (data || []) as User[];
      } catch (error) {
        console.error('Error in get_users query:', error);
        toast.error('Could not load users');
        return [] as User[];
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm onSuccess={() => {
              refetch();
              toast.success('User created successfully');
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <UserTable users={users || []} onUserUpdated={() => refetch()} />
      )}
    </div>
  );
};

export default UserManagement;
