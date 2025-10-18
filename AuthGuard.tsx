import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthLanding } from './AuthLanding';
import { OnboardingFlow } from './OnboardingFlow';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  showOnboarding?: boolean;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  showOnboarding = true 
}: AuthGuardProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, show auth flow
  if (requireAuth && !isAuthenticated) {
    return <AuthLanding />;
  }

  // If user is authenticated but hasn't completed onboarding
  if (isAuthenticated && showOnboarding && user) {
    const hasCompletedOnboarding = user.user_metadata?.onboarding_completed;
    
    if (!hasCompletedOnboarding) {
      return <OnboardingFlow />;
    }
  }

  // User is authenticated and onboarded, show protected content
  return <>{children}</>;
};