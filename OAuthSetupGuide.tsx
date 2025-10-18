import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  ExternalLink, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Copy,
  Settings,
  Globe,
  Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const OAuthSetupGuide = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const currentDomain = window.location.origin;
  const redirectUrl = `${currentDomain}/auth/callback`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>OAuth Authentication Setup</CardTitle>
              <CardDescription>
                Configure social authentication providers for HealthSync Pro
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Administrator Setup Required</AlertTitle>
            <AlertDescription>
              Social authentication requires configuration in both the OAuth provider platforms 
              and your Supabase project dashboard. This setup is typically done by a system administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Email/Password</div>
                <div className="text-sm text-muted-foreground">Ready</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium">Google OAuth</div>
                <div className="text-sm text-muted-foreground">Requires setup</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium">Apple/Facebook</div>
                <div className="text-sm text-muted-foreground">Requires setup</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Required Configuration Values
          </CardTitle>
          <CardDescription>
            These values are needed for OAuth setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Redirect URL</div>
                <div className="text-sm text-muted-foreground font-mono">{redirectUrl}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(redirectUrl, 'Redirect URL')}
              >
                {copiedText === 'Redirect URL' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Site URL</div>
                <div className="text-sm text-muted-foreground font-mono">{currentDomain}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentDomain, 'Site URL')}
              >
                {copiedText === 'Site URL' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="apple">Apple</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                </svg>
                Google OAuth Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Badge variant="outline">Step 1: Google Cloud Console</Badge>
                  <p className="text-sm">Create a new project or select existing project in Google Cloud Console</p>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                    className="w-fit"
                  >
                    Open Google Cloud Console
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Step 2: Enable APIs</Badge>
                  <p className="text-sm">Enable the Google+ API and Google OAuth2 API</p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Step 3: Create OAuth Credentials</Badge>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Go to "Credentials" → "Create Credentials" → "OAuth client ID"</li>
                    <li>• Application type: Web application</li>
                    <li>• Authorized redirect URIs: <code className="bg-muted px-1 rounded">{redirectUrl}</code></li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Step 4: Configure Supabase</Badge>
                  <p className="text-sm">Add the Client ID and Client Secret to your Supabase project</p>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-google', '_blank')}
                    className="w-fit"
                  >
                    View Supabase Google Setup Guide
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple Sign In Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Apple Sign In requires an Apple Developer account ($99/year) and is more complex to set up.
                </AlertDescription>
              </Alert>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-apple', '_blank')}
                className="w-fit"
              >
                View Supabase Apple Setup Guide
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook Login Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Facebook Login requires creating a Facebook App and completing their review process for production use.
                </AlertDescription>
              </Alert>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-facebook', '_blank')}
                className="w-fit"
              >
                View Supabase Facebook Setup Guide
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>For immediate deployment</AlertTitle>
            <AlertDescription>
              Start with email/password authentication, which is already configured and working. 
              Add social authentication providers later as needed. Google OAuth is the easiest to set up first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};