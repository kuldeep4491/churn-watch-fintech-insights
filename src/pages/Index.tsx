
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import { ChurnChart } from "@/components/ChurnChart";
import { RiskTable } from "@/components/RiskTable";
import { ModelMetrics } from "@/components/ModelMetrics";
import { FeatureImportance } from "@/components/FeatureImportance";
import { processChurnData, generatePredictions } from "@/utils/churnAnalysis";
import { Upload, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcessedData {
  predictions: Array<{
    userId: string;
    churnProbability: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    features: Record<string, any>;
  }>;
  metrics: {
    accuracy: number;
    auc: number;
    precision: number;
    recall: number;
  };
  featureImportance: Array<{
    feature: string;
    importance: number;
  }>;
}

const Index = () => {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Simulate processing steps
      const steps = [
        { message: "Reading CSV file...", progress: 20 },
        { message: "Cleaning and preprocessing data...", progress: 40 },
        { message: "Training churn prediction model...", progress: 70 },
        { message: "Generating predictions...", progress: 90 },
        { message: "Creating visualizations...", progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(step.progress);
        console.log(step.message);
      }

      // Process the actual file
      const csvText = await file.text();
      const processedData = await processChurnData(csvText);
      const predictions = generatePredictions(processedData);
      
      setData(predictions);
      
      toast({
        title: "Analysis Complete!",
        description: `Processed ${predictions.predictions.length} customer records with ${(predictions.metrics.auc * 100).toFixed(1)}% AUC-ROC score.`,
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process the file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [toast]);

  const highRiskCount = data?.predictions.filter(p => p.riskLevel === 'High').length || 0;
  const totalCustomers = data?.predictions.length || 0;
  const averageChurnRisk = data?.predictions.reduce((sum, p) => sum + p.churnProbability, 0) / totalCustomers || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ChurnGuard Analytics
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced machine learning platform for predicting and preventing customer churn in fintech applications
          </p>
        </div>

        {/* Upload Section */}
        {!data && (
          <Card className="max-w-2xl mx-auto mb-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Customer Data
              </CardTitle>
              <CardDescription className="text-slate-400">
                Upload your CSV file with customer behavioral and transactional data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-slate-300 text-sm">
                    Processing your data... {progress}%
                  </p>
                </div>
              ) : (
                <FileUpload onFileUpload={handleFileUpload} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Dashboard */}
        {data && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Customers</p>
                      <p className="text-2xl font-bold text-white">{totalCustomers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">High Risk</p>
                      <p className="text-2xl font-bold text-red-400">{highRiskCount}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Avg Churn Risk</p>
                      <p className="text-2xl font-bold text-yellow-400">{(averageChurnRisk * 100).toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Model AUC-ROC</p>
                      <p className="text-2xl font-bold text-green-400">{(data.metrics.auc * 100).toFixed(1)}%</p>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Excellent
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChurnChart data={data.predictions} />
              <ModelMetrics metrics={data.metrics} />
            </div>

            {/* Feature Importance and Risk Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeatureImportance features={data.featureImportance} />
              <RiskTable predictions={data.predictions.slice(0, 10)} />
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <Button 
                onClick={() => setData(null)} 
                variant="outline" 
                className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700"
              >
                Upload New Dataset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
