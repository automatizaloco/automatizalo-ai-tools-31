
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
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsCheckingAdmin(false);
        return;
      }
      
      try {
        setIsCheckingAdmin(true);
        console.log('Checking admin status for user:', currentUser.email);
        
        // Special case for the main admin account
        if (currentUser.email === 'contact@automatizalo.co') {
          console.log('Main admin account detected, granting admin access');
          setIsAdmin(true);
          
          // Update the role in the database if needed
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('role')
            .eq('id', currentUser.id)
            .single();
          
          console.log('Current user data:', userData);
          
          if (fetchError) {
            console.error('Error fetching user data:', fetchError);
          } else if (!userData || userData?.role !== 'admin') {
            console.log('Updating admin role for main account');
            const { error: updateError } = await supabase
              .from('users')
              .update({ role: 'admin' })
              .eq('id', currentUser.id);
              
            if (updateError) {
              console.error('Error updating admin role:', updateError);
              toast.error('Failed to update admin role. Some features may be limited.');
            } else {
              console.log('Successfully updated to admin role');
              toast.success('Admin privileges confirmed');
            }
          }
        } else {
          // Check role for other users
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', currentUser.id)
            .single();
            
          if (error) {
            console.error('Error checking admin status:', error);
            toast.error('Failed to verify admin status: ' + error.message);
            return;
          }
          
          console.log('User role data:', data);
          setIsAdmin(data?.role === 'admin');
          
          if (data?.role !== 'admin') {
            addToast({
              title: 'Access Restricted',
              message: 'You need admin privileges to view this page',
              type: 'warning'
            });
          }
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        toast.error('Error checking permissions: ' + (error.message || 'Unknown error'));
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    if (currentUser) {
      checkAdminStatus();
    } else {
      setIsCheckingAdmin(false);
    }
  }, [currentUser, addToast]);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from database...');
      try {
        // Direct query to the users table - no RPC function
        const { data: userData, error: queryError } = await supabase
          .from('users')
          .select('*');
            
        if (queryError) {
          console.error('Error querying users table:', queryError);
          throw queryError;
        }
        
        console.log('Fetched users successfully:', userData);
        return userData as User[];
      } catch (error: any) {
        console.error('Error fetching users:', error);
        addToast({
          title: 'Failed to Load Users',
          message: 'Could not retrieve user list: ' + (error.message || 'Unknown error'),
          type: 'error'
        });
        return [] as User[];
      }
    },
    refetchOnWindowFocus: false,
    enabled: isAuthenticated && (isAdmin || !isCheckingAdmin),
  });

  const handleUserCreated = () => {
    setIsDialogOpen(false);
    console.log('User created, refreshing list...');
    refetch();
    toast.success('User successfully created');
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">You need to be logged in to access this page</p>
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="text-center p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Verifying admin privileges...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center p-6 border border-dashed rounded-md">
        <p className="text-muted-foreground">You need admin privileges to access this page</p>
        <p className="text-sm mt-2 text-muted-foreground">
          If you believe this is an error, please contact the system administrator.
        </p>
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
