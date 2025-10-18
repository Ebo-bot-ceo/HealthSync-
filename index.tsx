import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to get authenticated user
const getAuthenticatedUser = async (request: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    return { userId: 'demo_user', user: null }; // Use demo user for anonymous access
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { userId: 'demo_user', user: null };
  }
  
  return { userId: user.id, user };
};

// Helper function to require authentication
const requireAuth = async (request: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    return { error: 'Authentication required', status: 401 };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Invalid authentication token', status: 401 };
  }
  
  return { userId: user.id, user };
};

// Health check endpoint
app.get("/make-server-4c32bbd6/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-4c32bbd6/signup", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const body = await c.req.json();
    const { email, password, fullName, healthGoals, basicInfo } = body;
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Create user with admin API to auto-confirm email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name: fullName,
        health_goals: healthGoals || [],
        basic_info: basicInfo || {},
        signup_completed: true
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('User created successfully:', data.user?.email);
    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-4c32bbd6/profile", async (c) => {
  try {
    const authResult = await requireAuth(c.req.raw);
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }
    
    const { user } = authResult;
    
    // Return user profile data
    return c.json({
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name,
      healthGoals: user.user_metadata?.health_goals || [],
      basicInfo: user.user_metadata?.basic_info || {},
      onboardingCompleted: user.user_metadata?.onboarding_completed || false,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Update user profile endpoint
app.put("/make-server-4c32bbd6/profile", async (c) => {
  try {
    const authResult = await requireAuth(c.req.raw);
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { userId } = authResult;
    const body = await c.req.json();
    const { fullName, healthGoals, basicInfo, onboardingCompleted } = body;
    
    // Update user metadata
    const updateData: any = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (healthGoals !== undefined) updateData.health_goals = healthGoals;
    if (basicInfo !== undefined) updateData.basic_info = basicInfo;
    if (onboardingCompleted !== undefined) updateData.onboarding_completed = onboardingCompleted;
    
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: updateData
    });
    
    if (error) {
      console.error('Profile update error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('User profile updated successfully:', userId);
    return c.json({ 
      success: true, 
      user: data.user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

// Get user preferences endpoint
app.get("/make-server-4c32bbd6/preferences", async (c) => {
  try {
    const authResult = await requireAuth(c.req.raw);
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }
    
    const { userId } = authResult;
    const preferencesKey = `user_preferences_${userId}`;
    
    let preferences = await kv.get(preferencesKey);
    
    if (!preferences) {
      preferences = {
        notifications: {
          daily_reminders: true,
          weekly_reports: true,
          goal_achievements: true,
          insights: true
        },
        privacy: {
          data_sharing: false,
          analytics: true,
          marketing: false
        },
        display: {
          theme: 'system',
          units: 'metric',
          timezone: 'auto'
        },
        goals: {
          daily_steps: 10000,
          sleep_hours: 8,
          water_liters: 2.5,
          active_minutes: 30
        }
      };
      
      await kv.set(preferencesKey, preferences);
    }
    
    return c.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return c.json({ error: 'Failed to fetch user preferences' }, 500);
  }
});

// Update user preferences endpoint
app.put("/make-server-4c32bbd6/preferences", async (c) => {
  try {
    const authResult = await requireAuth(c.req.raw);
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }
    
    const { userId } = authResult;
    const body = await c.req.json();
    const preferencesKey = `user_preferences_${userId}`;
    
    // Get existing preferences
    let existingPreferences = await kv.get(preferencesKey) || {};
    
    // Merge with new preferences
    const updatedPreferences = {
      ...existingPreferences,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(preferencesKey, updatedPreferences);
    
    return c.json({ 
      success: true, 
      preferences: updatedPreferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return c.json({ error: 'Failed to update user preferences' }, 500);
  }
});

// Get health metrics for a user
app.get("/make-server-4c32bbd6/health-metrics", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const dateRange = c.req.query('dateRange') || '7days';
    
    const metricsKey = `health_metrics_${userId}_${dateRange}`;
    let metrics = await kv.get(metricsKey);
    
    if (!metrics) {
      // Initialize with demo data if no metrics exist
      metrics = {
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
        ],
        lastUpdated: new Date().toISOString()
      };
      
      await kv.set(metricsKey, metrics);
    }
    
    return c.json(metrics);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return c.json({ error: 'Failed to fetch health metrics' }, 500);
  }
});

// Update health metrics
app.post("/make-server-4c32bbd6/health-metrics", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const body = await c.req.json();
    const { dateRange = '7days', metrics } = body;
    
    const metricsKey = `health_metrics_${userId}_${dateRange}`;
    const updatedMetrics = {
      ...metrics,
      lastUpdated: new Date().toISOString()
    };
    
    await kv.set(metricsKey, updatedMetrics);
    
    return c.json({ success: true, metrics: updatedMetrics });
  } catch (error) {
    console.error('Error updating health metrics:', error);
    return c.json({ error: 'Failed to update health metrics' }, 500);
  }
});

// Get AI insights
app.get("/make-server-4c32bbd6/insights", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const insightsKey = `insights_${userId}`;
    
    let insights = await kv.get(insightsKey);
    
    if (!insights) {
      insights = [
        {
          type: "achievement",
          title: "Weekly Step Goal Achieved!",
          description: "You've walked 72,645 steps this week, exceeding your goal by 12%. Keep up the great work!",
          priority: "high"
        },
        {
          type: "recommendation",
          title: "Optimize Your Sleep Schedule",
          description: "Your data shows you sleep best when going to bed before 10:30 PM. Try adjusting your bedtime for better recovery.",
          priority: "medium"
        },
        {
          type: "pattern",
          title: "Workout Performance Peak",
          description: "Your heart rate data indicates peak performance between 10-11 AM. Consider scheduling intense workouts during this window.",
          priority: "medium"
        },
        {
          type: "alert",
          title: "Hydration Below Target",
          description: "You're 16% below your hydration goal this week. Increase water intake to optimize recovery and performance.",
          priority: "low"
        }
      ];
      
      await kv.set(insightsKey, insights);
    }
    
    return c.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
});

// Log health activity
app.post("/make-server-4c32bbd6/log-activity", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const body = await c.req.json();
    const { type, data } = body;
    
    const activityKey = `activity_${userId}_${Date.now()}`;
    const activity = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userId
    };
    
    await kv.set(activityKey, activity);
    
    return c.json({ success: true, activity });
  } catch (error) {
    console.error('Error logging activity:', error);
    return c.json({ error: 'Failed to log activity' }, 500);
  }
});

// Health Goals endpoints
app.get("/make-server-4c32bbd6/health-goals", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const goalsKey = `health_goals_${userId}`;
    
    let goals = await kv.get(goalsKey);
    
    if (!goals) {
      goals = [];
      await kv.set(goalsKey, goals);
    }
    
    return c.json(goals);
  } catch (error) {
    console.error('Error fetching health goals:', error);
    return c.json({ error: 'Failed to fetch health goals' }, 500);
  }
});

app.post("/make-server-4c32bbd6/health-goals", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const body = await c.req.json();
    const goalsKey = `health_goals_${userId}`;
    
    let goals = await kv.get(goalsKey) || [];
    
    // Add or update goal
    const existingIndex = goals.findIndex((g: any) => g.id === body.id);
    if (existingIndex >= 0) {
      goals[existingIndex] = { ...goals[existingIndex], ...body, updatedAt: new Date().toISOString() };
    } else {
      goals.push({ ...body, createdAt: new Date().toISOString() });
    }
    
    await kv.set(goalsKey, goals);
    
    return c.json({ success: true, goals });
  } catch (error) {
    console.error('Error saving health goal:', error);
    return c.json({ error: 'Failed to save health goal' }, 500);
  }
});

app.put("/make-server-4c32bbd6/health-goals/:goalId/progress", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const goalId = c.req.param('goalId');
    const body = await c.req.json();
    const { currentValue } = body;
    const goalsKey = `health_goals_${userId}`;
    
    let goals = await kv.get(goalsKey) || [];
    
    const goalIndex = goals.findIndex((g: any) => g.id === goalId);
    if (goalIndex >= 0) {
      goals[goalIndex].currentValue = currentValue;
      goals[goalIndex].updatedAt = new Date().toISOString();
      
      // Check if goal is completed
      if (currentValue >= goals[goalIndex].targetValue && goals[goalIndex].status !== 'completed') {
        goals[goalIndex].status = 'completed';
        goals[goalIndex].completedAt = new Date().toISOString();
      }
      
      await kv.set(goalsKey, goals);
      return c.json({ success: true, goal: goals[goalIndex] });
    } else {
      return c.json({ error: 'Goal not found' }, 404);
    }
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return c.json({ error: 'Failed to update goal progress' }, 500);
  }
});

app.delete("/make-server-4c32bbd6/health-goals/:goalId", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const goalId = c.req.param('goalId');
    const goalsKey = `health_goals_${userId}`;
    
    let goals = await kv.get(goalsKey) || [];
    goals = goals.filter((g: any) => g.id !== goalId);
    
    await kv.set(goalsKey, goals);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting health goal:', error);
    return c.json({ error: 'Failed to delete health goal' }, 500);
  }
});

// Analytics endpoints
app.get("/make-server-4c32bbd6/analytics/correlations", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    
    // Generate correlation analysis data
    const correlations = [
      { metric1: "Sleep", metric2: "Heart Rate Recovery", correlation: 0.78, strength: "Strong" },
      { metric1: "Steps", metric2: "Mood Score", correlation: 0.65, strength: "Moderate" },
      { metric1: "Hydration", metric2: "Cognitive Performance", correlation: 0.72, strength: "Strong" },
      { metric1: "Stress", metric2: "Sleep Quality", correlation: -0.68, strength: "Strong" },
      { metric1: "Exercise", metric2: "Recovery Time", correlation: 0.54, strength: "Moderate" }
    ];
    
    return c.json(correlations);
  } catch (error) {
    console.error('Error fetching correlations:', error);
    return c.json({ error: 'Failed to fetch correlations' }, 500);
  }
});

app.get("/make-server-4c32bbd6/analytics/predictions", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const metric = c.req.query('metric') || 'steps';
    const days = parseInt(c.req.query('days') || '7');
    
    // Generate predictive analytics
    const predictions = [];
    const baseValue = 10000; // Base steps value
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simple prediction with some variance
      const predicted = Math.round(baseValue + (Math.random() - 0.5) * 2000);
      const confidence = Math.round(75 + Math.random() * 20);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        predicted,
        confidence,
        metric
      });
    }
    
    return c.json(predictions);
  } catch (error) {
    console.error('Error generating predictions:', error);
    return c.json({ error: 'Failed to generate predictions' }, 500);
  }
});

app.get("/make-server-4c32bbd6/analytics/health-score", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    
    // Calculate health score based on various metrics
    const metricsKey = `health_metrics_${userId}_7days`;
    const metrics = await kv.get(metricsKey);
    
    let healthScore = 75; // Default score
    
    if (metrics && metrics.healthMetrics) {
      const weights = {
        "Steps": 0.15,
        "Heart Rate": 0.20,
        "Sleep": 0.25,
        "Calories": 0.10,
        "Hydration": 0.15,
        "Stress": 0.15
      };

      let weightedSum = 0;
      let totalWeight = 0;

      metrics.healthMetrics.forEach((metric: any) => {
        const weight = weights[metric.title as keyof typeof weights] || 0;
        weightedSum += metric.progress * weight;
        totalWeight += weight;
      });

      healthScore = Math.round(weightedSum / totalWeight);
    }
    
    return c.json({
      score: healthScore,
      components: {
        cardiovascular: Math.round(healthScore * 0.9 + Math.random() * 10),
        sleep: Math.round(healthScore * 1.1 - Math.random() * 10),
        activity: Math.round(healthScore * 0.95 + Math.random() * 15),
        nutrition: Math.round(healthScore * 0.85 + Math.random() * 20),
        stress: Math.round(healthScore * 1.05 - Math.random() * 15)
      },
      trend: healthScore > 80 ? "improving" : healthScore > 60 ? "stable" : "declining",
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error calculating health score:', error);
    return c.json({ error: 'Failed to calculate health score' }, 500);
  }
});

// Enhanced insights endpoint
app.get("/make-server-4c32bbd6/insights/enhanced", async (c) => {
  try {
    const { userId } = await getAuthenticatedUser(c.req.raw);
    const insightsKey = `enhanced_insights_${userId}`;
    
    let insights = await kv.get(insightsKey);
    
    if (!insights) {
      insights = {
        wellnessRecommendations: [
          {
            id: 1,
            type: "nutrition",
            title: "Optimize Pre-Workout Nutrition",
            description: "Your workout performance peaks when you eat a light snack 30-60 minutes before exercise.",
            impact: "High",
            evidenceStrength: 85,
            timeToImplement: "Immediate",
            category: "Performance"
          },
          {
            id: 2,
            type: "recovery",
            title: "Enhance Sleep Recovery",
            description: "Your REM sleep duration is optimal, but deep sleep could be improved for better recovery.",
            impact: "Medium",
            evidenceStrength: 78,
            timeToImplement: "1-2 weeks",
            category: "Recovery"
          }
        ],
        behaviorPatterns: [
          {
            pattern: "Weekend Activity Dip",
            description: "Your activity level drops by 35% on weekends compared to weekdays.",
            frequency: "Weekly",
            impact: "Medium",
            trend: "Consistent",
            suggestion: "Plan active weekend activities to maintain momentum.",
            strength: 85
          },
          {
            pattern: "Sleep Quality Correlation",
            description: "Better sleep quality correlates with 20% higher next-day activity.",
            frequency: "Daily",
            impact: "High",
            trend: "Strong",
            suggestion: "Prioritize sleep quality to boost daily activity levels.",
            strength: 93
          }
        ],
        personalizedGoals: [
          {
            id: 1,
            title: "Increase Daily Steps",
            current: 10987,
            target: 12000,
            progress: 91,
            timeframe: "2 weeks",
            difficulty: "Medium",
            category: "Activity"
          }
        ]
      };
      
      await kv.set(insightsKey, insights);
    }
    
    return c.json(insights);
  } catch (error) {
    console.error('Error fetching enhanced insights:', error);
    return c.json({ error: 'Failed to fetch enhanced insights' }, 500);
  }
});

Deno.serve(app.fetch);