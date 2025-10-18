import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, TrendingUp, Shield, Users, Star, CheckCircle } from 'lucide-react';
import { AuthSignup } from './AuthSignup';
import { AuthSignin } from './AuthSignin';

interface AuthLandingProps {
  onAuthSuccess?: () => void;
}

export const AuthLanding = ({ onAuthSuccess }: AuthLandingProps) => {
  const [currentView, setCurrentView] = useState<'landing' | 'signup' | 'signin'>('landing');

  if (currentView === 'signup') {
    return (
      <AuthSignup 
        onSuccess={onAuthSuccess}
        onBackToLanding={() => setCurrentView('landing')}
        onSwitchToSignin={() => setCurrentView('signin')}
      />
    );
  }

  if (currentView === 'signin') {
    return (
      <AuthSignin 
        onSuccess={onAuthSuccess}
        onBackToLanding={() => setCurrentView('landing')}
        onSwitchToSignup={() => setCurrentView('signup')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl text-blue-600">HealthSync Pro</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform Your Health Data into Actionable Insights
          </p>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl mb-6">
            Your Health, <span className="text-blue-600">Unified</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect all your health devices and apps in one intelligent dashboard. 
            Get AI-powered insights, personalized recommendations, and track your progress 
            with enterprise-grade security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => setCurrentView('signup')} className="text-lg px-8 py-3">
              <TrendingUp className="mr-2 h-5 w-5" />
              See Your Fitness Trends
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentView('signup')} className="text-lg px-8 py-3">
              <Activity className="mr-2 h-5 w-5" />
              Get Personalized Insights
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Already have an account? 
            <Button variant="link" onClick={() => setCurrentView('signin')} className="px-2">
              Sign In
            </Button>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">+12,438 users this week</span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 2,400+ reviews</span>
          </div>
          <p className="text-sm italic text-muted-foreground max-w-md mx-auto">
            "HealthSync helped me lose 15kg by showing me patterns I never noticed"
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Unified Health View</CardTitle>
              <CardDescription>
                Connect Apple Health, Google Fit, Fitbit, Garmin, and Strava in one dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Real-time data sync
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cross-platform analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automatic data correlation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Get personalized recommendations based on your unique health patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Predictive analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Trend identification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Goal optimization
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                HIPAA/GDPR compliant with end-to-end encryption for your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  End-to-end encryption
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  HIPAA compliant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Zero data selling
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security Badges */}
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-4">Trusted by healthcare professionals worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              SSL Encrypted
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="h-3 w-3 mr-1" />
              50,000+ Users
            </Badge>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Start Your Health Journey</CardTitle>
              <CardDescription>
                Join thousands transforming their health with data-driven insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setCurrentView('signup')} className="w-full" size="lg">
                Get Started - It's Free
              </Button>
              <p className="text-xs text-muted-foreground">
                ✓ No credit card required<br />
                ✓ 30-day free trial<br />
                ✓ Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Pricing: Individual ($9.99-$19.99/month) • Healthcare Providers (Custom) • Corporate ($8/user/month)
          </p>
        </footer>
      </div>
    </div>
  );
};