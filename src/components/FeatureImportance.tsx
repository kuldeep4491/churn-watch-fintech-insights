
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureImportanceProps {
  features: Array<{
    feature: string;
    importance: number;
  }>;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ features }) => {
  // Sort features by importance (highest first) and take top 8
  const sortedFeatures = [...features]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 8)
    .map(f => ({
      ...f,
      importance: f.importance * 100 // Convert to percentage
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-purple-400">
            {`Importance: ${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Feature Importance</CardTitle>
        <CardDescription className="text-slate-400">
          Most influential factors in predicting customer churn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={sortedFeatures}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="feature" 
              stroke="#9CA3AF" 
              fontSize={11}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="importance" 
              fill="url(#featureGradient)"
              radius={[0, 4, 4, 0]}
            />
            <defs>
              <linearGradient id="featureGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Key Insights:</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• {sortedFeatures[0]?.feature} is the strongest predictor of churn</li>
            <li>• Top 3 features account for {(sortedFeatures.slice(0, 3).reduce((sum, f) => sum + f.importance, 0)).toFixed(1)}% of model decisions</li>
            <li>• Focus retention efforts on customers with high values in these features</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
