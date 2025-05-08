
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AuthForms from '@/components/AuthForms';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as 'login' | 'signup' | 'forgot' || 'login';
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      setRedirecting(true);
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-white">{redirecting ? 'Redirecting to dashboard...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern flex flex-col">
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center text-xl font-bold text-gradient mb-8">
          IND Distribution
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-6 py-12">
        <AuthForms initialMode={mode} />
      </div>
      
      <div className="py-6 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} IND Distribution. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;
