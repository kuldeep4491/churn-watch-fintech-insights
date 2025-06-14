
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ModelMetricsProps {
  metrics: {
    accuracy: number;
    auc: number;
    precision: number;
    recall: number;
  };
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ metrics }) => {
  const getPerformanceLevel = (score: number) => {
    if (score >= 0.9) return { level: 'Excellent', color: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 0.8) return { level: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400' };
    if (score >= 0.7) return { level: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    return { level: 'Poor', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const metricsData = [
    {
      name: 'AUC-ROC',
      value: metrics.auc,
      description: 'Area Under Curve - Overall model performance',
      weight: 40
    },
    {
      name: 'Accuracy',
      value: metrics.accuracy,
      description: 'Percentage of correct predictions',
      weight: 20
    },
    {
      name: 'Precision',
      value: metrics.precision,
      description: 'True positives / (True positives + False positives)',
      weight: 20
    },
    {
      name: 'Recall',
      value: metrics.recall,
      description: 'True positives / (True positives + False negatives)',
      weight: 20
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Model Performance Metrics</CardTitle>
        <CardDescription className="text-slate-400">
          Key performance indicators for the churn prediction model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metricsData.map((metric) => {
          const performance = getPerformanceLevel(metric.value);
          return (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-white">{metric.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`${performance.textColor} border-current text-xs`}
                  >
                    {performance.level}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${performance.textColor}`}>
                    {(metric.value * 100).toFixed(1)}%
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {metric.weight}% weight
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={metric.value * 100} 
                  className="h-2"
                />
                <p className="text-xs text-slate-400">{metric.description}</p>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Overall Score</span>
            <span className="text-lg font-bold text-purple-400">
              {((metrics.auc * 0.4 + metrics.accuracy * 0.2 + metrics.precision * 0.2 + metrics.recall * 0.2) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weighted average based on judging criteria
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
