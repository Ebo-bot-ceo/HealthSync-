import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase/client';

interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  healthGoals?: string[];
  basicInfo?: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
  };
}

interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (credentials: SignUpData) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (credentials: SignInData) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
  signInWithProvider: (provider: 'google' | 'apple' | 'facebook') => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<SignUpData>) => Promise<{ error: AuthError | null }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session retrieval error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (credentials: SignUpData) => {
    try {
      setLoading(true);
      
      // Create user metadata object
      const userMetadata: Record<string, any> = {};
      if (credentials.fullName) userMetadata.full_name = credentials.fullName;
      if (credentials.healthGoals) userMetadata.health_goals = credentials.healthGoals;
      if (credentials.basicInfo) userMetadata.basic_info = credentials.basicInfo;

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: userMetadata
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { user: null, error };
      }

      console.log('User signed up successfully:', data.user?.email);
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: SignInData) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Signin error:', error);
        return { user: null, session: null, error };
      }

      console.log('User signed in successfully:', data.user?.email);
      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Unexpected signin error:', error);
      return { user: null, session: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`
        }
      });

      if (error) {
        console.error(`${provider} signin error:`, error);
        
        // Handle specific OAuth configuration errors
        if (error.message?.includes('provider is not enabled') || 
            error.message?.includes('Unsupported provider')) {
          const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
          const configError = new Error(
            `${providerName} authentication is not configured. Please set up ${providerName} OAuth in your Supabase Dashboard. Visit https://supabase.com/docs/guides/auth/social-login/auth-${provider} for setup instructions.`
          ) as AuthError;
          configError.status = 400;
          return { error: configError };
        }
        
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error(`Unexpected ${provider} signin error:`, error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Signout error:', error);
        return { error };
      }

      console.log('User signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected signout error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      console.log('Password reset email sent to:', email);
      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<SignUpData>) => {
    try {
      if (!user) {
        return { error: new Error('No authenticated user') as AuthError };
      }

      const userMetadata = { ...user.user_metadata };
      if (updates.fullName) userMetadata.full_name = updates.fullName;
      if (updates.healthGoals) userMetadata.health_goals = updates.healthGoals;
      if (updates.basicInfo) userMetadata.basic_info = { ...userMetadata.basic_info, ...updates.basicInfo };

      const { error } = await supabase.auth.updateUser({
        data: userMetadata
      });

      if (error) {
        console.error('Profile update error:', error);
        return { error };
      }

      console.log('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected profile update error:', error);
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};