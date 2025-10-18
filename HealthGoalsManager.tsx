import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Target, Plus, Edit3, Trash2, Calendar as CalendarIcon, Trophy, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Zap } from "lucide-react";
import { makeServerRequest } from '../utils/supabase/client';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  milestones: Milestone[];
  insights?: string[];
}

interface Milestone {
  id: string;
  title: string;
  targetValue: number;
  completed: boolean;
  completedAt?: Date;
}

interface HealthGoalsManagerProps {
  onLogActivity: (type: string, data: any) => void;
}

export function HealthGoalsManager({ onLogActivity }: HealthGoalsManagerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    targetValue: 0,
    unit: '',
    deadline: new Date(),
    priority: 'medium' as const
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      // Load demo goals initially
      const demoGoals: Goal[] = [
        {
          id: '1',
          title: 'Walk 10,000 Steps Daily',
          description: 'Maintain consistent daily activity by reaching 10,000 steps every day',
          category: 'Activity',
          targetValue: 10000,
          currentValue: 8500,
          unit: 'steps',
          deadline: new Date('2024-02-15'),
          priority: 'high',
          status: 'active',
          createdAt: new Date('2024-01-01'),
          milestones: [
            { id: '1a', title: '7,500 steps/day', targetValue: 7500, completed: true, completedAt: new Date('2024-01-05') },
            { id: '1b', title: '8,500 steps/day', targetValue: 8500, completed: true, completedAt: new Date('2024-01-12') },
            { id: '1c', title: '9,000 steps/day', targetValue: 9000, completed: false },
            { id: '1d', title: '10,000 steps/day', targetValue: 10000, completed: false }
          ],
          insights: [
            "You're 85% of the way to your goal!",
            "Weekends show lower activity - consider weekend activities",
            "Morning walks boost your daily average by 15%"
          ]
        },
        {
          id: '2',
          title: 'Improve Sleep Quality',
          description: 'Get 8 hours of quality sleep with consistent bedtime routine',
          category: 'Sleep',
          targetValue: 8,
          currentValue: 7.5,
          unit: 'hours',
          deadline: new Date('2024-03-01'),
          priority: 'high',
          status: 'active',
          createdAt: new Date('2024-01-01'),
          milestones: [
            { id: '2a', title: 'Consistent bedtime', targetValue: 7, completed: true, completedAt: new Date('2024-01-10') },
            { id: '2b', title: '7.5 hours average', targetValue: 7.5, completed: true, completedAt: new Date('2024-01-15') },
            { id: '2c', title: '8 hours average', targetValue: 8, completed: false }
          ],
          insights: [
            "Sleep consistency has improved by 40%",
            "Deep sleep duration is optimal",
            "Consider reducing screen time before bed"
          ]
        },
        {
          id: '3',
          title: 'Increase Water Intake',
          description: 'Drink 2.5 liters of water daily for optimal hydration',
          category: 'Nutrition',
          targetValue: 2.5,
          currentValue: 2.1,
          unit: 'liters',
          deadline: new Date('2024-01-31'),
          priority: 'medium',
          status: 'active',
          createdAt: new Date('2024-01-01'),
          milestones: [
            { id: '3a', title: '2.0 liters/day', targetValue: 2.0, completed: true, completedAt: new Date('2024-01-08') },
            { id: '3b', title: '2.2 liters/day', targetValue: 2.2, completed: false },
            { id: '3c', title: '2.5 liters/day', targetValue: 2.5, completed: false }
          ],
          insights: [
            "Morning hydration routine is working well",
            "Afternoon intake drops - set reminders",
            "Hydration correlates with energy levels"
          ]
        },
        {
          id: '4',
          title: 'Reduce Resting Heart Rate',
          description: 'Improve cardiovascular fitness by lowering resting heart rate to 60 BPM',
          category: 'Cardiovascular',
          targetValue: 60,
          currentValue: 68,
          unit: 'BPM',
          deadline: new Date('2024-04-01'),
          priority: 'medium',
          status: 'active',
          createdAt: new Date('2024-01-01'),
          milestones: [
            { id: '4a', title: 'Below 70 BPM', targetValue: 70, completed: true, completedAt: new Date('2024-01-14') },
            { id: '4b', title: 'Below 65 BPM', targetValue: 65, completed: false },
            { id: '4c', title: 'Below 60 BPM', targetValue: 60, completed: false }
          ],
          insights: [
            "HIIT workouts are showing positive impact",
            "Recovery heart rate is improving",
            "Consider adding more cardio sessions"
          ]
        }
      ];

      setGoals(demoGoals);

      // Try to load real goals from server
      try {
        const response = await makeServerRequest('/health-goals');
        if (response && Array.isArray(response)) {
          setGoals(response);
        }
      } catch (error) {
        console.warn('Failed to load goals from server, using demo data:', error);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoal = async (goal: Partial<Goal>) => {
    try {
      const goalData = {
        ...goal,
        id: goal.id || Date.now().toString(),
        createdAt: goal.createdAt || new Date(),
        currentValue: goal.currentValue || 0,
        status: goal.status || 'active',
        milestones: goal.milestones || []
      };

      if (goal.id) {
        // Update existing goal
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, ...goalData } : g));
      } else {
        // Create new goal
        setGoals(prev => [...prev, goalData as Goal]);
      }

      // Try to save to server
      try {
        await makeServerRequest('/health-goals', {
          method: 'POST',
          body: JSON.stringify(goalData)
        });
        onLogActivity('goal_saved', { goalId: goalData.id, action: goal.id ? 'updated' : 'created' });
      } catch (error) {
        console.warn('Failed to save goal to server:', error);
      }

      setIsCreating(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    try {
      setGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          const updatedGoal = { ...goal, currentValue };
          
          // Check if goal is completed
          if (currentValue >= goal.targetValue && goal.status !== 'completed') {
            updatedGoal.status = 'completed';
            onLogActivity('goal_completed', { goalId, title: goal.title });
          }

          // Update milestone completion
          updatedGoal.milestones = goal.milestones.map(milestone => {
            if (currentValue >= milestone.targetValue && !milestone.completed) {
              return { ...milestone, completed: true, completedAt: new Date() };
            }
            return milestone;
          });

          return updatedGoal;
        }
        return goal;
      }));

      // Save to server
      try {
        await makeServerRequest(`/health-goals/${goalId}/progress`, {
          method: 'PUT',
          body: JSON.stringify({ currentValue })
        });
      } catch (error) {
        console.warn('Failed to update goal progress on server:', error);
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      setGoals(prev => prev.filter(g => g.id !== goalId));
      
      try {
        await makeServerRequest(`/health-goals/${goalId}`, {
          method: 'DELETE'
        });
        onLogActivity('goal_deleted', { goalId });
      } catch (error) {
        console.warn('Failed to delete goal from server:', error);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const overallProgress = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Health Goals</h2>
          <p className="text-sm text-muted-foreground">Track and achieve your health objectives</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Health Goal</DialogTitle>
              <DialogDescription>
                Set a specific, measurable health goal with milestones and deadlines.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Walk 10,000 steps daily"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activity">Activity</SelectItem>
                      <SelectItem value="Sleep">Sleep</SelectItem>
                      <SelectItem value="Nutrition">Nutrition</SelectItem>
                      <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Flexibility">Flexibility</SelectItem>
                      <SelectItem value="Mental Health">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you want to achieve and why..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target Value</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="steps, hours, liters..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewGoal(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoal.deadline.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newGoal.deadline}
                      onSelect={(date) => setNewGoal(prev => ({ ...prev, deadline: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => saveGoal(newGoal)} className="flex-1">
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xl font-bold">{goals.length}</div>
                <div className="text-sm text-muted-foreground">Total Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-xl font-bold">{completedGoals.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-xl font-bold">{activeGoals.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-xl font-bold">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Active Goals</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {activeGoals.map((goal) => (
              <Card key={goal.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{goal.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority} priority
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <div className="text-sm text-muted-foreground">
                        Due: {goal.deadline.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedGoal(goal)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <Progress value={getGoalProgress(goal)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(getGoalProgress(goal))}% complete</span>
                      <span>{Math.round((goal.targetValue - goal.currentValue) / (goal.deadline.getTime() - Date.now()) * 24 * 60 * 60 * 1000)} {goal.unit}/day needed</span>
                    </div>
                  </div>

                  {goal.milestones.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Milestones</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {goal.milestones.map((milestone) => (
                          <div key={milestone.id} className={`p-2 rounded border ${milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                              )}
                              <span className={`text-sm ${milestone.completed ? 'text-green-800' : 'text-gray-600'}`}>
                                {milestone.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {goal.insights && goal.insights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        AI Insights
                      </h4>
                      <div className="space-y-1">
                        {goal.insights.map((insight, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Current ${goal.unit}`}
                      value={goal.currentValue}
                      onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => onLogActivity('goal_progress_updated', { goalId: goal.id, currentValue: goal.currentValue })}
                    >
                      Update Progress
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="p-4 bg-green-50 dark:bg-green-900/10 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium">{goal.title}</h3>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <div className="text-sm text-green-700">
                      Achieved: {goal.currentValue} {goal.unit} (Target: {goal.targetValue} {goal.unit})
                    </div>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Goal Analytics
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{Math.round(overallProgress)}%</div>
                    <div className="text-sm text-muted-foreground">Overall Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + getGoalProgress(goal), 0) / goals.length) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Average Progress</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Progress by Category</h4>
                  {Array.from(new Set(goals.map(g => g.category))).map(category => {
                    const categoryGoals = goals.filter(g => g.category === category);
                    const categoryProgress = categoryGoals.reduce((acc, goal) => acc + getGoalProgress(goal), 0) / categoryGoals.length;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{Math.round(categoryProgress)}%</span>
                        </div>
                        <Progress value={categoryProgress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}