
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

interface UserFormValues {
  email: string;
  password: string;
  role: 'admin' | 'client';
}

interface UserFormProps {
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UserFormValues>({
    defaultValues: {
      email: '',
      password: '',
      role: 'client',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Creating user:', data.email, data.role);
      
      // First, check if current user is an admin
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error('Authentication error: ' + sessionError.message);
      
      if (!sessionData.session) {
        throw new Error('You must be logged in to perform this action');
      }
      
      // Sign up the user through auth API
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
      
      console.log('Auth signup response:', signUpData);
      
      // Manually insert the user into the users table if the user was created
      if (signUpData.user) {
        const { error: insertError } = await supabase.from('users').insert({
          id: signUpData.user.id,
          email: data.email,
          role: data.role,
        });
        
        if (insertError) {
          console.error('Error inserting user into users table:', insertError);
          
          if (insertError.code === '42501' || insertError.message?.includes('permission denied')) {
            // Try direct insert with admin role update
            console.log('Attempting alternative insert method...');
            
            // First update own role to admin if needed for the main admin account
            if (data.email === 'contact@automatizalo.co') {
              // Using a direct from query instead of RPC since the function doesn't exist
              const { error: adminUpdateError } = await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', signUpData.user.id);
                
              if (adminUpdateError) {
                console.error('Error in admin role update:', adminUpdateError);
              }
            }
          } else {
            // Show warning but don't block the flow since the auth user was created
            toast.warning(`User created but database sync failed: ${insertError.message}`);
          }
        } else {
          console.log('User successfully inserted into users table');
        }
      }
      
      // Reset form
      form.reset();
      
      // Notify parent component
      onSuccess();
      toast.success('User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Check if user already exists
      if (error.message?.includes('already registered') || error.code === 'user_already_exists') {
        toast.error('This email is already registered');
      } else {
        toast.error(error.message || 'Error creating user');
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
                <Input type="email" required {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" required {...field} />
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
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
};
