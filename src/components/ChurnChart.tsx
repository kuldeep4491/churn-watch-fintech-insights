
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChurnChartProps {
  data: Array<{
    userId: string;
    churnProbability: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  }>;
}

export const ChurnChart: React.FC<ChurnChartProps> = ({ data }) => {
  // Prepare histogram data for churn probability distribution
  const histogramData = [];
  const bins = 10;
  for (let i = 0; i < bins; i++) {
    const rangeStart = i / bins;
    const rangeEnd = (i + 1) / bins;
    const count = data.filter(d => d.churnProbability >= rangeStart && d.churnProbability < rangeEnd).length;
    histogramData.push({
      range: `${(rangeStart * 100).toFixed(0)}-${(rangeEnd * 100).toFixed(0)}%`,
      count,
    });
  }

  // Prepare pie chart data for risk levels
  const riskLevelCounts = {
    Low: data.filter(d => d.riskLevel === 'Low').length,
    Medium: data.filter(d => d.riskLevel === 'Medium').length,
    High: data.filter(d => d.riskLevel === 'High').length,
  };

  const pieData = [
    { name: 'Low Risk', value: riskLevelCounts.Low, color: '#10B981' },
    { name: 'Medium Risk', value: riskLevelCounts.Medium, color: '#F59E0B' },
    { name: 'High Risk', value: riskLevelCounts.High, color: '#EF4444' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Range: ${label}`}</p>
          <p className="text-purple-400">
            {`Customers: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Churn Probability Distribution */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Churn Probability Distribution</CardTitle>
          <CardDescription className="text-slate-400">
            Distribution of predicted churn probabilities across all customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="range" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Level Pie Chart */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Customer Risk Segmentation</CardTitle>
          <CardDescription className="text-slate-400">
            Breakdown of customers by churn risk level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
