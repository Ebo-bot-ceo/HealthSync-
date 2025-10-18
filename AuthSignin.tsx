import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Eye, EyeOff, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SocialAuthButtons } from './SocialAuthButtons';
import { PasswordReset } from './PasswordReset';
import { toast } from 'sonner@2.0.3';

interface AuthSigninProps {
  onSuccess?: () => void;
  onBackToLanding: () => void;
  onSwitchToSignup: () => void;
}

export const AuthSignin = ({ onSuccess, onBackToLanding, onSwitchToSignup }: AuthSigninProps) => {
  const { signIn, signInWithProvider, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  if (showPasswordReset) {
    return (
      <PasswordReset 
        onBack={() => setShowPasswordReset(false)}
        onBackToLanding={onBackToLanding}
      />
    );
  }

  const handleSocialSignin = async (provider: 'google' | 'apple' | 'facebook') => {
    setError(null);
    const { error } = await signInWithProvider(provider);
    
    if (error) {
      setError(error.message);
      
      // Check if it's a configuration error
      if (error.message?.includes('not configured') || 
          error.message?.includes('provider is not enabled') ||
          error.message?.includes('Unsupported provider')) {
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        toast.error(`${providerName} authentication requires additional setup. Please use email authentication or contact your administrator.`, {
          duration: 5000
        });
      } else {
        toast.error(`Failed to sign in with ${provider}: ${error.message}`);
      }
    } else {
      toast.success(`Signing in with ${provider}...`);
      onSuccess?.();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const { user, session, error } = await signIn({
      email,
      password,
      rememberMe
    });

    if (error) {
      setError(error.message);
      toast.error('Sign in failed: ' + error.message);
    } else if (user) {
      toast.success('Welcome back to HealthSync Pro!');
      onSuccess?.();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={onBackToLanding}
            className="self-start p-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-blue-600">HealthSync Pro</span>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your health dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Social Signin Options */}
          <SocialAuthButtons onSocialAuth={handleSocialSignin} mode="signin" />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me for 30 days
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="flex flex-col gap-2 text-center text-sm">
            <Button 
              variant="link" 
              onClick={() => setShowPasswordReset(true)}
              className="p-0 h-auto"
            >
              Forgot Password?
            </Button>
            
            <div className="text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" onClick={onSwitchToSignup} className="p-0 h-auto">
                Sign Up
              </Button>
            </div>
          </div>

          {/* Security Trust Indicators */}
          <div className="pt-4 border-t">
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground">
                🔒 Secure SSL Encryption
              </div>
              <div className="text-xs text-muted-foreground">
                🏆 HIPAA Compliant • 🛡️ We Never Share Your Data
              </div>
              <div className="pt-2">
                <Button 
                  variant="link" 
                  onClick={() => window.open('/oauth-setup', '_blank')}
                  className="text-xs p-0 h-auto text-muted-foreground"
                >
                  Need to configure social authentication?
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};