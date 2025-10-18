import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle, Activity, Apple, Facebook } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SocialAuthButtons } from './SocialAuthButtons';
import { toast } from 'sonner@2.0.3';

interface AuthSignupProps {
  onSuccess?: () => void;
  onBackToLanding: () => void;
  onSwitchToSignin: () => void;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  healthGoals: string[];
  basicInfo: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: string;
  };
  agreedToTerms: boolean;
  wantsUpdates: boolean;
}

const healthGoalOptions = [
  'Weight Management',
  'Better Sleep',
  'Fitness Improvement',
  'Stress Reduction',
  'General Wellness',
  'Specific Condition'
];

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export const AuthSignup = ({ onSuccess, onBackToLanding, onSwitchToSignin }: AuthSignupProps) => {
  const { signUp, signInWithProvider, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    fullName: '',
    healthGoals: [],
    basicInfo: {},
    agreedToTerms: false,
    wantsUpdates: false
  });

  const progressPercentage = (currentStep / 3) * 100;

  const handleSocialSignup = async (provider: 'google' | 'apple' | 'facebook') => {
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
        toast.error(`Failed to sign up with ${provider}: ${error.message}`);
      }
    } else {
      toast.success(`Signing up with ${provider}...`);
      onSuccess?.();
    }
  };

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.agreedToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setCurrentStep(2);
  };

  const handleStepTwo = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { user, error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      healthGoals: formData.healthGoals,
      basicInfo: formData.basicInfo
    });

    if (error) {
      setError(error.message);
      toast.error('Signup failed: ' + error.message);
    } else if (user) {
      toast.success('Account created successfully! Welcome to HealthSync Pro.');
      onSuccess?.();
    }
  };

  const toggleHealthGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  // Step 1: Basic Information
  if (currentStep === 1) {
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
            <CardTitle>Create Your Health Profile</CardTitle>
            <CardDescription>
              Join 50,000+ users transforming their health journey
            </CardDescription>
            <Progress value={progressPercentage} className="w-full mt-4" />
            <p className="text-xs text-muted-foreground mt-1">Step 1 of 3 • Basic Info</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Social Signup Options */}
            <SocialAuthButtons onSocialAuth={handleSocialSignup} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or use email
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleStepOne} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8+ characters, include numbers"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, agreedToTerms: !!checked }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updates"
                    checked={formData.wantsUpdates}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, wantsUpdates: !!checked }))
                    }
                  />
                  <Label htmlFor="updates" className="text-sm">
                    Send me health tips and updates (optional)
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                Continue to Health Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" onClick={onSwitchToSignin} className="p-0">
                Sign In
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Health Profile
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(1)}
              className="self-start p-2 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Help Us Understand Your Health Goals</CardTitle>
            <CardDescription>
              Optional - You can skip and complete later
            </CardDescription>
            <Progress value={progressPercentage} className="w-full mt-4" />
            <p className="text-xs text-muted-foreground mt-1">Step 2 of 3 • Health Profile</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleStepTwo} className="space-y-6">
              <div className="space-y-3">
                <Label>What are your primary health goals?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthGoalOptions.map((goal) => (
                    <Badge
                      key={goal}
                      variant={formData.healthGoals.includes(goal) ? "default" : "outline"}
                      className="cursor-pointer p-2 justify-center"
                      onClick={() => toggleHealthGoal(goal)}
                    >
                      {formData.healthGoals.includes(goal) && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Basic Information (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="age" className="text-sm">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.basicInfo.age || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, age: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gender" className="text-sm">Gender</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.basicInfo.gender || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, gender: e.target.value }
                      }))}
                    >
                      <option value="">Select</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="height" className="text-sm">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.basicInfo.height || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, height: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="weight" className="text-sm">Weight (kg)</Label>
                    <Input
                      id="weight"
                      placeholder="70"
                      value={formData.basicInfo.weight || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, weight: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCurrentStep(3)}
                >
                  Skip for Now
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                >
                  Save and Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Data Connections
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(2)}
            className="self-start p-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Connect Your Health Devices & Apps</CardTitle>
          <CardDescription>
            Connect for better insights and personalized recommendations
          </CardDescription>
          <Progress value={progressPercentage} className="w-full mt-4" />
          <p className="text-xs text-muted-foreground mt-1">Step 3 of 3 • Data Sources</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label>Connect for better insights:</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Apple Health', icon: Apple, color: 'text-gray-900' },
                { name: 'Google Fit', icon: Activity, color: 'text-green-600' },
                { name: 'Fitbit', icon: Activity, color: 'text-blue-600' },
                { name: 'Strava', icon: Activity, color: 'text-orange-600' },
                { name: 'Garmin', icon: Activity, color: 'text-blue-800' },
                { name: 'Withings', icon: Activity, color: 'text-gray-700' }
              ].map((device) => (
                <Button
                  key={device.name}
                  variant="outline"
                  className="h-16 flex-col gap-1"
                  onClick={() => toast.info(`${device.name} integration coming soon!`)}
                >
                  <device.icon className={`h-5 w-5 ${device.color}`} />
                  <span className="text-xs">{device.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Don't worry - you can connect these devices later from your dashboard
            </p>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={handleFinalSignup}
                disabled={loading}
              >
                Connect Later
              </Button>
              <Button 
                onClick={handleFinalSignup}
                className="flex-1"
                disabled={loading}
              >
                Complete Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              End-to-end encryption
              <CheckCircle className="h-3 w-3 text-green-500" />
              HIPAA compliant
            </div>
            <p className="text-xs text-muted-foreground">
              We never share your health data with third parties
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};