
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/context/AuthContext';

const UserManagement = () => {
  const { addToast } = usePersistentToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user: currentUser, isAuthenticated } = useAuth();

  // Check if current user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) return;
      
      try {
        // Check role of current user
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single();
          
        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }
        
        setIsAdmin(data.role === 'admin');
        
        if (data.role !== 'admin') {
          addToast({
            title: 'Access Restricted',
            message: 'You need admin privileges to view this page',
            type: 'warning'
          });
        }
      } catch (error) {
        console.error('Error in admin check:', error);
      }
    };
    
    if (currentUser) {
      checkAdminStatus();
    }
  }, [currentUser, addToast]);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from database...');
      try {
        let userData;
        
        // With the get_users function
        const { data: functionData, error: functionError } = await supabase.rpc('get_users');
        
        if (functionError) {
          console.log('Error using RPC function, falling back to direct query:', functionError);
          
          // Fallback to direct query if the user has admin rights
          const { data: directData, error: directError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (directError) {
            throw directError;
          }
          
          userData = directData;
        } else {
          userData = functionData;
        }
        
        if (userData) {
          console.log('Fetched users successfully:', userData);
        } else {
          console.log('No users data returned');
        }
        
        return userData as User[];
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
    enabled: isAuthenticated && isAdmin, // Only fetch if user is authenticated and admin
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

  if (!isAuthenticated) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">You need to be logged in to access this page</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">You need admin privileges to access this page</p>
      </div>
    );
  }

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
