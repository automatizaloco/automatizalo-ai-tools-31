
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userData = { 
          email: session.user.email || '', 
          isAdmin: true 
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    };
    
    initializeAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        } else if (event === 'SIGNED_IN' && session) {
          const userData = { 
            email: session.user.email || '', 
            isAdmin: true 
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log(`Attempting to login with email: ${email}`);
      
      // Always use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase auth error:", error);
        toast.error(error.message || "Invalid credentials");
        return false;
      }
      
      if (!data.session) {
        console.error("No session created");
        toast.error("No session created. Please try again.");
        return false;
      }
      
      const userData = { email, isAdmin: true };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Successfully logged in");
      console.log("Login successful, user data:", userData);
      return true;
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
