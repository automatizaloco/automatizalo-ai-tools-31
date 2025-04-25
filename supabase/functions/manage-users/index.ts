
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Environment variables from Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
}

serve(async (req) => {
  console.log("Edge function invoked with method:", req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers")
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed. Only POST requests are accepted.`)
    }

    // Create admin client using service role key
    const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!)
    
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    // Verify the user is authenticated and has admin role
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt)
    
    if (authError || !user) {
      console.error("Authentication error:", authError)
      throw new Error('Unauthorized: Invalid token')
    }
    
    console.log("Authenticated user:", user.email)
    
    // Verify the user is an admin by checking the users table
    const { data: userData, error: userRoleError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    console.log("User role data:", userData)
    if (userRoleError) {
      console.error("Error fetching user role:", userRoleError) 
    }
      
    // Parse the request body
    let reqBody
    try {
      reqBody = await req.json()
      console.log("Request body:", JSON.stringify(reqBody))
    } catch (e) {
      console.error("Error parsing request body:", e)
      throw new Error('Invalid JSON in request body')
    }
    
    const { action, userId, userData: updateData } = reqBody
    
    // For verifyAdmin action, we just need to check if the user is an admin
    if (action === 'verifyAdmin') {
      const isAdmin = userData?.role === 'admin'
      console.log(`User ${user.email} admin status: ${isAdmin}`)
      return new Response(
        JSON.stringify({ isAdmin }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    // For other actions, we need to verify the user is an admin
    if (userData?.role !== 'admin') {
      console.error(`User ${user.email} is not an admin (role: ${userData?.role})`)
      throw new Error('Unauthorized: Admin role required')
    }

    // Log the action being performed
    console.log(`Admin user ${user.email} performing action "${action}" on user ID: ${userId}`)
    
    let result = null
    let error = null
    
    // Perform the requested action
    switch (action) {
      case 'delete': {
        if (!userId) {
          throw new Error('Missing userId parameter')
        }
        
        console.log(`Deleting user with ID ${userId}...`)
        
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
      
      case 'update': {
        if (!userId || !updateData) {
          throw new Error('Missing userId or userData parameters')
        }
        
        console.log(`Updating user ${userId} with data:`, updateData)
        
        // Update user data
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update(updateData)
          .eq('id', userId)
        
        if (updateError) {
          console.error('Error updating user in database:', updateError)
          error = updateError
          break
        }
        
        // If password is included, update it in auth
        if (updateData.password) {
          console.log('Updating user password...')
          const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: updateData.password }
          )
          
          if (passwordError) {
            console.error('Error updating user password:', passwordError)
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
      console.error(`Error in action "${action}":`, error)
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
    
  } catch (error: any) {
    console.error('Error in edge function:', error.message)
    
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
