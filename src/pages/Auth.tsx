
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthForms from '@/components/AuthForms';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as 'login' | 'signup' | 'forgot' || 'login';

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
