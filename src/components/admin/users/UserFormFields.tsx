
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';

interface UserFormValues {
  email: string;
  password: string;
  role: 'admin' | 'client';
}

interface UserFormFieldsProps {
  form: UseFormReturn<UserFormValues>;
  isEditMode: boolean;
  isSubmitting: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ 
  form, 
  isEditMode, 
  isSubmitting 
}) => {
  return (
    <>
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
    </>
  );
};

export default UserFormFields;
