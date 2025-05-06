
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types/user';

interface UserData {
  email: string;
  password: string;
  role: 'admin' | 'client';
}

export async function createUser(data: UserData): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // Check if the email already exists in auth by attempting a sign-in with an invalid password
    const { error: emailCheckError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: "checkonly_" + uuidv4(),
    });
    
    // If there's no error or error is NOT about invalid credentials, email exists
    if (!emailCheckError || !emailCheckError.message.includes('Invalid login credentials')) {
      return { success: false, error: 'This email is already registered' };
    }
    
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role: data.role }
      }
    });
    
    if (authError) {
      // Handle specific error conditions
      if (authError.message?.includes('already registered') || 
          authError.message?.includes('already in use') ||
          authError.message?.includes('already exists')) {
        return { success: false, error: 'This email is already registered' };
      }
      return { success: false, error: authError.message };
    }
    
    if (!authData?.user?.id) {
      return { success: false, error: 'Failed to create user account' };
    }
    
    // Use the user ID from auth
    const userId = authData.user.id;
    
    // Check if user already exists in users table
    const { data: existingDbUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();
      
    if (existingDbUser) {
      // User exists in DB but not in auth - return success
      return { 
        success: true, 
        user: {
          id: existingDbUser.id,
          email: data.email,
          role: data.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }
    
    // Add user to the users table
    const timestamp = new Date().toISOString();
    const newUser: User = {
      id: userId,
      email: data.email,
      role: data.role,
      created_at: timestamp,
      updated_at: timestamp
    };
    
    const { error: insertError } = await supabase
      .from('users')
      .insert(newUser);
      
    if (insertError) {
      if (insertError.code === '23505') {
        return { success: false, error: 'This email is already registered' };
      }
      return { success: false, error: `Error creating user: ${insertError.message}` };
    }
    
    return { success: true, user: newUser };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
}

export async function updateUser(
  userId: string, 
  data: { role?: string; password?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update role if provided
    if (data.role) {
      const { error: roleError } = await supabase
        .from('users')
        .update({ 
          role: data.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (roleError) {
        return { success: false, error: `Error updating user role: ${roleError.message}` };
      }
    }
    
    // Update password if provided
    if (data.password) {
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          userId,
          { password: data.password }
        );
        
        if (updateError) {
          return { success: false, error: updateError.message || 'Error updating password' };
        }
      } catch (passwordError: any) {
        return { 
          success: false, 
          error: 'Failed to update password. Role was updated successfully.' 
        };
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
}
