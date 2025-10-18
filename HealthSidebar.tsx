import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, Download, Activity, Thermometer, Footprints, Heart, Moon, Droplets, Brain } from "lucide-react";
import { UserMenu } from "./auth/UserMenu";

interface HealthMetric {
  title: string;
  value: string;
  target: string;
  progress: number;
  trend: string;
  change: string;
}

interface HealthSidebarProps {
  healthMetrics: HealthMetric[];
  onLogActivity: (type: string, data: any) => void;
  getProgressColor: (progress: number) => string;
}

const iconMap = {
  "Steps": Footprints,
  "Heart Rate": Heart,
  "Sleep": Moon,
  "Calories": Activity,
  "Hydration": Droplets,
  "Stress": Brain
};

export function HealthSidebar({ healthMetrics, onLogActivity, getProgressColor }: HealthSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-medium">HealthSync Pro</h1>
            <p className="text-sm text-muted-foreground">Your Health Dashboard</p>
          </div>
        </div>
        <UserMenu />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Today's Metrics</h3>
        {healthMetrics?.map((metric, index) => {
          const Icon = iconMap[metric.title as keyof typeof iconMap] || Activity;
          return (
            <Card key={index} className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{metric.title}</span>
                </div>
                <Badge variant={metric.trend === "up" ? "default" : metric.trend === "down" ? "destructive" : "secondary"}>
                  {metric.change}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                </div>
                <div className={`text-right ${getProgressColor(metric.progress)}`}>
                  <div className="font-medium">{metric.progress}%</div>
                  <div className="text-xs">Progress</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => onLogActivity('manual_entry', { type: 'activity', timestamp: new Date().toISOString() })}
        >
          <Calendar className="w-4 h-4" />
          Log Activity
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => onLogActivity('symptoms', { type: 'symptom', timestamp: new Date().toISOString() })}
        >
          <Thermometer className="w-4 h-4" />
          Add Symptoms
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => onLogActivity('export', { type: 'export', timestamp: new Date().toISOString() })}
        >
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
}