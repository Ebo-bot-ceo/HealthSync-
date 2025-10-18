import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Brain, Target, TrendingUp, AlertTriangle, Lightbulb, Heart, Moon, Activity, Droplets, Zap, Calendar, Clock, Award, Users, BarChart3 } from "lucide-react";

interface InsightsProps {
  healthData: any;
  insights: any[];
  onLogActivity: (type: string, data: any) => void;
}

export function EnhancedInsights({ healthData, insights, onLogActivity }: InsightsProps) {
  const [selectedTab, setSelectedTab] = useState("ai-insights");
  const [personalizedGoals, setPersonalizedGoals] = useState<any[]>([]);
  const [wellnessRecommendations, setWellnessRecommendations] = useState<any[]>([]);
  const [behaviorPatterns, setBehaviorPatterns] = useState<any[]>([]);

  useEffect(() => {
    generatePersonalizedGoals();
    generateWellnessRecommendations();
    analyzeBehaviorPatterns();
  }, [healthData]);

  const generatePersonalizedGoals = () => {
    const goals = [
      {
        id: 1,
        title: "Increase Daily Steps",
        current: 10987,
        target: 12000,
        progress: 91,
        timeframe: "2 weeks",
        difficulty: "Medium",
        category: "Activity",
        icon: Activity,
        description: "Based on your recent activity trends, you can achieve this safely.",
        actionSteps: [
          "Take a 10-minute walk after each meal",
          "Use stairs instead of elevators",
          "Park further away from destinations"
        ]
      },
      {
        id: 2,
        title: "Improve Sleep Consistency",
        current: 7.5,
        target: 8.0,
        progress: 94,
        timeframe: "1 week",
        difficulty: "Easy",
        category: "Sleep",
        icon: Moon,
        description: "Your sleep duration is good, but consistency can be improved.",
        actionSteps: [
          "Set a consistent bedtime routine",
          "Avoid screens 1 hour before bed",
          "Keep bedroom temperature cool (65-68°F)"
        ]
      },
      {
        id: 3,
        title: "Optimize Hydration",
        current: 2.1,
        target: 2.5,
        progress: 84,
        timeframe: "1 week",
        difficulty: "Easy",
        category: "Nutrition",
        icon: Droplets,
        description: "Increasing water intake will improve your recovery and energy levels.",
        actionSteps: [
          "Drink a glass of water upon waking",
          "Set hourly hydration reminders",
          "Carry a reusable water bottle"
        ]
      },
      {
        id: 4,
        title: "Heart Rate Recovery",
        current: 68,
        target: 60,
        progress: 75,
        timeframe: "4 weeks",
        difficulty: "Hard",
        category: "Cardiovascular",
        icon: Heart,
        description: "Improve cardiovascular fitness through targeted training.",
        actionSteps: [
          "Incorporate HIIT workouts 2x per week",
          "Add 30 minutes of moderate cardio daily",
          "Practice deep breathing exercises"
        ]
      }
    ];
    setPersonalizedGoals(goals);
  };

  const generateWellnessRecommendations = () => {
    const recommendations = [
      {
        id: 1,
        type: "nutrition",
        title: "Optimize Pre-Workout Nutrition",
        description: "Your workout performance peaks when you eat a light snack 30-60 minutes before exercise.",
        impact: "High",
        evidenceStrength: 85,
        timeToImplement: "Immediate",
        category: "Performance",
        actionable: true,
        details: "Data shows 23% better workout performance when following this pattern.",
        suggestedActions: [
          "Have a banana or small yogurt before workouts",
          "Avoid large meals 2 hours before exercise",
          "Stay hydrated throughout the day"
        ]
      },
      {
        id: 2,
        type: "recovery",
        title: "Enhance Sleep Recovery",
        description: "Your REM sleep duration is optimal, but deep sleep could be improved for better recovery.",
        impact: "Medium",
        evidenceStrength: 78,
        timeToImplement: "1-2 weeks",
        category: "Recovery",
        actionable: true,
        details: "Increasing deep sleep by 15 minutes can improve recovery by 20%.",
        suggestedActions: [
          "Keep bedroom temperature between 65-68°F",
          "Use blackout curtains or eye mask",
          "Avoid caffeine after 2 PM"
        ]
      },
      {
        id: 3,
        type: "stress",
        title: "Stress Management Window",
        description: "Your stress levels are lowest between 10-11 AM. Schedule important tasks during this time.",
        impact: "Medium",
        evidenceStrength: 72,
        timeToImplement: "Immediate",
        category: "Mental Health",
        actionable: true,
        details: "Productivity increases by 35% when working during your optimal stress window.",
        suggestedActions: [
          "Schedule meetings during 10-11 AM",
          "Do challenging work tasks in the morning",
          "Save routine tasks for afternoon"
        ]
      },
      {
        id: 4,
        type: "activity",
        title: "Movement Micro-Breaks",
        description: "Adding 2-minute movement breaks every hour can increase your daily activity by 15%.",
        impact: "Low",
        evidenceStrength: 68,
        timeToImplement: "Immediate",
        category: "Activity",
        actionable: true,
        details: "Small, frequent movements are more sustainable than long workout sessions.",
        suggestedActions: [
          "Set hourly movement reminders",
          "Do desk stretches every hour",
          "Take walking meetings when possible"
        ]
      }
    ];
    setWellnessRecommendations(recommendations);
  };

  const analyzeBehaviorPatterns = () => {
    const patterns = [
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
        pattern: "Post-Meal Energy Peak",
        description: "You show highest activity levels 1-2 hours after meals.",
        frequency: "Daily",
        impact: "Low",
        trend: "Improving",
        suggestion: "Schedule workouts 1.5 hours after eating for optimal performance.",
        strength: 72
      },
      {
        pattern: "Sleep Quality Correlation",
        description: "Better sleep quality correlates with 20% higher next-day activity.",
        frequency: "Daily",
        impact: "High",
        trend: "Strong",
        suggestion: "Prioritize sleep quality to boost daily activity levels.",
        strength: 93
      },
      {
        pattern: "Hydration Impact",
        description: "Days with optimal hydration show 15% better recovery metrics.",
        frequency: "Variable",
        impact: "Medium",
        trend: "Emerging",
        suggestion: "Maintain consistent hydration for better recovery.",
        strength: 67
      }
    ];
    setBehaviorPatterns(patterns);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI-Powered Health Insights</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Brain className="w-3 h-3 mr-1" />
          Smart Analytics
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="goals">Smart Goals</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-insights" className="space-y-4">
          {insights.map((insight, index) => {
            const iconMap = {
              achievement: Award,
              recommendation: Lightbulb,
              pattern: TrendingUp,
              alert: AlertTriangle
            };
            const Icon = iconMap[insight.type as keyof typeof iconMap] || Brain;
            
            return (
              <Card key={index} className={`p-4 border ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getPriorityColor(insight.priority)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                        {insight.priority} Priority
                      </Badge>
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        2 mins ago
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onLogActivity('insight_action', { insightId: index, action: 'view_details' })}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onLogActivity('insight_action', { insightId: index, action: 'dismiss' })}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {personalizedGoals.map((goal) => {
              const Icon = goal.icon;
              return (
                <Card key={goal.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant="outline" className={getDifficultyColor(goal.difficulty)}>
                          {goal.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Progress</span>
                            <span className="text-sm font-medium">{goal.current} / {goal.target}</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Action Steps:</h5>
                          <ul className="space-y-1">
                            {goal.actionSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => onLogActivity('goal_action', { goalId: goal.id, action: 'start' })}
                          >
                            Start Goal
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onLogActivity('goal_action', { goalId: goal.id, action: 'customize' })}
                          >
                            Customize
                          </Button>
                          <div className="ml-auto text-xs text-muted-foreground">
                            Target: {goal.timeframe}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {wellnessRecommendations.map((rec) => (
              <Card key={rec.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(rec.impact)}>
                        {rec.impact} Impact
                      </Badge>
                      <Badge variant="secondary">
                        {rec.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Evidence Strength</span>
                    </div>
                    <Progress value={rec.evidenceStrength} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">{rec.details}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Suggested Actions:</h5>
                    <ul className="space-y-1">
                      {rec.suggestedActions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onLogActivity('recommendation_action', { recId: rec.id, action: 'implement' })}
                    >
                      Implement
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onLogActivity('recommendation_action', { recId: rec.id, action: 'learn_more' })}
                    >
                      Learn More
                    </Button>
                    <div className="ml-auto text-xs text-muted-foreground">
                      Time to implement: {rec.timeToImplement}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="space-y-4">
            {behaviorPatterns.map((pattern, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{pattern.pattern}</h4>
                    <Badge variant="outline" className={getPriorityColor(pattern.impact)}>
                      {pattern.impact} Impact
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{pattern.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <div className="font-medium">{pattern.frequency}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trend:</span>
                      <div className="font-medium flex items-center gap-1">
                        {pattern.trend === "Improving" && <TrendingUp className="w-3 h-3 text-green-600" />}
                        {pattern.trend === "Declining" && <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />}
                        {pattern.trend === "Strong" && <Zap className="w-3 h-3 text-blue-600" />}
                        {pattern.trend === "Consistent" && <Target className="w-3 h-3 text-purple-600" />}
                        {pattern.trend === "Emerging" && <Activity className="w-3 h-3 text-orange-600" />}
                        {pattern.trend}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Strength:</span>
                      <div className="font-medium">{pattern.strength}%</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Suggestion</span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{pattern.suggestion}</p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onLogActivity('pattern_action', { pattern: pattern.pattern, action: 'create_goal' })}
                  >
                    Create Goal from Pattern
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium">Weekly Achievement Summary</h4>
            <p className="text-sm text-muted-foreground">Your health progress this week</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Goals Achieved</span>
              <Badge variant="default">3/4</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Days</span>
              <Badge variant="secondary">6/7</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Health Score</span>
              <Badge variant="default">
                <TrendingUp className="w-3 h-3 mr-1" />
                85/100
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Insights Applied</span>
              <Badge variant="secondary">7</Badge>
            </div>
          </div>
        </div>

        <Button 
          className="w-full mt-4" 
          onClick={() => onLogActivity('report_generation', { type: 'weekly_detailed_report', timestamp: new Date().toISOString() })}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Generate Detailed Weekly Report
        </Button>
      </Card>
    </div>
  );
}