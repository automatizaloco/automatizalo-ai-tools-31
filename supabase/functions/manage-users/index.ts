
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables')
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Unauthorized: Invalid token')
    }
    
    const reqBody = await req.json()
    const { action, userId, userData } = reqBody
    
    // For verifyAdmin action, use the new is_admin function
    if (action === 'verifyAdmin') {
      const { data, error: verifyError } = await supabaseAdmin.rpc('is_admin', { user_uid: user.id })
      
      if (verifyError) {
        console.error('Error verifying admin:', verifyError)
        throw new Error('Failed to verify admin status')
      }
      
      return new Response(
        JSON.stringify({ isAdmin: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // For other actions, verify admin status first
    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc('is_admin', { user_uid: user.id })
    
    if (adminCheckError || !isAdmin) {
      console.error('Admin check error:', adminCheckError)
      throw new Error('Unauthorized: Admin privileges required')
    }
    
    let result = null
    
    switch (action) {
      case 'delete':
        if (!userId) throw new Error('Missing userId parameter')
        
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (deleteError) throw deleteError
        
        result = { success: true }
        break
        
      case 'create':
        if (!userData?.email || !userData?.password || !userData?.role) {
          throw new Error('Missing required user data')
        }
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true
        })
        
        if (createError) throw createError
        
        result = { success: true, user: newUser.user }
        break
        
      case 'update':
        if (!userId) throw new Error('Missing userId parameter')
        
        if (userData?.password) {
          const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: userData.password }
          )
          if (pwError) throw pwError
        }
        
        if (userData?.role) {
          const { error: roleError } = await supabaseAdmin
            .from('users')
            .update({ role: userData.role })
            .eq('id', userId)
          
          if (roleError) throw roleError
        }
        
        result = { success: true }
        break
        
      default:
        throw new Error(`Unknown action: ${action}`)
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error in manage-users function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Unauthorized') ? 403 : 400
      }
    )
  }
})
