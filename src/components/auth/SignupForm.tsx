
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSwitchMode: (mode: 'login') => void;
}

const SignupForm = ({ onSwitchMode }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear password error when user types
      if (name === 'password' || name === 'confirmPassword') {
        setPasswordError(null);
      }
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      // After successful signup, switch to login mode
      onSwitchMode('login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="text-sm font-medium text-gray-300 mb-1 block">
          Full Name
        </label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="bg-secondary/60 border-white/10 focus:border-brand-purple/50"
          disabled={isLoading}
        />
      </div>

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
        <label htmlFor="password" className="text-sm font-medium text-gray-300 mb-1 block">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Create a password"
          className="bg-secondary/60 border-white/10 focus:border-brand-purple/50"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 mb-1 block">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your password"
          className="bg-secondary/60 border-white/10 focus:border-brand-purple/50"
          disabled={isLoading}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="termsAccepted" 
          name="termsAccepted" 
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
          }
          className="mt-1"
          disabled={isLoading}
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-400">
          I agree to the <Link to="/terms" className="text-brand-purple hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-purple hover:underline">Privacy Policy</Link>
        </label>
      </div>

      <Button 
        type="submit" 
        className="btn-primary w-full"
        disabled={isLoading || !formData.termsAccepted}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{' '}
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

export default SignupForm;
