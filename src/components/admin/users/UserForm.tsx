
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from "@/components/ui/form";
import { User } from '@/types/user';
import { useNotification } from '@/hooks/useNotification';
import UserFormFields from './UserFormFields';
import { createUser, updateUser } from './UserCreationLogic';

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
      
      if (isEditMode && existingUser) {
        // Update existing user
        const result = await updateUser(existingUser.id, {
          role: data.role,
          password: data.password || undefined
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        notification.showSuccess('User Updated', `User ${data.email} updated successfully`);
      } else {
        // Create new user
        const result = await createUser(data);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        notification.showSuccess('User Created', `User ${data.email} created successfully`);
      }
      
      // Reset form
      form.reset();
      
      // Notify parent component
      onSuccess();
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, error);
      notification.showError('Error', error.message || `Error ${isEditMode ? 'updating' : 'creating'} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <UserFormFields 
          form={form} 
          isEditMode={isEditMode} 
          isSubmitting={isSubmitting} 
        />
      </form>
    </Form>
  );
};
