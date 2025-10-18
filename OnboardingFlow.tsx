import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Bell, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Shield,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../utils/supabase/client';

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to HealthSync Pro!',
    description: 'Let\'s get you started on your health journey',
    icon: Sparkles,
    action: 'Explore Dashboard'
  },
  {
    id: 'connect_devices',
    title: 'Connect Your Health Devices',
    description: 'Sync data from your favorite health apps and devices',
    icon: Smartphone,
    action: 'Add Devices'
  },
  {
    id: 'set_goals',
    title: 'Set Your Health Goals',
    description: 'Define what success looks like for your health journey',
    icon: Target,
    action: 'Create Goals'
  },
  {
    id: 'notifications',
    title: 'Enable Notifications',
    description: 'Get reminded to log activities and receive insights',
    icon: Bell,
    action: 'Enable Notifications'
  },
  {
    id: 'first_insight',
    title: 'View Your First Insight',
    description: 'See how HealthSync analyzes your health data',
    icon: TrendingUp,
    action: 'See Insights'
  }
];

export const OnboardingFlow = () => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [deviceConnections, setDeviceConnections] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const progressPercentage = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];

  const handleStepComplete = async (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      // Store onboarding completion and data at the correct level in user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user?.user_metadata,
          onboarding_completed: true,
          device_connections: deviceConnections,
          health_goals: healthGoals,
          notifications_enabled: notificationsEnabled,
          onboarding_data: {
            completed_at: new Date().toISOString(),
            device_connections: deviceConnections,
            health_goals: healthGoals,
            notifications_enabled: notificationsEnabled
          }
        }
      });

      if (error) {
        throw error;
      }
      
      toast.success('Welcome to HealthSync Pro! Your dashboard is ready.');
      
      // The AuthGuard will automatically redirect to the main app
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('There was an issue completing setup. Please try again.');
    }
  };

  const handleDeviceConnection = (device: string) => {
    setDeviceConnections(prev => 
      prev.includes(device) 
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  const handleGoalSelection = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleNotificationRequest = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        toast.success('Notifications enabled! You\'ll receive helpful reminders.');
      } else {
        toast.info('You can enable notifications later in settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.info('You can enable notifications later in settings.');
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-2">Hello, {user?.user_metadata?.full_name || 'there'}!</h2>
              <p className="text-muted-foreground">
                HealthSync Pro unifies all your health data into actionable insights. 
                Let's take a quick tour to get you started.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                <span>Secure & Private</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span>AI Insights</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Activity className="h-6 w-6 text-purple-600" />
                <span>Unified Data</span>
              </div>
            </div>
          </div>
        );

      case 'connect_devices':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg mb-2">Connect Your Health Ecosystem</h3>
              <p className="text-muted-foreground text-sm">
                The more data sources you connect, the better insights we can provide
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Apple Health', popular: true },
                { name: 'Google Fit', popular: true },
                { name: 'Fitbit', popular: false },
                { name: 'Strava', popular: false },
                { name: 'Garmin', popular: false },
                { name: 'Withings', popular: false }
              ].map((device) => (
                <Button
                  key={device.name}
                  variant={deviceConnections.includes(device.name) ? "default" : "outline"}
                  className="h-16 flex-col gap-1 relative"
                  onClick={() => handleDeviceConnection(device.name)}
                >
                  {device.popular && (
                    <Badge className="absolute -top-2 -right-2 text-xs">Popular</Badge>
                  )}
                  {deviceConnections.includes(device.name) && (
                    <CheckCircle className="h-4 w-4 absolute top-2 right-2" />
                  )}
                  <Activity className="h-5 w-5" />
                  <span className="text-xs">{device.name}</span>
                </Button>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Don't worry - you can connect these later from your settings
            </p>
          </div>
        );

      case 'set_goals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg mb-2">What Are Your Health Goals?</h3>
              <p className="text-muted-foreground text-sm">
                We'll tailor your insights and recommendations to help you achieve these goals
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                'Lose Weight', 'Gain Muscle', 'Better Sleep', 
                'More Energy', 'Reduce Stress', 'Improve Cardio',
                'Track Nutrition', 'Mental Wellness'
              ].map((goal) => (
                <Badge
                  key={goal}
                  variant={healthGoals.includes(goal) ? "default" : "outline"}
                  className="cursor-pointer p-2 justify-center"
                  onClick={() => handleGoalSelection(goal)}
                >
                  {healthGoals.includes(goal) && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="text-center space-y-6">
            <Bell className="h-12 w-12 text-yellow-600 mx-auto" />
            <div>
              <h3 className="text-lg mb-2">Stay on Track with Notifications</h3>
              <p className="text-muted-foreground text-sm">
                Get helpful reminders and celebrate your progress
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Bell className="h-4 w-4 text-blue-600" />
                <span>Daily activity reminders</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Weekly progress reports</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Target className="h-4 w-4 text-purple-600" />
                <span>Goal achievement celebrations</span>
              </div>
            </div>

            <Button 
              onClick={handleNotificationRequest}
              className="w-full"
            >
              Enable Notifications
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleStepComplete(currentStepData.id)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        );

      case 'first_insight':
        return (
          <div className="text-center space-y-6">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto" />
            <div>
              <h3 className="text-lg mb-2">Your Health Insights Await</h3>
              <p className="text-muted-foreground text-sm">
                Based on your goals and connected devices, we'll start generating personalized insights
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="text-sm mb-1">Example Insight</h4>
                <p className="text-xs text-muted-foreground">
                  "Your sleep quality improves by 23% on days you walk more than 8,000 steps"
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-lg text-blue-600">12</div>
                  <div className="text-muted-foreground">Insights Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-lg text-green-600">{healthGoals.length}</div>
                  <div className="text-muted-foreground">Goals Set</div>
                </div>
                <div className="text-center">
                  <div className="text-lg text-purple-600">{deviceConnections.length}</div>
                  <div className="text-muted-foreground">Sources Connected</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-blue-600">HealthSync Pro</span>
          </div>
          
          <Progress value={progressPercentage} className="w-full mb-2" />
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>
          
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          {currentStepData.id !== 'notifications' && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleStepComplete(currentStepData.id)}
              >
                Skip
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleStepComplete(currentStepData.id)}
              >
                {currentStep === onboardingSteps.length - 1 ? 'Complete Setup' : currentStepData.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};