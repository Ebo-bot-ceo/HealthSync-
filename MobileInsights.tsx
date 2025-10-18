import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Brain, TrendingUp, Target, Moon, Droplets } from "lucide-react";

interface Insight {
  type: string;
  title: string;
  description: string;
  priority: string;
}

interface MobileInsightsProps {
  insights: Insight[];
  getPriorityColor: (priority: string) => string;
  onLogActivity: (type: string, data: any) => void;
}

const insightIconMap = {
  "achievement": Target,
  "recommendation": Moon,
  "pattern": TrendingUp,
  "alert": Droplets
};

export function MobileInsights({ insights, getPriorityColor, onLogActivity }: MobileInsightsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Brain className="w-4 h-4 mr-2" />
          View AI Insights
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            AI Insights
            <Badge variant="outline">Updated</Badge>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 overflow-y-auto h-full pb-20">
          {insights.map((insight, index) => {
            const Icon = insightIconMap[insight.type as keyof typeof insightIconMap] || Target;
            return (
              <Card key={index} className={`p-4 border ${getPriorityColor(insight.priority)} border-opacity-30`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getPriorityColor(insight.priority)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                      View Details →
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4>Weekly Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Goal Achievement</span>
                <Badge variant="default">87%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Days</span>
                <Badge variant="secondary">6/7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Health Score</span>
                <Badge variant="default">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  85
                </Badge>
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-6" 
            onClick={() => {
              onLogActivity('report_generation', { type: 'weekly_report', timestamp: new Date().toISOString() });
              setOpen(false);
            }}
          >
            Generate Weekly Report
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}