
import React, { useState } from 'react';
import { User } from '@/types/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { UserForm } from './UserForm';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserTableProps {
  users: User[];
  onUserUpdated: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onUserUpdated }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const notification = useNotification();
  const maxRetries = 2;

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setErrorMessage(null);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    notification.showSuccess('User Updated', 'User information was successfully updated');
    onUserUpdated();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setErrorMessage(null);
    setIsProcessing(true);
    
    try {
      console.log('Attempting to delete user:', selectedUser.id);
      
      // Get the current session for the auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Error getting session:', sessionError);
        throw new Error('Authentication required. Please sign in again.');
      }

      console.log('Calling manage-users edge function to delete user...');
      
      // Set a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );
      
      const fetchPromise = supabase.functions.invoke('manage-users', {
        body: { 
          action: 'delete', 
          userId: selectedUser.id 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      // Race between fetch and timeout
      const { error: functionError, data } = await Promise.race([
        fetchPromise,
        timeoutPromise.then(() => {
          throw new Error('The request took too long to complete. Please try again.');
        })
      ]);
      
      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`Error: ${functionError.message || 'Failed to delete user'}`);
      }
      
      if (data && data.error) {
        console.error('Error returned by edge function:', data.error);
        throw new Error(data.error || 'Failed to delete user');
      }

      notification.showSuccess('User Deleted', `User ${selectedUser.email} was successfully deleted`);
      setIsDeleteDialogOpen(false);
      onUserUpdated();
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Check if we should retry
      if (retryCount < maxRetries && error.message?.includes('Request timed out')) {
        setRetryCount(prev => prev + 1);
        notification.showWarning('Request timeout', 'Retrying the request...');
        handleDeleteUser(); // Retry the operation
        return;
      }
      
      // Set error message for display in dialog
      setErrorMessage(error.message || 'Failed to delete user. Please try again.');
      
      toast.error("Error deleting user", {
        description: error.message || 'Failed to delete user. Please try again.',
        duration: 5000,
      });
      
      notification.showError('Error', error.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm 
              onSuccess={handleEditSuccess} 
              existingUser={selectedUser} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {errorMessage && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-r-transparent border-white"></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
