'use client';

import type { ChartData } from '@/types/dashboard';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface DashboardChartProps {
  data: ChartData | null;
  loading?: boolean;
}

export function DashboardChart({ data, loading = false }: DashboardChartProps) {
  if (loading || !data) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analytics Overview
              </h3>
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
  const maxValue = Math.max(...(data.datasets[0]?.data || [0]));

  return (
    <Card className="shadow-lg border-0 rounded-2xl w-full overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analytics Overview
              </h3>
              <p className="text-sm text-gray-600">Performance metrics over time</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0 overflow-visible">
        {data && data.labels && data.datasets && data.datasets.length > 0 ? (
          <div className="space-y-6">
            {/* Simple Bar Chart */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-default-800">{data.datasets[0]?.label || 'Data'}</h4>
                <span className="text-sm text-default-500">Last 7 days</span>
              </div>
              <div className="grid grid-cols-7 gap-3 items-end h-44">
                {data.labels.map((label, index) => {
                  const value = data.datasets[0]?.data[index] || 0;
                  const percentage =
                    maxValue > 0 ? (value / maxValue) * 100 : 0;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-end h-full"
                    >
                      <div
                        className="w-8 rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 shadow-md"
                        style={{ height: `${percentage}%` }}
                        title={`${label}: ${value}`}
                      />
                      <span className="mt-2 text-xs text-default-500">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">
                  {data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0}
                </div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...(data.datasets[0]?.data || [0]))}
                </div>
                <div className="text-xs text-green-600">Peak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    (data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0) /
                      (data.datasets[0]?.data.length || 1),
                  )}
                </div>
                <div className="text-xs text-purple-600">Average</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No chart data available
          </div>
        )}
      </CardBody>
    </Card>
  );
}
