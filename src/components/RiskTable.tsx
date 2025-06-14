
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RiskTableProps {
  predictions: Array<{
    userId: string;
    churnProbability: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    features: Record<string, any>;
  }>;
}

export const RiskTable: React.FC<RiskTableProps> = ({ predictions }) => {
  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  // Sort by churn probability (highest first)
  const sortedPredictions = [...predictions].sort((a, b) => b.churnProbability - a.churnProbability);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Top 10 At-Risk Customers</CardTitle>
        <CardDescription className="text-slate-400">
          Customers with highest churn probability requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">Customer ID</TableHead>
                <TableHead className="text-slate-300">Churn Risk</TableHead>
                <TableHead className="text-slate-300">Risk Level</TableHead>
                <TableHead className="text-slate-300">Monthly Charges</TableHead>
                <TableHead className="text-slate-300">Tenure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPredictions.map((prediction, index) => (
                <TableRow 
                  key={prediction.userId} 
                  className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    #{prediction.userId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            prediction.churnProbability > 0.7 ? 'bg-red-500' :
                            prediction.churnProbability > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${prediction.churnProbability * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getRiskColor(prediction.riskLevel)}`}>
                        {(prediction.churnProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRiskBadgeVariant(prediction.riskLevel)}
                      className="text-xs"
                    >
                      {prediction.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    ${prediction.features.monthlyCharges?.toFixed(2) || 'N/A'}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {prediction.features.tenure || 'N/A'} months
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
