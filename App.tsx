import { AuthProvider } from "./hooks/useAuth";
import { AuthGuard } from "./components/auth/AuthGuard";
import { HealthDashboard } from "./components/HealthDashboard";
import { OAuthSetupPage } from "./components/OAuthSetupPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  // Simple routing based on pathname
  const currentPath = window.location.pathname;
  
  if (currentPath === '/oauth-setup') {
    return (
      <div className="size-full">
        <OAuthSetupPage />
        <Toaster />
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="size-full">
        <AuthGuard requireAuth={true} showOnboarding={true}>
          <HealthDashboard />
        </AuthGuard>
        <Toaster />
      </div>
    </AuthProvider>
  );
}