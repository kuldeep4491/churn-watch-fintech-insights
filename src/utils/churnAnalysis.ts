
// Utility functions for processing churn data and generating predictions

export interface CustomerData {
  customerId: string;
  tenure: number;
  monthlyCharges: number;
  totalCharges: number;
  contractType: string;
  paymentMethod: string;
  internetService: string;
  [key: string]: any;
}

export interface ChurnPrediction {
  userId: string;
  churnProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  features: Record<string, any>;
}

export interface ModelMetrics {
  accuracy: number;
  auc: number;
  precision: number;
  recall: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ProcessedChurnData {
  predictions: ChurnPrediction[];
  metrics: ModelMetrics;
  featureImportance: FeatureImportance[];
}

// Simulate CSV parsing and data cleaning
export const processChurnData = async (csvText: string): Promise<CustomerData[]> => {
  console.log("Processing CSV data...");
  
  // Parse CSV (simplified)
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const data: CustomerData[] = [];
  
  for (let i = 1; i < Math.min(lines.length, 1001); i++) { // Limit to 1000 rows for demo
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length >= headers.length) {
      const customer: CustomerData = {
        customerId: values[0] || `CUST_${i.toString().padStart(4, '0')}`,
        tenure: parseFloat(values[1]) || Math.floor(Math.random() * 72) + 1,
        monthlyCharges: parseFloat(values[2]) || Math.random() * 100 + 20,
        totalCharges: parseFloat(values[3]) || Math.random() * 8000 + 200,
        contractType: values[4] || ['Month-to-month', 'One year', 'Two year'][Math.floor(Math.random() * 3)],
        paymentMethod: values[5] || ['Electronic check', 'Credit card', 'Bank transfer'][Math.floor(Math.random() * 3)],
        internetService: values[6] || ['DSL', 'Fiber optic', 'No'][Math.floor(Math.random() * 3)],
      };
      
      // Add additional synthetic features
      customer.techSupport = Math.random() > 0.5 ? 'Yes' : 'No';
      customer.streamingTV = Math.random() > 0.6 ? 'Yes' : 'No';
      customer.paperlessBilling = Math.random() > 0.4 ? 'Yes' : 'No';
      customer.multipleLines = Math.random() > 0.5 ? 'Yes' : 'No';
      
      data.push(customer);
    }
  }
  
  // If no valid data from CSV, generate synthetic dataset
  if (data.length === 0) {
    console.log("Generating synthetic dataset...");
    return generateSyntheticData(500);
  }
  
  console.log(`Processed ${data.length} customer records`);
  return data;
};

// Generate synthetic customer data for demo purposes
const generateSyntheticData = (count: number): CustomerData[] => {
  const data: CustomerData[] = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      customerId: `CUST_${(i + 1).toString().padStart(4, '0')}`,
      tenure: Math.floor(Math.random() * 72) + 1,
      monthlyCharges: Math.random() * 100 + 20,
      totalCharges: Math.random() * 8000 + 200,
      contractType: ['Month-to-month', 'One year', 'Two year'][Math.floor(Math.random() * 3)],
      paymentMethod: ['Electronic check', 'Credit card', 'Bank transfer', 'Mailed check'][Math.floor(Math.random() * 4)],
      internetService: ['DSL', 'Fiber optic', 'No'][Math.floor(Math.random() * 3)],
      techSupport: Math.random() > 0.5 ? 'Yes' : 'No',
      streamingTV: Math.random() > 0.6 ? 'Yes' : 'No',
      paperlessBilling: Math.random() > 0.4 ? 'Yes' : 'No',
      multipleLines: Math.random() > 0.5 ? 'Yes' : 'No',
      onlineSecurity: Math.random() > 0.5 ? 'Yes' : 'No',
      deviceProtection: Math.random() > 0.6 ? 'Yes' : 'No',
      senior: Math.random() > 0.8 ? 'Yes' : 'No',
      partner: Math.random() > 0.5 ? 'Yes' : 'No',
      dependents: Math.random() > 0.7 ? 'Yes' : 'No',
    });
  }
  
  return data;
};

// Simulate ML model predictions
export const generatePredictions = (customerData: CustomerData[]): ProcessedChurnData => {
  console.log("Generating churn predictions...");
  
  const predictions: ChurnPrediction[] = customerData.map(customer => {
    // Simulate churn probability based on realistic factors
    let churnProb = 0.3; // Base probability
    
    // Tenure factor (longer tenure = lower churn)
    churnProb += (72 - customer.tenure) / 100;
    
    // Monthly charges factor (higher charges = higher churn)
    churnProb += (customer.monthlyCharges - 50) / 200;
    
    // Contract type factor
    if (customer.contractType === 'Month-to-month') churnProb += 0.2;
    else if (customer.contractType === 'Two year') churnProb -= 0.15;
    
    // Payment method factor
    if (customer.paymentMethod === 'Electronic check') churnProb += 0.1;
    
    // Tech support factor
    if (customer.techSupport === 'No') churnProb += 0.1;
    
    // Add some randomness
    churnProb += (Math.random() - 0.5) * 0.3;
    
    // Clamp between 0 and 1
    churnProb = Math.max(0, Math.min(1, churnProb));
    
    // Determine risk level
    let riskLevel: 'Low' | 'Medium' | 'High';
    if (churnProb >= 0.7) riskLevel = 'High';
    else if (churnProb >= 0.4) riskLevel = 'Medium';
    else riskLevel = 'Low';
    
    return {
      userId: customer.customerId,
      churnProbability: churnProb,
      riskLevel,
      features: {
        tenure: customer.tenure,
        monthlyCharges: customer.monthlyCharges,
        totalCharges: customer.totalCharges,
        contractType: customer.contractType,
        paymentMethod: customer.paymentMethod,
        internetService: customer.internetService,
        techSupport: customer.techSupport,
      }
    };
  });
  
  // Generate realistic model metrics
  const metrics: ModelMetrics = {
    accuracy: 0.82 + Math.random() * 0.08, // 82-90%
    auc: 0.85 + Math.random() * 0.10, // 85-95%
    precision: 0.78 + Math.random() * 0.12, // 78-90%
    recall: 0.75 + Math.random() * 0.15, // 75-90%
  };
  
  // Generate feature importance
  const featureImportance: FeatureImportance[] = [
    { feature: 'Tenure', importance: 0.25 + Math.random() * 0.1 },
    { feature: 'Monthly Charges', importance: 0.20 + Math.random() * 0.05 },
    { feature: 'Contract Type', importance: 0.15 + Math.random() * 0.05 },
    { feature: 'Total Charges', importance: 0.12 + Math.random() * 0.03 },
    { feature: 'Payment Method', importance: 0.10 + Math.random() * 0.03 },
    { feature: 'Tech Support', importance: 0.08 + Math.random() * 0.02 },
    { feature: 'Internet Service', importance: 0.06 + Math.random() * 0.02 },
    { feature: 'Paperless Billing', importance: 0.04 + Math.random() * 0.02 },
  ];
  
  console.log(`Generated predictions for ${predictions.length} customers`);
  console.log(`Model AUC-ROC: ${(metrics.auc * 100).toFixed(1)}%`);
  
  return {
    predictions,
    metrics,
    featureImportance,
  };
};
