
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthFormsProps {
  initialMode?: AuthMode;
}

const AuthForms = ({ initialMode = 'login' }: AuthFormsProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUp(formData.email, formData.password, formData.fullName);
        setMode('login');
      } else if (mode === 'forgot') {
        await resetPassword(formData.email);
        setMode('login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">
          {mode === 'login' ? 'Welcome Back' : 
           mode === 'signup' ? 'Create an Account' : 
           'Reset Your Password'}
        </h2>
        <p className="text-gray-400">
          {mode === 'login' ? 'Sign in to access your account' : 
           mode === 'signup' ? 'Join IND Distribution today' : 
           'Enter your email to receive reset instructions'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'signup' && (
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
            />
          </div>
        )}

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
          />
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              {mode === 'login' && (
                <button 
                  type="button" 
                  className="text-xs text-brand-purple hover:underline"
                  onClick={() => setMode('forgot')}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
              className="bg-secondary/60 border-white/10 focus:border-brand-purple/50"
            />
          </div>
        )}

        {mode === 'signup' && (
          <>
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
              />
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
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-400">
                I agree to the <Link to="/terms" className="text-brand-purple hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-purple hover:underline">Privacy Policy</Link>
              </label>
            </div>
          </>
        )}

        <Button 
          type="submit" 
          className="btn-primary w-full"
          disabled={isLoading || (mode === 'signup' && !formData.termsAccepted)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            mode === 'login' ? 'Sign In' : 
            mode === 'signup' ? 'Create Account' : 
            'Send Reset Link'
          )}
        </Button>

        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative px-4 bg-card text-sm text-gray-400">or</div>
        </div>

        <Button
          type="button"
          className="w-full bg-white text-black hover:bg-gray-200"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          {mode === 'login' ? 'Sign In with Google' : 'Sign Up with Google'}
        </Button>

        <div className="text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                type="button" 
                className="text-brand-purple hover:underline" 
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                type="button" 
                className="text-brand-purple hover:underline" 
                onClick={() => setMode('login')}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Remember your password?{' '}
              <button 
                type="button" 
                className="text-brand-purple hover:underline" 
                onClick={() => setMode('login')}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForms;
