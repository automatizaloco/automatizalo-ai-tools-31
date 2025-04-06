
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const [email, setEmail] = useState("contact@automatizalo.co");
  const [password, setPassword] = useState("Automatizalo2025@");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { email });
      
      const success = await login(email, password);
      if (success) {
        navigate("/admin/blog");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-16 md:pt-32 pb-16">
      <div className="container max-w-md mx-auto px-4">
        <div className={`p-5 md:p-8 rounded-xl shadow-md border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h1 className={`text-xl md:text-2xl font-bold text-center mb-6 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>Admin Login</h1>
          
          {error && (
            <div className={`p-3 mb-4 rounded-md flex items-center gap-2 ${
              theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-700'
            }`}>
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-200' : ''}>Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className={theme === 'dark' ? 'text-gray-200' : ''}>Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
            
            <Button 
              type="submit" 
              className={`w-full ${theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-automatizalo-blue hover:bg-automatizalo-blue/90'}`}
              disabled={isLoading}
              size={isMobile ? "sm" : "default"}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
