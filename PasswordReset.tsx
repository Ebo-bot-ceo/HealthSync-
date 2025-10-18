import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Mail, CheckCircle, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner@2.0.3';

interface PasswordResetProps {
  onBack: () => void;
  onBackToLanding: () => void;
}

export const PasswordReset = ({ onBack, onBackToLanding }: PasswordResetProps) => {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      toast.error('Password reset failed: ' + error.message);
    } else {
      setSuccess(true);
      toast.success('Password reset email sent! Check your inbox.');
    }
  };

  if (success) {
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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <Mail className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">
                  Click the link in your email to reset your password. 
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button 
                  variant="link" 
                  onClick={() => setSuccess(false)}
                  className="p-0 h-auto"
                >
                  try a different email address
                </Button>
              </div>

              <Button 
                onClick={onBack}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="self-start p-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-blue-600">HealthSync Pro</span>
          </div>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onBack}
              className="p-0 h-auto text-sm"
            >
              ← Back to Sign In
            </Button>
          </div>

          {/* Email Template Preview */}
          <div className="mt-6 p-4 bg-muted rounded-lg border-l-4 border-blue-500">
            <p className="text-xs text-muted-foreground mb-2">Email Preview:</p>
            <div className="text-xs space-y-1">
              <p><strong>Subject:</strong> Reset your HealthSync password</p>
              <p><strong>From:</strong> HealthSync Pro Team</p>
              <p className="mt-2 text-muted-foreground">
                "Hi [Name], We received a request to reset your password. 
                This link expires in 1 hour for security."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};