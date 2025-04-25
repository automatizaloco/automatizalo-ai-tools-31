
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Set up proper logging
const log = (message: string, level: 'info' | 'error' | 'warn' = 'info', data?: any) => {
  const timestamp = new Date().toISOString()
  const logMessage = data ? `[${timestamp}] [${level}] ${message}: ${JSON.stringify(data)}` : `[${timestamp}] [${level}] ${message}`
  console.log(logMessage)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    log('Received OPTIONS request - responding with CORS headers')
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    })
  }

  try {
    // Validate environment variables
    if (!supabaseUrl || !serviceRoleKey) {
      log('Missing environment variables', 'error')
      throw new Error('Server configuration error: Missing environment variables')
    }

    // Initialize Supabase admin client
    let supabaseAdmin;
    try {
      supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      log('Supabase admin client initialized')
    } catch (initError) {
      log('Failed to initialize Supabase admin client', 'error', initError)
      throw new Error(`Supabase client initialization failed: ${initError.message}`)
    }
    
    // Validate authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      log('Missing Authorization header', 'error')
      throw new Error('Unauthorized: Missing authentication token')
    }
    
    const jwt = authHeader.replace('Bearer ', '')
    log('Verifying authorization token')
    
    // Verify the JWT token
    let user;
    try {
      const { data, error: authError } = await supabaseAdmin.auth.getUser(jwt)
      
      if (authError || !data.user) {
        log('Auth error:', 'error', authError)
        throw new Error('Unauthorized: Invalid token')
      }
      
      user = data.user
      log(`Authenticated as user: ${user.email} (${user.id})`)
    } catch (authVerifyError) {
      log('Failed to verify auth token', 'error', authVerifyError)
      throw new Error(`Authentication verification failed: ${authVerifyError.message}`)
    }
    
    // Parse request body
    let reqBody;
    try {
      reqBody = await req.json()
    } catch (error) {
      log('Error parsing request body', 'error', error)
      throw new Error('Invalid request: Could not parse JSON body')
    }
    
    const { action, userId, userData } = reqBody
    
    if (!action) {
      log('Missing action in request', 'error')
      throw new Error('Missing required parameter: action')
    }
    
    log(`Requested action: ${action}`, 'info', { userId, action })
    
    // For verifyAdmin action, use the is_admin function
    if (action === 'verifyAdmin') {
      log('Verifying admin status')

      try {
        const { data, error: verifyError } = await supabaseAdmin.rpc('is_admin', { user_uid: user.id })
        
        if (verifyError) {
          log('Error verifying admin:', 'error', verifyError)
          throw new Error('Failed to verify admin status')
        }
        
        log(`Admin verification result: ${data ? 'is admin' : 'not admin'}`)
        return new Response(
          JSON.stringify({ isAdmin: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (verifyAdminError) {
        log('Verify admin operation failed', 'error', verifyAdminError)
        throw new Error(`Admin verification failed: ${verifyAdminError.message}`)
      }
    }
    
    // For other actions, verify admin status first
    log('Checking if user has admin privileges')
    
    let isAdmin = false;
    try {
      // First try direct query
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (!userError && userData) {
        isAdmin = userData.role === 'admin';
      } else {
        // Fall back to RPC
        const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('is_admin', { user_uid: user.id })
        
        if (rpcError) {
          log('Admin check error:', 'error', rpcError)
          throw new Error(`Admin check failed: ${rpcError.message}`)
        }
        
        isAdmin = !!rpcData;
      }
    } catch (adminCheckError) {
      log('All admin verification methods failed', 'error', adminCheckError)
      throw new Error('Could not verify admin status')
    }
    
    if (!isAdmin) {
      log(`User ${user.id} tried to perform admin action without privileges`, 'error')
      throw new Error('Unauthorized: Admin privileges required')
    }
    
    log('Admin privileges confirmed')
    let result = null
    
    switch (action) {
      case 'delete':
        if (!userId) {
          log('Missing userId for delete action', 'error')
          throw new Error('Missing userId parameter')
        }
        
        log(`Attempting to delete user: ${userId}`)
        
        try {
          // Begin transaction - first delete from public.users (our custom table)
          log('Removing user from public.users table')
          const { error: userTableError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId)
          
          // Even if the user doesn't exist in our custom table, continue with auth deletion
          if (userTableError && !userTableError.message.includes('No rows found')) {
            log('Error deleting from users table:', 'error', userTableError)
            // Don't throw here, just log and continue - user might exist only in auth
          }
          
          // Check if user exists in auth.users before attempting deletion
          log('Checking if user exists in auth')
          const { data: userExists, error: checkError } = await supabaseAdmin.auth.admin.getUserById(userId)
          
          if (checkError) {
            log('Error checking if user exists:', 'error', checkError)
            // Continue anyway, since we still want to try deletion
          }
          
          if (!userExists || !userExists.user) {
            log(`User with ID ${userId} not found in auth.users`, 'warn')
            // If user already deleted from auth, consider it a success
            return new Response(
              JSON.stringify({ success: true, message: "User already deleted from auth" }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          
          // Then delete from auth.users
          log('Removing user from auth.users')
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
          
          if (deleteError) {
            log('Error deleting from auth.users:', 'error', deleteError)
            throw deleteError
          }
          
          log(`Successfully deleted user: ${userId}`)
        } catch (err) {
          log('Transaction error during user deletion:', 'error', err)
          throw new Error(`Failed to delete user: ${err.message}`)
        }
        
        result = { success: true }
        break
        
      case 'create':
        if (!userData?.email || !userData?.password || !userData?.role) {
          log('Missing required user data for create action', 'error')
          throw new Error('Missing required user data')
        }
        
        log(`Creating new user: ${userData.email} with role: ${userData.role}`)
        
        try {
          // Create the user in auth.users
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true
          })
          
          if (createError) {
            log('Error creating user in auth.users:', 'error', createError)
            throw createError
          }
          
          // Ensure user exists in public.users table with correct role
          if (newUser?.user) {
            log(`Ensuring user exists in public.users with ID: ${newUser.user.id}`)
            const { error: roleError } = await supabaseAdmin
              .from('users')
              .upsert({
                id: newUser.user.id,
                email: newUser.user.email,
                role: userData.role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            
            if (roleError) {
              log('Error ensuring user in public.users:', 'error', roleError)
              // Even if this fails, the auth user was created, so return success
              log('User created in auth but not in public.users table', 'warn')
            }
          }
          
          result = { success: true, user: newUser.user }
        } catch (createUserError) {
          log('User creation failed', 'error', createUserError)
          throw new Error(`Failed to create user: ${createUserError.message}`)
        }
        break
        
      case 'update':
        if (!userId) {
          log('Missing userId for update action', 'error')
          throw new Error('Missing userId parameter')
        }
        
        log(`Updating user: ${userId}`, 'info', userData)
        
        try {
          if (userData?.password) {
            log('Updating user password')
            const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
              userId,
              { password: userData.password }
            )
            
            if (pwError) {
              log('Error updating password:', 'error', pwError)
              throw pwError
            }
          }
          
          if (userData?.role) {
            log(`Updating user role to: ${userData.role}`)
            const { error: roleError } = await supabaseAdmin
              .from('users')
              .update({ 
                role: userData.role,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)
            
            if (roleError) {
              log('Error updating role:', 'error', roleError)
              throw roleError
            }
          }
          
          result = { success: true }
        } catch (updateUserError) {
          log('User update failed', 'error', updateUserError)
          throw new Error(`Failed to update user: ${updateUserError.message}`)
        }
        break
        
      default:
        log(`Unknown action requested: ${action}`, 'error')
        throw new Error(`Unknown action: ${action}`)
    }
    
    log('Action completed successfully')
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    log('Error in manage-users function:', 'error', error)
    
    // Determine appropriate status code
    let statusCode = 400
    if (error.message?.includes('Unauthorized')) {
      statusCode = 403
    } else if (error.message?.includes('configuration error')) {
      statusCode = 500
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.details || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode
      }
    )
  }
})
