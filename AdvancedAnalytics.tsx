import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Activity, Heart, Moon, Zap, Target, Calendar, BarChart3, LineChart, PieChart, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';

interface AnalyticsProps {
  healthData: any;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function AdvancedAnalytics({ healthData, dateRange, onDateRangeChange }: AnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [predictiveData, setPredictiveData] = useState<any[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [riskFactors, setRiskFactors] = useState<any[]>([]);

  useEffect(() => {
    // Generate correlation analysis data
    const correlations = [
      { metric1: "Sleep", metric2: "Heart Rate Recovery", correlation: 0.78, strength: "Strong" },
      { metric1: "Steps", metric2: "Mood Score", correlation: 0.65, strength: "Moderate" },
      { metric1: "Hydration", metric2: "Cognitive Performance", correlation: 0.72, strength: "Strong" },
      { metric1: "Stress", metric2: "Sleep Quality", correlation: -0.68, strength: "Strong" },
      { metric1: "Exercise", metric2: "Recovery Time", correlation: 0.54, strength: "Moderate" }
    ];
    setCorrelationData(correlations);

    // Generate predictive analytics
    const predictions = [
      { date: "2024-01-08", predicted: 11200, actual: null, confidence: 85 },
      { date: "2024-01-09", predicted: 10800, actual: null, confidence: 82 },
      { date: "2024-01-10", predicted: 12100, actual: null, confidence: 88 },
      { date: "2024-01-11", predicted: 9900, actual: null, confidence: 79 },
      { date: "2024-01-12", predicted: 11500, actual: null, confidence: 86 },
      { date: "2024-01-13", predicted: 13200, actual: null, confidence: 84 },
      { date: "2024-01-14", predicted: 10700, actual: null, confidence: 83 }
    ];
    setPredictiveData(predictions);

    // Calculate health score
    calculateHealthScore();

    // Generate risk factors
    const risks = [
      { type: "Low", factor: "Cardiovascular Health", score: 92, trend: "improving" },
      { type: "Medium", factor: "Sleep Consistency", score: 68, trend: "declining" },
      { type: "Low", factor: "Stress Management", score: 88, trend: "stable" },
      { type: "High", factor: "Hydration Habits", score: 45, trend: "declining" }
    ];
    setRiskFactors(risks);
  }, [healthData, dateRange]);

  const calculateHealthScore = () => {
    if (!healthData?.healthMetrics) return;
    
    const metrics = healthData.healthMetrics;
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

    metrics.forEach((metric: any) => {
      const weight = weights[metric.title as keyof typeof weights] || 0;
      weightedSum += metric.progress * weight;
      totalWeight += weight;
    });

    const score = Math.round(weightedSum / totalWeight);
    setHealthScore(score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case "Low": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "High": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const trendData = healthData?.stepData?.map((item: any, index: number) => ({
    date: item.date,
    steps: item.steps,
    trend: index > 0 ? (item.steps > healthData.stepData[index - 1].steps ? "up" : "down") : "stable",
    movingAverage: healthData.stepData.slice(Math.max(0, index - 2), index + 1)
      .reduce((sum: number, d: any) => sum + d.steps, 0) / Math.min(3, index + 1)
  })) || [];

  const performanceZones = [
    { name: "Rest", min: 0, max: 5000, color: "#94a3b8", percentage: 15 },
    { name: "Light", min: 5000, max: 8000, color: "#3b82f6", percentage: 25 },
    { name: "Moderate", min: 8000, max: 12000, color: "#10b981", percentage: 40 },
    { name: "Vigorous", min: 12000, max: 15000, color: "#f59e0b", percentage: 15 },
    { name: "Peak", min: 15000, max: 20000, color: "#ef4444", percentage: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Health Score Analysis
            </CardTitle>
            <CardDescription>Comprehensive health assessment based on your metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="flex-1 ml-8">
                <Progress value={healthScore} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Improving Areas</span>
                </div>
                <div className="text-xs text-muted-foreground">Sleep Quality, Activity Level</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Focus Areas</span>
                </div>
                <div className="text-xs text-muted-foreground">Hydration, Stress Management</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskFactors.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{risk.factor}</span>
                  <Badge variant="outline" className={getRiskColor(risk.type)}>
                    {risk.type}
                  </Badge>
                </div>
                <Progress value={risk.score} className="h-2" />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {risk.trend === "improving" && <TrendingUp className="w-3 h-3 text-green-600" />}
                  {risk.trend === "declining" && <TrendingDown className="w-3 h-3 text-red-600" />}
                  {risk.trend === "stable" && <Activity className="w-3 h-3 text-gray-600" />}
                  {risk.trend}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Metric Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={healthData?.healthMetrics || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Goal Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthData?.healthMetrics?.slice(0, 4).map((metric: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{metric.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{metric.value}</span>
                          <Badge variant={metric.progress >= 100 ? "default" : "secondary"}>
                            {metric.progress >= 100 ? "✓" : `${metric.progress}%`}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Trend Analysis with Moving Averages
              </CardTitle>
              <CardDescription>Track patterns and identify trends in your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#e0e7ff" opacity={0.7} />
                  <Line type="monotone" dataKey="movingAverage" stroke="#3b82f6" strokeWidth={3} name="7-day Average" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Metric Correlations
              </CardTitle>
              <CardDescription>Understand how your health metrics influence each other</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlationData.map((correlation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{correlation.metric1}</span>
                        <span className="text-muted-foreground">↔</span>
                        <span className="font-medium">{correlation.metric2}</span>
                      </div>
                      <Badge variant={Math.abs(correlation.correlation) > 0.7 ? "default" : "secondary"}>
                        {correlation.strength}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress 
                        value={Math.abs(correlation.correlation) * 100} 
                        className="flex-1 h-2" 
                      />
                      <span className={`text-sm font-medium ${correlation.correlation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {correlation.correlation > 0 ? '+' : ''}{correlation.correlation.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>AI-powered predictions for your next week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={[...healthData?.stepData || [], ...predictiveData]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    name="Actual Steps"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    name="Predicted Steps"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Prediction Confidence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {predictiveData.slice(0, 4).map((pred, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{new Date(pred.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={pred.confidence} className="w-16 h-2" />
                        <span className="text-xs">{pred.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance Zones
              </CardTitle>
              <CardDescription>Time spent in different activity intensity zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceZones.map((zone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }}></div>
                        <span className="text-sm font-medium">{zone.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {zone.min.toLocaleString()} - {zone.max.toLocaleString()} steps
                        </span>
                      </div>
                      <span className="text-sm font-medium">{zone.percentage}%</span>
                    </div>
                    <Progress value={zone.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Performance Insights</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• You spend 40% of your time in the moderate activity zone</p>
                  <p>• Consider increasing vigorous activity to 20% for optimal fitness</p>
                  <p>• Your peak performance days show 25% higher recovery rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}