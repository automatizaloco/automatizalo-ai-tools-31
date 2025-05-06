
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';

export const useUserSyncService = () => {
  const notification = useNotification();
  
  const syncCurrentUser = async (user: any) => {
    if (!user) return false;
    
    try {
      // Check if the current user exists in the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      // If the user doesn't exist in the users table, add them
      if (error || !data) {
        // Insert the current user into the users table with admin role
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          if (insertError.code === '23505') { 
            notification.showWarning('Already Exists', 'Your user already exists in the database.');
            return false;
          } else {
            throw insertError;
          }
        } else {
          notification.showSuccess('Account Synced', 'Your user account has been synced as an admin.');
          return true;
        }
      } else {
        notification.showInfo('Account Check', 'Your account is already properly synced.');
        return false;
      }
    } catch (error: any) {
      console.error('Error syncing current user:', error);
      notification.showError('Sync Failed', 'Could not sync your user account. Please try again.');
      return false;
    }
  };
  
  const checkAndSyncCurrentUser = async (user: any) => {
    if (!user) return;
    
    try {
      // Check if the current user exists in the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      // If the user doesn't exist in the users table, offer to add them
      if (error || !data) {
        console.log('Current user not found in users table, offering to sync');
        notification.showWarning(
          'User Account Issue', 
          'Your account exists in authentication but not in the users table. Click "Sync Account" to fix this.'
        );
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  };
  
  return {
    syncCurrentUser,
    checkAndSyncCurrentUser
  };
};
