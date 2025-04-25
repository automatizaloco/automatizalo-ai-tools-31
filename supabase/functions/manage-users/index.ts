
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    // Validate request method
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
    
    // Verify the user is authenticated
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt)
    
    if (authError || !user) {
      console.error("Authentication error:", authError)
      throw new Error('Unauthorized: Invalid token')
    }
    
    console.log("Authenticated user:", user.email)
    
    // Parse the request body
    const reqBody = await req.json()
    console.log("Request body:", JSON.stringify(reqBody))
    
    const { action, userId, userData } = reqBody
    
    // For verifyAdmin action, we just need to check if the user is an admin
    if (action === 'verifyAdmin') {
      // Check if the user exists in the users table with admin role
      const { data: userData, error: userRoleError } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (userRoleError) {
        console.error("Error fetching user role:", userRoleError)
      }
      
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
    
    // For other actions, verify the user is an admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (adminError || adminData?.role !== 'admin') {
      console.error("Admin verification error:", adminError || "User is not admin")
      throw new Error('Unauthorized: Admin role required')
    }
    
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
        
        // First try to delete from auth.users
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (authDeleteError) {
          console.error('Error deleting auth user:', authDeleteError)
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
        } 
        
        console.log(`User ${userId} deleted successfully`)
        result = { success: true }
        break
      }
      
      case 'create': {
        if (!userData || !userData.email || !userData.password || !userData.role) {
          throw new Error('Missing required user data parameters')
        }
        
        console.log(`Creating new user with email ${userData.email}...`)
        
        // Create auth user
        const { data: authData, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: { role: userData.role }
        })
        
        if (authCreateError) {
          console.error('Error creating auth user:', authCreateError)
          error = authCreateError
          break
        }
        
        if (!authData.user) {
          console.error('No user returned from auth.admin.createUser')
          error = new Error('Failed to create auth user')
          break
        }
        
        // Create user in users table
        const { error: dbCreateError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            role: userData.role,
          })
        
        if (dbCreateError) {
          console.error('Error creating user in database:', dbCreateError)
          error = dbCreateError
          break
        }
        
        console.log(`User ${userData.email} created successfully`)
        result = { success: true, user: authData.user }
        break
      }
      
      case 'update': {
        if (!userId) {
          throw new Error('Missing userId parameter')
        }
        
        console.log(`Updating user ${userId}...`)
        
        // Update user data in users table
        if (userData && Object.keys(userData).length > 0) {
          // Filter out password from userData for database update
          const { password, ...dbUserData } = userData;
          
          if (Object.keys(dbUserData).length > 0) {
            const { error: dbUpdateError } = await supabaseAdmin
              .from('users')
              .update(dbUserData)
              .eq('id', userId)
            
            if (dbUpdateError) {
              console.error('Error updating user in database:', dbUpdateError)
              error = dbUpdateError
              break
            }
          }
          
          // Update password if provided
          if (password) {
            const { error: passwordUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
              userId,
              { password }
            )
            
            if (passwordUpdateError) {
              console.error('Error updating user password:', passwordUpdateError)
              error = passwordUpdateError
              break
            }
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
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Error in manage-users function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
