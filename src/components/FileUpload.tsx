
import React, { useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'));
    
    if (csvFile) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors duration-300 cursor-pointer"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-purple-600/20 rounded-full">
          <Upload className="h-8 w-8 text-purple-400" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Drag & Drop CSV File
          </h3>
          <p className="text-slate-400 mb-4">
            or click to browse your files
          </p>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        
        <label htmlFor="file-upload">
          <Button 
            type="button" 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            asChild
          >
            <span className="cursor-pointer flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Choose File
            </span>
          </Button>
        </label>

        <div className="text-xs text-slate-500 space-y-1">
          <p>Supported format: CSV files</p>
          <p>Expected columns: customer_id, features like tenure, monthly_charges, etc.</p>
        </div>
      </div>
    </div>
  );
};
