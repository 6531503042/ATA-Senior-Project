"use client";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { BarChart3Icon, TrendingUpIcon, EyeIcon } from "lucide-react";
import type { ChartData } from "@/types/dashboard";
import { useState } from "react";

interface DashboardChartProps {
  data: ChartData;
}

export function DashboardChart({ data }: DashboardChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxValue = Math.max(
    ...data.datasets[0].data,
    ...data.datasets[1].data
  );

  // Calculate totals and percentages
  const totalProjects = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalSubmissions = data.datasets[1].data.reduce((a, b) => a + b, 0);
  const avgProjects = Math.round(totalProjects / data.datasets[0].data.length);
  const avgSubmissions = Math.round(totalSubmissions / data.datasets[1].data.length);

  return (
    <div className="w-full h-full">
      <Card className="w-full h-full min-h-[600px] border-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-default-100 dark:via-blue-950/50 dark:to-indigo-950/60 shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 px-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              <BarChart3Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-default-900">
                Analytics Overview
              </h3>
              <p className="text-sm text-default-600">
                Monthly performance metrics
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Chip
              variant="flat"
              color="primary"
              startContent={<TrendingUpIcon className="w-4 h-4" />}
              className="font-semibold"
            >
              Avg Projects: {avgProjects}
            </Chip>
            <Chip
              variant="flat"
              color="success"
              startContent={<EyeIcon className="w-4 h-4" />}
              className="font-semibold"
            >
              Avg Submissions: {avgSubmissions}
            </Chip>
          </div>
        </CardHeader>
        
        <CardBody className="px-8 pb-8 flex-1">
          <div className="h-full flex flex-col">
            {/* Chart Area */}
            <div className="relative flex-1 min-h-[350px] flex items-end justify-center gap-6 lg:gap-8 xl:gap-12 p-6 pt-20 pb-6 bg-white/80 dark:bg-default-50/70 rounded-2xl border border-default-200 overflow-hidden">
              {data.datasets[0].data.map((value, index) => {
                const submissionValue = data.datasets[1].data[index];
                const projectHeight = (value / maxValue) * 250;
                const submissionHeight = (submissionValue / maxValue) * 250;
                const isHovered = hoveredIndex === index;
                
                // Smart tooltip positioning to prevent overflow
                const isFirstItem = index === 0;
                const isLastItem = index === data.datasets[0].data.length - 1;
                const tooltipClass = isFirstItem 
                  ? "left-0" 
                  : isLastItem 
                    ? "right-0" 
                    : "left-1/2 transform -translate-x-1/2";
                
                return (
                  <div 
                    key={index} 
                    className="relative flex flex-col items-center gap-3 cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Data tooltip on hover */}
                    {isHovered && (
                      <div className={`absolute -top-16 ${tooltipClass} bg-default-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium z-10 whitespace-nowrap`}>
                        <div>Projects: {value}</div>
                        <div>Submissions: {submissionValue}</div>
                        {/* Arrow pointer */}
                        <div className={`absolute top-full ${isFirstItem ? "left-4" : isLastItem ? "right-4" : "left-1/2 transform -translate-x-1/2"} border-4 border-transparent border-t-default-900`}></div>
                      </div>
                    )}
                    
                    {/* Bars Container */}
                    <div className="flex gap-2 items-end">
                      {/* Projects Bar */}
                      <div
                        className={`w-6 sm:w-8 lg:w-10 rounded-t-lg transition-all duration-500 ease-out shadow-md ${
                          isHovered 
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-blue-300' 
                            : 'bg-gradient-to-t from-blue-500 to-blue-300'
                        }`}
                        style={{
                          height: `${Math.max(projectHeight, 20)}px`,
                          transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)'
                        }}
                      />
                      
                      {/* Submissions Bar */}
                      <div
                        className={`w-6 sm:w-8 lg:w-10 rounded-t-lg transition-all duration-500 ease-out shadow-md ${
                          isHovered 
                            ? 'bg-gradient-to-t from-green-600 to-green-400 shadow-green-300' 
                            : 'bg-gradient-to-t from-green-500 to-green-300'
                        }`}
                        style={{
                          height: `${Math.max(submissionHeight, 20)}px`,
                          transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)'
                        }}
                      />
                    </div>
                    
                    {/* Month Label */}
                    <div className="text-center">
                      <span className={`text-sm font-semibold transition-colors ${
                        isHovered ? 'text-default-900' : 'text-default-600'
                      }`}>
                        {data.labels[index]}
                      </span>
                      {isHovered && (
                        <div className="text-xs text-default-500 mt-1">
                          Total: {value + submissionValue}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend and Stats */}
            <div className="mt-6 pt-6 border-t border-default-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Legend */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-300 rounded shadow-sm"></div>
                    <span className="text-sm font-medium text-default-700">{data.datasets[0].label}</span>
                    <span className="text-xs text-default-500">({totalProjects} total)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-300 rounded shadow-sm"></div>
                    <span className="text-sm font-medium text-default-700">{data.datasets[1].label}</span>
                    <span className="text-xs text-default-500">({totalSubmissions} total)</span>
                  </div>
                </div>
                
                {/* Performance Indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 rounded-full">
                  <TrendingUpIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Performance: +12.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 