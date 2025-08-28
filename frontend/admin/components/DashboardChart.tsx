"use client";

import { Card, CardBody, CardHeader } from '@heroui/react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface DashboardChartProps {
  title: string;
  data: ChartData;
  type?: 'bar' | 'line' | 'doughnut';
}

export function DashboardChart({ title, data, type = 'bar' }: DashboardChartProps) {
  // Simple chart visualization using CSS
  const maxValue = Math.max(...data.datasets[0]?.data || [0]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </CardHeader>
      <CardBody>
        {data.labels.length > 0 ? (
          <div className="space-y-4">
            {data.labels.map((label, index) => {
              const value = data.datasets[0]?.data[index] || 0;
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No data available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export function MiniChart({ data, color = "primary" }: { 
  data: number[]; 
  color?: "primary" | "success" | "warning" | "danger" 
}) {
  const maxValue = Math.max(...data);
  
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, index) => {
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div
            key={index}
            className={`flex-1 bg-${color} rounded-t-sm transition-all duration-300`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}
