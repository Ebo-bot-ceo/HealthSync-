import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ExternalLink, Info } from 'lucide-react';

export const SocialLoginSetup = () => {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <CardTitle>Social Login Setup Required</CardTitle>
        </div>
        <CardDescription>
          To enable Google, Apple, and Facebook authentication, additional setup is required in your Supabase project.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Google Authentication</AlertTitle>
          <AlertDescription>
            Follow the setup guide at{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-google', '_blank')}
            >
              Supabase Google Auth Guide
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Apple Authentication</AlertTitle>
          <AlertDescription>
            Follow the setup guide at{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-apple', '_blank')}
            >
              Supabase Apple Auth Guide
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Facebook Authentication</AlertTitle>
          <AlertDescription>
            Follow the setup guide at{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-facebook', '_blank')}
            >
              Supabase Facebook Auth Guide
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Current Status</h4>
          <ul className="text-sm space-y-1">
            <li>✅ Email/Password authentication - Ready</li>
            <li>🔧 Google authentication - Requires setup</li>
            <li>🔧 Apple authentication - Requires setup</li>
            <li>🔧 Facebook authentication - Requires setup</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};