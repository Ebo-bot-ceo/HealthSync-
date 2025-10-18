import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, CalendarDays, Download, Settings, TrendingUp, TrendingDown, Heart, Activity, Moon, Footprints, Target, Brain, Droplets, Thermometer, Menu, X, BarChart3, Zap, Trophy, FileDown } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { makeServerRequest, checkServerHealth } from '../utils/supabase/client';
import { HealthSidebar } from './HealthSidebar';
import { MobileInsights } from './MobileInsights';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { EnhancedInsights } from './EnhancedInsights';
import { HealthGoalsManager } from './HealthGoalsManager';
import { DataExportManager } from './DataExportManager';
import { SettingsPanel } from './SettingsPanel';

// Icon mapping for metrics
const iconMap = {
  "Steps": Footprints,
  "Heart Rate": Heart,
  "Sleep": Moon,
  "Calories": Activity,
  "Hydration": Droplets,
  "Stress": Brain
};

// Icon mapping for insights
const insightIconMap = {
  "achievement": Target,
  "recommendation": Moon,
  "pattern": TrendingUp,
  "alert": Droplets
};

export function HealthDashboard() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("7days");
  const [healthData, setHealthData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);

  // Fetch health data from Supabase
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        
        // Load demo data first for immediate display
        const demoData = {
          stepData: [
            { date: '2024-01-01', steps: 8432, goal: 10000 },
            { date: '2024-01-02', steps: 12456, goal: 10000 },
            { date: '2024-01-03', steps: 9876, goal: 10000 },
            { date: '2024-01-04', steps: 11234, goal: 10000 },
            { date: '2024-01-05', steps: 7654, goal: 10000 },
            { date: '2024-01-06', steps: 13456, goal: 10000 },
            { date: '2024-01-07', steps: 10987, goal: 10000 }
          ],
          heartRateData: [
            { time: '00:00', resting: 62, active: 85, max: 145 },
            { time: '04:00', resting: 58, active: 82, max: 142 },
            { time: '08:00', resting: 65, active: 95, max: 168 },
            { time: '12:00', resting: 68, active: 110, max: 175 },
            { time: '16:00', resting: 70, active: 105, max: 172 },
            { time: '20:00', resting: 64, active: 88, max: 155 },
            { time: '24:00', resting: 60, active: 80, max: 148 }
          ],
          sleepData: [
            { date: 'Mon', deep: 2.1, light: 4.2, rem: 1.8, awake: 0.3 },
            { date: 'Tue', deep: 1.9, light: 4.5, rem: 2.1, awake: 0.2 },
            { date: 'Wed', deep: 2.3, light: 3.8, rem: 1.9, awake: 0.4 },
            { date: 'Thu', deep: 2.0, light: 4.1, rem: 2.0, awake: 0.3 },
            { date: 'Fri', deep: 1.8, light: 4.3, rem: 1.7, awake: 0.5 },
            { date: 'Sat', deep: 2.4, light: 4.0, rem: 2.2, awake: 0.2 },
            { date: 'Sun', deep: 2.2, light: 4.4, rem: 2.0, awake: 0.3 }
          ],
          activityDistribution: [
            { name: 'Cardio', value: 35, color: '#8884d8' },
            { name: 'Strength', value: 25, color: '#82ca9d' },
            { name: 'Flexibility', value: 20, color: '#ffc658' },
            { name: 'Recovery', value: 20, color: '#ff7300' }
          ],
          healthMetrics: [
            { title: "Steps", value: "10,987", target: "10,000", progress: 109, trend: "up", change: "+12%" },
            { title: "Heart Rate", value: "68 bpm", target: "60-100", progress: 68, trend: "stable", change: "+2%" },
            { title: "Sleep", value: "7h 32m", target: "8h", progress: 94, trend: "up", change: "+15%" },
            { title: "Calories", value: "2,240", target: "2,200", progress: 102, trend: "up", change: "+5%" },
            { title: "Hydration", value: "2.1L", target: "2.5L", progress: 84, trend: "down", change: "-8%" },
            { title: "Stress", value: "Low", target: "Optimal", progress: 25, trend: "down", change: "-20%" }
          ]
        };
        
        const demoInsights = [
          { type: "achievement", title: "Weekly Step Goal Achieved!", description: "You've walked 72,645 steps this week, exceeding your goal by 12%. Keep up the great work!", priority: "high" },
          { type: "recommendation", title: "Optimize Your Sleep Schedule", description: "Your data shows you sleep best when going to bed before 10:30 PM. Try adjusting your bedtime for better recovery.", priority: "medium" },
          { type: "pattern", title: "Workout Performance Peak", description: "Your heart rate data indicates peak performance between 10-11 AM. Consider scheduling intense workouts during this window.", priority: "medium" },
          { type: "alert", title: "Hydration Below Target", description: "You're 16% below your hydration goal this week. Increase water intake to optimize recovery and performance.", priority: "low" }
        ];

        // Set demo data immediately for fast loading
        setHealthData(demoData);
        setInsights(demoInsights);
        setUsingDemoData(true);
        setLoading(false);
        
        // Try to fetch real data in the background with better error handling
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Background fetch timeout')), 8000)
          );
          
          const [metricsResponse, insightsResponse] = await Promise.race([
            Promise.all([
              makeServerRequest(`/health-metrics?dateRange=${dateRange}`).catch(error => {
                console.warn('Failed to fetch health metrics, using demo data:', error.message);
                return null;
              }),
              makeServerRequest('/insights').catch(error => {
                console.warn('Failed to fetch insights, using demo data:', error.message);
                return null;
              })
            ]),
            timeoutPromise
          ]);
          
          // Update with real data if available, otherwise keep demo data
          if (metricsResponse) {
            setHealthData(metricsResponse);
            setUsingDemoData(false);
          }
          if (insightsResponse) {
            setInsights(insightsResponse);
          }
          
          // Only mark as not using demo data if we got at least one successful response
          if (metricsResponse || insightsResponse) {
            console.log('Successfully loaded some real data from server');
          }
        } catch (error) {
          console.warn('Background data fetch failed, continuing with demo data:', error.message);
          // Keep demo data on error - no need to update state
        }
      } catch (error) {
        console.error('Error setting up health data:', error);
        // Set loading to false even if demo data setup fails
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [dateRange]);

  const logActivity = async (type: string, data: any) => {
    try {
      // Add timeout for activity logging - make it non-blocking
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Activity logging timeout')), 3000)
      );
      
      await Promise.race([
        makeServerRequest('/log-activity', {
          method: 'POST',
          body: JSON.stringify({ type, data })
        }),
        timeoutPromise
      ]);
      
      console.log(`Successfully logged ${type} activity:`, data);
    } catch (error) {
      // Silently handle logging failures - this is non-critical functionality
      console.warn(`Activity logging failed for ${type}:`, error.message);
      
      // Store activity locally as fallback (could implement later)
      try {
        const localActivities = JSON.parse(localStorage.getItem('healthsync_pending_activities') || '[]');
        localActivities.push({
          type,
          data,
          timestamp: new Date().toISOString(),
          pending: true
        });
        
        // Keep only last 50 pending activities
        if (localActivities.length > 50) {
          localActivities.splice(0, localActivities.length - 50);
        }
        
        localStorage.setItem('healthsync_pending_activities', JSON.stringify(localActivities));
        console.log(`Stored ${type} activity locally for later sync`);
      } catch (storageError) {
        console.warn('Failed to store activity locally:', storageError.message);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "low": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-green-600 dark:text-green-400";
    if (progress >= 80) return "text-blue-600 dark:text-blue-400";
    if (progress >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <div className="absolute inset-0 w-8 h-8 animate-pulse mx-auto mb-4 text-primary/30">
              <Activity className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-base">Loading your health data...</p>
            <p className="text-sm text-muted-foreground">This should only take a moment</p>
          </div>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 bg-card border-r border-border p-6 overflow-y-auto">
        <HealthSidebar 
          healthMetrics={healthData?.healthMetrics || []}
          onLogActivity={logActivity}
          getProgressColor={getProgressColor}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-6">
          <HealthSidebar 
            healthMetrics={healthData?.healthMetrics || []}
            onLogActivity={logActivity}
            getProgressColor={getProgressColor}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-4">
                <h2 className="text-lg lg:text-xl">HealthSync Pro</h2>
                <Badge variant={usingDemoData ? "outline" : "secondary"} className="hidden sm:inline-flex">
                  {usingDemoData ? "Demo Data" : "Live Data"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-24 sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <CalendarDays className="w-4 h-4" />
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Manage your HealthSync Pro preferences, integrations, and privacy settings.
                    </DialogDescription>
                  </DialogHeader>
                  <SettingsPanel onLogActivity={logActivity} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Main Content Area with Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
            <div className="border-b border-border px-4 lg:px-6">
              <TabsList className="h-12">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Goals
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Export
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2 xl:hidden">
                  <Brain className="w-4 h-4" />
                  Insights
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="flex-1 p-4 lg:p-6 overflow-y-auto mt-0">
              <div className="space-y-4 lg:space-y-6">
                {/* Mobile Insights Button - Only visible on mobile/tablet */}
                <div className="xl:hidden mb-4">
                  <MobileInsights 
                    insights={insights}
                    getPriorityColor={getPriorityColor}
                    onLogActivity={logActivity}
                  />
                </div>
                
                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            {/* Steps Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Footprints className="w-4 h-4 lg:w-5 lg:h-5" />
                  Daily Steps
                </CardTitle>
                <CardDescription className="text-sm">Track your daily movement progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={healthData?.stepData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name === 'steps' ? 'Steps' : 'Goal']} />
                    <Area type="monotone" dataKey="steps" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Line type="monotone" dataKey="goal" stroke="#ff7300" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Heart Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                  Heart Rate Zones
                </CardTitle>
                <CardDescription className="text-sm">Monitor your cardiovascular health</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={healthData?.heartRateData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="resting" stroke="#82ca9d" strokeWidth={2} name="Resting" />
                    <Line type="monotone" dataKey="active" stroke="#8884d8" strokeWidth={2} name="Active" />
                    <Line type="monotone" dataKey="max" stroke="#ff7300" strokeWidth={2} name="Max" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sleep Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
                  Sleep Analysis
                </CardTitle>
                <CardDescription className="text-sm">Quality and duration of sleep phases</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={healthData?.sleepData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => [`${value}h`, '']} />
                    <Bar dataKey="deep" stackId="a" fill="#1e3a8a" name="Deep" />
                    <Bar dataKey="light" stackId="a" fill="#3b82f6" name="Light" />
                    <Bar dataKey="rem" stackId="a" fill="#60a5fa" name="REM" />
                    <Bar dataKey="awake" stackId="a" fill="#fbbf24" name="Awake" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
                  Activity Distribution
                </CardTitle>
                <CardDescription className="text-sm">Breakdown of your weekly activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={healthData?.activityDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(healthData?.activityDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {(healthData?.activityDistribution || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs lg:text-sm">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 p-4 lg:p-6 overflow-y-auto mt-0">
              <AdvancedAnalytics 
                healthData={healthData}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </TabsContent>

            <TabsContent value="goals" className="flex-1 p-4 lg:p-6 overflow-y-auto mt-0">
              <HealthGoalsManager 
                onLogActivity={logActivity}
              />
            </TabsContent>

            <TabsContent value="export" className="flex-1 p-4 lg:p-6 overflow-y-auto mt-0">
              <DataExportManager 
                onLogActivity={logActivity}
              />
            </TabsContent>

            <TabsContent value="insights" className="flex-1 p-4 lg:p-6 overflow-y-auto mt-0 xl:hidden">
              <EnhancedInsights 
                healthData={healthData}
                insights={insights}
                onLogActivity={logActivity}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Insights Panel - Hidden on mobile/tablet, shown on desktop */}
      <div className="hidden xl:flex w-96 bg-card border-l border-border overflow-y-auto">
        <div className="w-full p-6">
          <EnhancedInsights 
            healthData={healthData}
            insights={insights}
            onLogActivity={logActivity}
          />
        </div>
      </div>


    </div>
  );
}