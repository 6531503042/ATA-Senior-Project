"use client";

import React from 'react';
import { TrendingUp, Users } from "lucide-react";

type Props = {
  satisfactionRate?: number;
  totalSubmissions?: number;
};

export default function SatisfactionOverview({ 
  satisfactionRate = 78, 
  totalSubmissions = 324 
}: Props) {

  const getSatisfactionColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-600 bg-emerald-50";
    if (rate >= 60) return "text-blue-600 bg-blue-50";
    return "text-amber-600 bg-amber-50";
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return "from-emerald-400 to-emerald-500";
    if (rate >= 60) return "from-blue-400 to-blue-500";
    return "from-amber-400 to-amber-500";
  };

  const getStatusText = (rate: number) => {
    if (rate >= 80) return "Excellent";
    if (rate >= 70) return "Good";
    if (rate >= 60) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Satisfaction Overview</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{totalSubmissions.toLocaleString()} submissions</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getSatisfactionColor(satisfactionRate)}`}>
            {satisfactionRate}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Satisfaction Meter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Satisfaction Rate</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{satisfactionRate}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{getStatusText(satisfactionRate)}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${getProgressColor(satisfactionRate)}`}
                style={{ width: `${satisfactionRate}%` }}
              />
            </div>
            
            {/* Satisfaction Scale Markers */}
            <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <StatCard
            label="Very Satisfied"
            value={Math.round(satisfactionRate * 0.6)}
            percentage={Math.round((satisfactionRate * 0.6 / satisfactionRate) * 100)}
            color="text-emerald-600 bg-emerald-50"
          />
          <StatCard
            label="Satisfied"
            value={Math.round(satisfactionRate * 0.3)}
            percentage={Math.round((satisfactionRate * 0.3 / satisfactionRate) * 100)}
            color="text-blue-600 bg-blue-50"
          />
          <StatCard
            label="Neutral"
            value={Math.round((100 - satisfactionRate) * 0.7)}
            percentage={Math.round(((100 - satisfactionRate) * 0.7 / 100) * 100)}
            color="text-gray-600 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, percentage, color }: { 
  label: string; 
  value: number; 
  percentage: number;
  color: string;
}) {
  return (
    <div className="text-center space-y-2">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${color} font-bold text-lg`}>
        {value}%
      </div>
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{percentage}% of total</div>
      </div>
    </div>
  );
}