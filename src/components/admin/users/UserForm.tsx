
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
import { v4 as uuidv4 } from 'uuid';

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
      if (sessionError) {
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
        
        // Only update password if provided (via auth directly)
        if (data.password) {
          try {
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              existingUser.id,
              { password: data.password }
            );
            
            if (updateError) {
              throw new Error(updateError.message || 'Error updating password');
            }
          } catch (passwordError) {
            console.error('Password update error:', passwordError);
            throw new Error('Failed to update password. Role was updated successfully.');
          }
        }
        
        notification.showSuccess('User Updated', `User ${data.email} updated successfully`);
      } else {
        // Create new user
        try {
          // Generate a UUID for the new user
          const userId = uuidv4();
          
          // First create the auth user
          const { error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                role: data.role
              }
            }
          });
          
          if (authError) {
            throw new Error(authError.message || 'Failed to create user in auth system');
          }
          
          // Directly add user to the users table
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
            console.error('User insert error:', insertError);
            if (insertError.code === '23505') {
              throw new Error('This email is already registered');
            }
            throw new Error(`Error creating user: ${insertError.message}`);
          }
          
          notification.showSuccess('User Created', `User ${data.email} created successfully`);
        } catch (directError: any) {
          console.error('User creation error:', directError);
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
