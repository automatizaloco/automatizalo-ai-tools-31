
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{error: any | null}>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        return;
      }
      
      if (data.session) {
        setUser(data.session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Unexpected error refreshing session:", error);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing auth context");
        
        // First, check if we already have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setUser(null);
          setIsAuthenticated(false);
        } else if (sessionData.session) {
          console.log("Session found:", sessionData.session.user.email);
          setUser(sessionData.session.user);
          setIsAuthenticated(true);
        } else {
          console.log("No active session found");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Set up auth state change listener
  useEffect(() => {
    if (!authInitialized) return;
    
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", !!session);
      
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      console.log("Cleaning up auth listener");
      subscription?.unsubscribe();
    };
  }, [authInitialized]);

  // Handle redirects for protected routes
  useEffect(() => {
    if (isLoading || !authInitialized) return;
    
    // Check if we're on an admin route and not authenticated
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (isAdminRoute && !isAuthenticated && !isLoading) {
      console.log("Unauthenticated access to admin route, redirecting");
      navigate(`/login?redirect=${location.pathname}`);
    }
  }, [location, isAuthenticated, isLoading, navigate, authInitialized]);

  const login = async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        return { error };
      }

      console.log("Login successful for:", email);
      return { error: null };
    } catch (err) {
      console.error("Unexpected error during login:", err);
      return { error: err };
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed: " + error.message);
      } else {
        toast.success("Successfully logged out");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const value: AuthContextProps = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  if (isLoading && !authInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
