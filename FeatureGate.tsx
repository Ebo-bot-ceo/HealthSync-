import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Lock, Crown, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface FeatureGateProps {
  children: ReactNode;
  feature: string;
  title?: string;
  description?: string;
  isPremium?: boolean;
  showUpgrade?: boolean;
}

export const FeatureGate = ({ 
  children, 
  feature, 
  title, 
  description,
  isPremium = false,
  showUpgrade = true 
}: FeatureGateProps) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user has access to this feature
  const hasAccess = isAuthenticated && (!isPremium || user?.user_metadata?.subscription === 'premium');

  if (hasAccess) {
    return <>{children}</>;
  }

  // If not authenticated, show signup prompt
  if (!isAuthenticated) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-lg">Sign Up to Continue</CardTitle>
              <CardDescription>
                {description || `Sign up to access ${feature} and unlock personalized health insights`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited health tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Secure data sync</span>
                </div>
              </div>
              
              <Button className="w-full">
                Get Started - It's Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Join 50,000+ users improving their health
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  // If authenticated but needs premium, show upgrade prompt
  if (isPremium && showUpgrade) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-lg">{title || 'Premium Feature'}</CardTitle>
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
              <CardDescription>
                {description || `Upgrade to Pro to access ${feature} and advanced analytics`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced AI insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited data export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom goal tracking</span>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro - $9.99/month
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                30-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  // Simple lock overlay for other cases
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div className="text-center space-y-2">
          <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            {title || 'Feature Locked'}
          </p>
        </div>
      </div>
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
    </div>
  );
};