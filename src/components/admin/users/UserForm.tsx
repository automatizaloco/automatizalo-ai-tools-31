
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from 'sonner';
import { User } from '@/types/user';
import { useNotification } from '@/hooks/useNotification';

interface UserFormValues {
  email: string;
  password: string;
  role: 'admin' | 'client';
}

interface UserFormProps {
  onSuccess: () => void;
  existingUser?: User;
}

export const UserForm: React.FC<UserFormProps> = ({ onSuccess, existingUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  
  const form = useForm<UserFormValues>({
    defaultValues: {
      email: existingUser?.email || '',
      password: '',
      role: (existingUser?.role as 'admin' | 'client') || 'client',
    },
  });

  const isEditMode = !!existingUser;

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      console.log(`${isEditMode ? 'Updating' : 'Creating'} user:`, data.email, data.role);
      
      // Get the session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Authentication required. Please sign in again.');
      }
      
      if (isEditMode) {
        // Direct database update for editing users to avoid edge function
        if (data.role) {
          const { error: roleError } = await supabase
            .from('users')
            .update({ 
              role: data.role,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id);
          
          if (roleError) {
            throw new Error(`Error updating user role: ${roleError.message}`);
          }
        }
        
        // Only update password if provided (via edge function)
        if (data.password) {
          try {
            const { error: functionError, data: functionData } = await supabase.functions.invoke('manage-users', {
              body: { 
                action: 'update',
                userId: existingUser.id,
                userData: { password: data.password }
              },
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
            
            if (functionError || (functionData && functionData.error)) {
              throw new Error(functionError?.message || functionData?.error || 'Error updating password');
            }
          } catch (passwordError) {
            console.error('Password update error:', passwordError);
            throw new Error('Failed to update password. Role was updated successfully.');
          }
        }
        
        notification.showSuccess('User Updated', `User ${data.email} updated successfully`);
      } else {
        // For new users, generate a UUID for the user ID
        const userId = crypto.randomUUID();
        
        try {
          // Insert into the users table with the generated ID
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: data.email,
              role: data.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            if (insertError.code === '23505') {
              throw new Error('This email is already registered');
            }
            throw new Error(`Error creating user: ${insertError.message}`);
          }
          
          notification.showSuccess('User Created', `User ${data.email} created successfully`);
        } catch (directError: any) {
          console.error('Direct creation error:', directError);
          throw directError;
        }
      }
      
      // Reset form
      form.reset();
      
      // Notify parent component
      onSuccess();
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, error);
      
      if (error.message?.includes('already registered') || error.code === 'user_already_exists') {
        notification.showError('Error', 'This email is already registered');
      } else {
        notification.showError('Error', error.message || `Error ${isEditMode ? 'updating' : 'creating'} user`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  required 
                  {...field} 
                  disabled={isEditMode} // Disable email editing for existing users
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  required={!isEditMode} // Only required for new users
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update User' : 'Create User')
          }
        </Button>
      </form>
    </Form>
  );
};
