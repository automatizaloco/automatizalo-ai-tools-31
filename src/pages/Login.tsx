
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTheme } from "@/context/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/admin/blog");
      }
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
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={theme === 'dark' ? 'text-gray-200' : ''}>Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
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
