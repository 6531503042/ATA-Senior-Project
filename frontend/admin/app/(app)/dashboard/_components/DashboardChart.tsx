"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { BarChart3Icon } from "lucide-react";
import type { ChartData } from "@/types/dashboard";

interface DashboardChartProps {
  data: ChartData;
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex items-center gap-2 pb-4">
        <BarChart3Icon className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-default-900">
          Analytics Overview
        </h3>
      </CardHeader>
      <CardBody>
        <div className="h-64 flex items-end justify-center gap-4 p-4">
          {data.datasets[0].data.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-1">
                <div
                  className="w-8 bg-blue-500 rounded-t-sm"
                  style={{
                    height: `${(value / Math.max(...data.datasets[0].data)) * 120}px`
                  }}
                />
                <div
                  className="w-8 bg-green-500 rounded-t-sm"
                  style={{
                    height: `${(data.datasets[1].data[index] / Math.max(...data.datasets[1].data)) * 120}px`
                  }}
                />
              </div>
              <span className="text-xs text-default-500 font-medium">
                {data.labels[index]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-default-600">{data.datasets[0].label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-default-600">{data.datasets[1].label}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 