
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
  const [deleteAttemptMethod, setDeleteAttemptMethod] = useState<string>('none');
  const notification = useNotification();

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setErrorMessage(null);
    setDeleteAttemptMethod('none');
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
    setDeleteAttemptMethod('none');
    
    // Get the current session for the auth token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      setErrorMessage('Authentication required. Please sign in again.');
      setIsProcessing(false);
      return;
    }

    try {
      console.log('Starting user deletion process for:', selectedUser.id);
      setDeleteAttemptMethod('edge-function');
      
      // First attempt: Using Edge Function
      const { error: functionError, data } = await supabase.functions.invoke('manage-users', {
        body: { 
          action: 'delete', 
          userId: selectedUser.id 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (functionError || (data && data.error)) {
        console.warn('Edge function deletion attempt failed:', functionError || data?.error);
        throw new Error(functionError?.message || data?.error || 'Edge function deletion failed');
      }
      
      console.log('User deleted via edge function');
      notification.showSuccess('User Deleted', `User ${selectedUser.email} was successfully deleted`);
      setIsDeleteDialogOpen(false);
      onUserUpdated();
      return;
      
    } catch (edgeFunctionError: any) {
      console.error('Edge function error:', edgeFunctionError);
      
      // Fall back to database-only approach
      try {
        console.log('Edge function failed, trying database-only approach');
        setDeleteAttemptMethod('database');
        
        // Remove from users table
        const { error: userTableError } = await supabase
          .from('users')
          .delete()
          .eq('id', selectedUser.id);
          
        if (userTableError) {
          console.error('Error deleting from users table:', userTableError);
          throw new Error(`Database deletion failed: ${userTableError.message}`);
        }
        
        // Successfully deleted from database - we can't delete from auth without service_role
        // but the user will at least be removed from the system's database
        console.log('User deleted from database table');
        notification.showSuccess('User Record Deleted', 
          'The user was removed from the database. Note: Their auth account may still exist.'
        );
        setIsDeleteDialogOpen(false);
        onUserUpdated();
        
      } catch (dbError: any) {
        console.error('Database deletion error:', dbError);
        setErrorMessage(`All deletion methods failed. Please contact support.\nError: ${dbError.message || 'Unknown error'}`);
        
        toast.error("User Deletion Failed", {
          description: "All deletion methods failed. The user may need to be deleted manually.",
          duration: 5000,
        });
      }
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
                  {deleteAttemptMethod === 'edge-function' ? 'Deleting (API)...' : 
                   deleteAttemptMethod === 'database' ? 'Deleting (DB)...' : 'Deleting...'}
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
