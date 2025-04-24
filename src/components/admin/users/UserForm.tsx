
import React, { useState, useEffect } from 'react';
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
      
      if (isEditMode) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            role: data.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;

        // Update password if provided
        if (data.password) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: data.password }
          );

          if (passwordError) {
            console.error('Error updating password:', passwordError);
            notification.showWarning('Partial Update', 'User role updated but password update failed.');
            onSuccess();
            return;
          }
        }

        notification.showSuccess('User Updated', `User ${data.email} updated successfully`);
      } else {
        // Create new user
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              role: data.role,
            },
          },
        });

        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          const { error: insertError } = await supabase.from('users').insert({
            id: signUpData.user.id,
            email: data.email,
            role: data.role,
          });
          
          if (insertError) {
            console.error('Error inserting user into users table:', insertError);
            notification.showWarning('Partial Creation', 'Auth user created but database sync failed');
          } else {
            notification.showSuccess('User Created', `User ${data.email} created successfully`);
          }
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
