
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Environment variables from Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

// Create Supabase client with service role key (admin privileges)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create admin client using service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    // Verify the user is authenticated and has admin role
    const jwt = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })
    
    // Verify the JWT token and get user info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt)
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid token')
    }
    
    // Verify the user is an admin by checking the users table
    const { data: userData, error: userRoleError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userRoleError || !userData || userData.role !== 'admin') {
      throw new Error('Unauthorized: Admin role required')
    }

    // Parse the request body
    const { action, userId, userData: updateData } = await req.json()
    
    // Log the action being performed
    console.log(`Performing action "${action}" on user ID: ${userId}`)
    
    let result = null
    let error = null
    
    // Perform the requested action
    switch (action) {
      case 'delete': {
        if (!userId) {
          throw new Error('Missing userId parameter')
        }
        
        // First try to delete from auth.users (requires service role)
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (authDeleteError) {
          console.error('Error deleting auth user:', authDeleteError)
          // If we fail to delete the auth user, report error
          error = authDeleteError
          break
        }
        
        // Then delete from users table
        const { error: dbDeleteError } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', userId)
        
        if (dbDeleteError) {
          console.error('Error deleting database user:', dbDeleteError)
          error = dbDeleteError
          // Note: we've already deleted the auth user at this point
        } 
        
        console.log(`User ${userId} deleted successfully`)
        result = { success: true }
        break
      }
      
      case 'verifyAdmin': {
        // This action just verifies the user is an admin, which we already did above
        result = { isAdmin: true }
        break
      }
      
      case 'update': {
        if (!userId || !updateData) {
          throw new Error('Missing userId or userData parameters')
        }
        
        // Update user data
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update(updateData)
          .eq('id', userId)
        
        if (updateError) {
          error = updateError
          break
        }
        
        // If password is included, update it in auth
        if (updateData.password) {
          const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: updateData.password }
          )
          
          if (passwordError) {
            error = passwordError
            break
          }
        }
        
        console.log(`User ${userId} updated successfully`)
        result = { success: true }
        break
      }
      
      default:
        throw new Error(`Unknown action: ${action}`)
    }
    
    if (error) {
      throw error
    }
    
    // Return the result with CORS headers
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Error:', error.message)
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
