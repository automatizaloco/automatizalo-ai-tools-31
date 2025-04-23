
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ClientLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      console.log('Login successful, checking user role');
      
      // Check user role to determine redirect
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user role:', userError);
        // Special case for main admin
        if (email === 'contact@automatizalo.co') {
          navigate('/admin');
          toast.success('Successfully logged in as administrator');
          return;
        }
      }
      
      console.log('User data:', userData);
      
      // Handle main admin account separately
      if (email === 'contact@automatizalo.co') {
        // Ensure the user has admin role
        if (!userData || userData.role !== 'admin') {
          console.log('Setting admin role for main account');
          const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error('Error updating admin role:', updateError);
          }
        }
        navigate('/admin');
      }
      // Redirect based on role
      else if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client-portal');
      }
      
      toast.success('Successfully logged in');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Client Login</CardTitle>
        <CardDescription>
          Login to access your client portal. Contact an administrator if you need an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientLogin;
