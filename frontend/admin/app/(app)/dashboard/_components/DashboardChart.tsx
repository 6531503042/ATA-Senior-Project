'use client';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import { BarChart3, TrendingUp } from 'lucide-react';
import type { ChartData } from '@/types/dashboard';

interface DashboardChartProps {
  data: ChartData;
  loading?: boolean;
}

export function DashboardChart({ data, loading = false }: DashboardChartProps) {
  if (loading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
              <p className="text-sm text-gray-600">Performance metrics</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-4">
            <Skeleton className="w-full h-64 rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="flex-1 h-16 rounded-lg" />
              <Skeleton className="flex-1 h-16 rounded-lg" />
              <Skeleton className="flex-1 h-16 rounded-lg" />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Simple chart visualization using CSS
  const maxValue = Math.max(...data.datasets[0]?.data || [0]);
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
              <p className="text-sm text-gray-600">Performance metrics over time</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {data && data.labels && data.datasets && data.datasets.length > 0 ? (
          <div className="space-y-6">
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700">{data.datasets[0]?.label || 'Data'}</h4>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <div className="space-y-3">
                {data.labels.map((label, index) => {
                  const value = data.datasets[0]?.data[index] || 0;
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              {data.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dataset.backgroundColor || '#3B82F6' }}
                  />
                  <span className="text-sm text-gray-600">{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No chart data available</p>
            <p className="text-sm text-gray-500 mt-1">Data will appear here when available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}