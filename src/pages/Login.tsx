
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTheme } from "@/context/ThemeContext";
import { AlertCircle, Info } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("contact@automatizalo.co");
  const [password, setPassword] = useState("Automatizalo2025@");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container max-w-md mx-auto px-4">
          <div className={`p-8 rounded-xl shadow-md border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h1 className={`text-2xl font-bold text-center mb-6 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>Admin Login</h1>
            
            {/* Admin credentials info */}
            <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <Info className={`h-5 w-5 mt-0.5 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                <p className="text-sm font-medium mb-1">Admin Credentials:</p>
                <p className="text-sm">Email: contact@automatizalo.co</p>
                <p className="text-sm">Password: Automatizalo2025@</p>
              </div>
            </div>
            
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
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
