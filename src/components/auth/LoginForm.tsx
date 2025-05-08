
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSwitchMode: (mode: 'signup' | 'forgot') => void;
}

const LoginForm = ({ onSwitchMode }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-1 block">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          className="bg-secondary/60 border-white/10 focus:border-brand-purple/50"
          disabled={isLoading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <button 
            type="button" 
            className="text-xs text-brand-purple hover:underline"
            onClick={() => onSwitchMode('forgot')}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
          className="bg-secondary/60 border-white/10 focus:border-brand-purple/50"
          disabled={isLoading}
        />
      </div>

      <Button 
        type="submit" 
        className="btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center text-sm">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <button 
            type="button" 
            className="text-brand-purple hover:underline" 
            onClick={() => onSwitchMode('signup')}
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
