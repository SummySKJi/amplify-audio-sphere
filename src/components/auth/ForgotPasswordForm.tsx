
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: 'login') => void;
}

const ForgotPasswordForm = ({ onSwitchMode }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      // After sending reset email, you could switch back to login
      setTimeout(() => {
        onSwitchMode('login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
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
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </Button>

      <div className="text-center text-sm">
        <p className="text-gray-400">
          Remember your password?{' '}
          <button 
            type="button" 
            className="text-brand-purple hover:underline" 
            onClick={() => onSwitchMode('login')}
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
