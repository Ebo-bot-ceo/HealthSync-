import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { Settings, User, Bell, Shield, Palette, Database, Smartphone, Link, Globe, Lock, Eye, Moon, Sun, Monitor } from "lucide-react";
import { makeServerRequest } from '../utils/supabase/client';
import { useAuth } from '../hooks/useAuth';

interface SettingsPanelProps {
  onLogActivity: (type: string, data: any) => void;
}

export function SettingsPanel({ onLogActivity }: SettingsPanelProps) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<any>({
    notifications: {
      daily_reminders: true,
      weekly_reports: true,
      goal_achievements: true,
      insights: true,
      email_notifications: false,
      push_notifications: true
    },
    privacy: {
      data_sharing: false,
      analytics: true,
      marketing: false,
      health_insights: true
    },
    display: {
      theme: 'system',
      units: 'metric',
      timezone: 'auto',
      language: 'en-US'
    },
    goals: {
      daily_steps: 10000,
      sleep_hours: 8,
      water_liters: 2.5,
      active_minutes: 30
    },
    integrations: {
      apple_health: false,
      google_fit: false,
      fitbit: false,
      garmin: false,
      strava: false
    }
  });

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    healthConditions: '',
    medications: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
    loadProfile();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await makeServerRequest('/preferences');
      if (response) {
        setPreferences(response);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await makeServerRequest('/profile');
      if (response) {
        setProfile({
          fullName: response.fullName || '',
          email: response.email || '',
          age: response.basicInfo?.age || '',
          height: response.basicInfo?.height || '',
          weight: response.basicInfo?.weight || '',
          activityLevel: response.basicInfo?.activityLevel || 'moderate',
          healthConditions: response.basicInfo?.healthConditions || '',
          medications: response.basicInfo?.medications || ''
        });
      }
    } catch (error) {
      console.warn('Failed to load profile:', error);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      await makeServerRequest('/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
      });
      
      onLogActivity('preferences_updated', { 
        sections: Object.keys(preferences),
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await makeServerRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: profile.fullName,
          basicInfo: {
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            activityLevel: profile.activityLevel,
            healthConditions: profile.healthConditions,
            medications: profile.medications
          }
        })
      });
      
      onLogActivity('profile_updated', { 
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (section: string, key: string, value: any) => {
    setPreferences((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateProfile = (key: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const connectIntegration = async (service: string) => {
    onLogActivity('integration_connect_attempt', { service });
    // In a real implementation, this would redirect to OAuth flow
    alert(`Connect to ${service} - OAuth flow would be initiated here`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your HealthSync Pro preferences and integrations</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile information for personalized insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => updateProfile('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateProfile('age', e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => updateProfile('height', e.target.value)}
                    placeholder="175"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => updateProfile('weight', e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select value={profile.activityLevel} onValueChange={(value) => updateProfile('activityLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (physical job + exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthConditions">Health Conditions</Label>
                <Textarea
                  id="healthConditions"
                  value={profile.healthConditions}
                  onChange={(e) => updateProfile('healthConditions', e.target.value)}
                  placeholder="List any relevant health conditions (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={profile.medications}
                  onChange={(e) => updateProfile('medications', e.target.value)}
                  placeholder="List current medications (optional)"
                  rows={3}
                />
              </div>

              <Button onClick={saveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Health Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders for daily health goals</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.daily_reminders}
                      onCheckedChange={(checked) => updatePreference('notifications', 'daily_reminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Weekly health summary reports</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.weekly_reports}
                      onCheckedChange={(checked) => updatePreference('notifications', 'weekly_reports', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Goal Achievements</Label>
                      <p className="text-sm text-muted-foreground">Notifications when you reach goals</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.goal_achievements}
                      onCheckedChange={(checked) => updatePreference('notifications', 'goal_achievements', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>AI Insights</Label>
                      <p className="text-sm text-muted-foreground">New insights and recommendations</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.insights}
                      onCheckedChange={(checked) => updatePreference('notifications', 'insights', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email_notifications}
                      onCheckedChange={(checked) => updatePreference('notifications', 'email_notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push_notifications}
                      onCheckedChange={(checked) => updatePreference('notifications', 'push_notifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={savePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Data Control
              </CardTitle>
              <CardDescription>Control how your data is used and shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Sharing with Partners</Label>
                    <p className="text-sm text-muted-foreground">Share anonymized data for research</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.data_sharing}
                    onCheckedChange={(checked) => updatePreference('privacy', 'data_sharing', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.analytics}
                    onCheckedChange={(checked) => updatePreference('privacy', 'analytics', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive product updates and promotions</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.marketing}
                    onCheckedChange={(checked) => updatePreference('privacy', 'marketing', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Health Insights Processing</Label>
                    <p className="text-sm text-muted-foreground">Use AI to analyze your health patterns</p>
                  </div>
                  <Switch
                    checked={preferences.privacy.health_insights}
                    onCheckedChange={(checked) => updatePreference('privacy', 'health_insights', checked)}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Data Security</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  All your health data is encrypted end-to-end and stored securely. We comply with HIPAA and GDPR regulations.
                </p>
              </div>

              <Button onClick={savePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize the appearance and units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={preferences.display.theme} 
                    onValueChange={(value) => updatePreference('display', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Units</Label>
                  <Select 
                    value={preferences.display.units} 
                    onValueChange={(value) => updatePreference('display', 'units', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (kg, cm, km)</SelectItem>
                      <SelectItem value="imperial">Imperial (lbs, ft, miles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={preferences.display.language} 
                    onValueChange={(value) => updatePreference('display', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                      <SelectItem value="de-DE">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select 
                    value={preferences.display.timezone} 
                    onValueChange={(value) => updatePreference('display', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={savePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Display Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Health Goals</CardTitle>
              <CardDescription>Set your default daily targets for health metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Daily Steps Goal: {preferences.goals.daily_steps.toLocaleString()}</Label>
                  <Slider
                    value={[preferences.goals.daily_steps]}
                    onValueChange={(value) => updatePreference('goals', 'daily_steps', value[0])}
                    max={20000}
                    min={5000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5,000</span>
                    <span>20,000</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Sleep Hours Goal: {preferences.goals.sleep_hours}h</Label>
                  <Slider
                    value={[preferences.goals.sleep_hours]}
                    onValueChange={(value) => updatePreference('goals', 'sleep_hours', value[0])}
                    max={12}
                    min={6}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>6h</span>
                    <span>12h</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Water Intake Goal: {preferences.goals.water_liters}L</Label>
                  <Slider
                    value={[preferences.goals.water_liters]}
                    onValueChange={(value) => updatePreference('goals', 'water_liters', value[0])}
                    max={5}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1L</span>
                    <span>5L</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Active Minutes Goal: {preferences.goals.active_minutes} min</Label>
                  <Slider
                    value={[preferences.goals.active_minutes]}
                    onValueChange={(value) => updatePreference('goals', 'active_minutes', value[0])}
                    max={120}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15 min</span>
                    <span>120 min</span>
                  </div>
                </div>
              </div>

              <Button onClick={savePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Goal Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Platform Integrations</CardTitle>
              <CardDescription>Connect your existing health apps and devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'apple_health', name: 'Apple Health', icon: '🍎', description: 'Sync data from iPhone Health app' },
                { id: 'google_fit', name: 'Google Fit', icon: '💚', description: 'Connect Google Fit activities' },
                { id: 'fitbit', name: 'Fitbit', icon: '⌚', description: 'Import Fitbit device data' },
                { id: 'garmin', name: 'Garmin Connect', icon: '🏃', description: 'Sync Garmin training data' },
                { id: 'strava', name: 'Strava', icon: '🚴', description: 'Import workout activities' }
              ].map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {preferences.integrations[integration.id] ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                    ) : (
                      <Badge variant="outline">Not Connected</Badge>
                    )}
                    <Button
                      variant={preferences.integrations[integration.id] ? "outline" : "default"}
                      size="sm"
                      onClick={() => connectIntegration(integration.name)}
                    >
                      {preferences.integrations[integration.id] ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}