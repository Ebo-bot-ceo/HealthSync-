import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Download, FileText, Calendar, Database, Share2, Mail, Cloud, CheckCircle } from "lucide-react";

interface DataExportManagerProps {
  onLogActivity: (type: string, data: any) => void;
}

export function DataExportManager({ onLogActivity }: DataExportManagerProps) {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "steps", "heart-rate", "sleep", "activity"
  ]);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<Date | null>(null);

  const availableMetrics = [
    { id: "steps", label: "Daily Steps", icon: "👣" },
    { id: "heart-rate", label: "Heart Rate Data", icon: "❤️" },
    { id: "sleep", label: "Sleep Analysis", icon: "😴" },
    { id: "activity", label: "Activity Summary", icon: "🏃" },
    { id: "nutrition", label: "Nutrition Tracking", icon: "🥗" },
    { id: "stress", label: "Stress Levels", icon: "🧘" },
    { id: "goals", label: "Health Goals", icon: "🎯" },
    { id: "insights", label: "AI Insights", icon: "🧠" }
  ];

  const exportFormats = [
    { id: "pdf", label: "PDF Report", description: "Comprehensive formatted report", icon: FileText },
    { id: "csv", label: "CSV Data", description: "Raw data for analysis", icon: Database },
    { id: "json", label: "JSON Export", description: "Machine-readable format", icon: Database }
  ];

  const timeRanges = [
    { id: "7days", label: "Last 7 Days" },
    { id: "30days", label: "Last 30 Days" },
    { id: "90days", label: "Last 3 Months" },
    { id: "1year", label: "Last 12 Months" },
    { id: "all", label: "All Time" }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const intervals = [20, 40, 60, 80, 100];
      for (const progress of intervals) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExportProgress(progress);
      }

      // Log the export activity
      onLogActivity('data_export', {
        format: selectedFormat,
        timeRange: selectedTimeRange,
        metrics: selectedMetrics,
        timestamp: new Date().toISOString()
      });

      setLastExport(new Date());

      // In a real implementation, this would trigger the actual export
      const fileName = `healthsync-export-${selectedTimeRange}.${selectedFormat}`;
      
      // Create a mock download
      const element = document.createElement('a');
      const file = new Blob(['# HealthSync Pro Export\n\nYour health data export has been generated successfully.'], 
        { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Data Export</h2>
        <p className="text-sm text-muted-foreground">Export your health data for backup or analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Format
              </CardTitle>
              <CardDescription>Choose how you want your data exported</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div
                      key={format.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedFormat === format.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-muted-foreground">{format.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Range Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Time Range
              </CardTitle>
              <CardDescription>Select the period for data export</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Metrics Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data to Include
              </CardTitle>
              <CardDescription>Choose which metrics to include in your export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                    />
                    <Label htmlFor={metric.id} className="flex items-center gap-2 cursor-pointer">
                      <span>{metric.icon}</span>
                      {metric.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Format:</span>
                  <span className="font-medium">{exportFormats.find(f => f.id === selectedFormat)?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Range:</span>
                  <span className="font-medium">{timeRanges.find(r => r.id === selectedTimeRange)?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Metrics:</span>
                  <span className="font-medium">{selectedMetrics.length} selected</span>
                </div>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  Estimated size: ~{Math.round(selectedMetrics.length * 0.5)} MB
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  Processing time: ~{Math.round(selectedMetrics.length * 2)} seconds
                </Badge>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}

              <Button 
                onClick={handleExport}
                disabled={isExporting || selectedMetrics.length === 0}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Exports</CardTitle>
            </CardHeader>
            <CardContent>
              {lastExport ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Latest Export</div>
                      <div className="text-xs text-muted-foreground">
                        {lastExport.toLocaleDateString()} at {lastExport.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No recent exports
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sharing Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Sharing Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email to Healthcare Provider
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Cloud className="w-4 h-4 mr-2" />
                Save to Cloud Storage
              </Button>
              <div className="text-xs text-muted-foreground">
                Your data is encrypted during sharing and storage
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}