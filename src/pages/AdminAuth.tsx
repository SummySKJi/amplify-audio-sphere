
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Lock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'musicdistributionindia.in@gmail.com', // Pre-filled admin email
    password: ''
  });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      // Auth context will redirect to dashboard if login is successful and user is admin
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Admin login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-400">
            Secure login for administrators only
          </p>
        </div>

        <Card className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center border border-gray-700 rounded-md bg-gray-800/50 pr-3 mb-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Admin Email"
                  className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={true} // Make email read-only
                />
                <User className="text-gray-400 h-5 w-5" />
              </div>

              <div className="flex items-center border border-gray-700 rounded-md bg-gray-800/50 pr-3">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Admin Password"
                  className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Lock className="text-gray-400 h-5 w-5" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Admin Login'
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            Back to Website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
