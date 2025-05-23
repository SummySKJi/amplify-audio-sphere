
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to check if email is an admin email
  const isAdminEmail = (email: string): boolean => {
    const adminEmails = ['admin@mdi.in', 'musicdistributionindia.in@gmail.com'];
    return adminEmails.includes(email.toLowerCase());
  };

  // Function to fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile data:", data);
      setProfile(data);
      
      // Update isAdmin state based on profile role
      const adminRole = data?.role === "admin";
      setIsAdmin(adminRole);
      
      // If profile exists but doesn't have admin role, check if it should
      if (data && !adminRole && user?.email && isAdminEmail(user.email)) {
        console.log("This appears to be an admin account, updating role...");
        await updateUserRole(userId, "admin");
      }
    } catch (error) {
      console.error("Error in profile fetch:", error);
    }
  };
  
  // Function to update user role
  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: role })
        .eq("id", userId);
        
      if (error) {
        console.error("Error updating user role:", error);
        return;
      }
      
      console.log(`User role updated to ${role}`);
      setIsAdmin(role === "admin");
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Function to handle auth state changes
    const handleAuthChange = (event: string, currentSession: Session | null) => {
      console.log("Auth state change event:", event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Load profile data in a setTimeout to avoid deadlock
      if (currentSession?.user) {
        setTimeout(() => {
          fetchProfile(currentSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      console.log("Signing in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        toast.error(error.message);
        throw error;
      }

      console.log("Sign in successful:", data);
      
      // Check if this is an admin account
      if (data.user) {
        const isEmailAdmin = isAdminEmail(email);
        
        if (isEmailAdmin) {
          console.log("Admin login detected");
          // Fetch profile to confirm or update admin status
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching admin profile:", profileError);
          } else {
            console.log("Admin profile:", profileData);
            if (profileData?.role !== 'admin') {
              // Update the profile to ensure this account is set as admin
              await updateUserRole(data.user.id, "admin");
            } else {
              setIsAdmin(true);
            }
          }
          
          // Direct admin to dashboard
          toast.success('Admin signed in successfully!');
          navigate('/dashboard');
          return;
        }
      }

      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Sign in catch error:", error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        toast.error(error.message);
        throw error;
      }

      console.log("Google sign in initiated:", data);
      // No need for navigation here as OAuth will handle the redirect
    } catch (error: any) {
      console.error("Google sign in catch error:", error);
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Account created successfully! Please check your email for verification or sign in now.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success('Signed out successfully');
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=login`,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
