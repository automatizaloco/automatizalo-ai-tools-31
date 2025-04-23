
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
        // Use a raw SQL query with auth.users to bypass TypeScript limitations
        // This is a workaround until we can update the Supabase types
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false }) as unknown as {
            data: User[] | null;
            error: Error | null;
          };
        
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
