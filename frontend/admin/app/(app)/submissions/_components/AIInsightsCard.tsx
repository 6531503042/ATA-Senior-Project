"use client";

import React from 'react';
import { Download, Share2, TrendingUp, Users, Zap } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  confidence?: {
    overall: number;
    performance: number;
    engagement: number;
    improvement: number;
  };
};

export default function AIInsightsCard({
  title = "AI Insights",
  description = "Analysis of feedback submissions",
  confidence = { overall: 78, performance: 82, engagement: 74, improvement: 69 },
}: Props) {
  const getConfidenceColor = (value: number) => {
    if (value >= 80) return "text-emerald-600 bg-emerald-50";
    if (value >= 60) return "text-blue-600 bg-blue-50";
    return "text-amber-600 bg-amber-50";
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-emerald-500";
    if (value >= 60) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Confidence</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(confidence.overall)}`}>
              {confidence.overall}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(confidence.overall)}`}
              style={{ width: `${confidence.overall}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6">
          <MetricCard 
            label="Performance" 
            value={confidence.performance}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard 
            label="Engagement" 
            value={confidence.engagement}
            icon={<Users className="w-4 h-4" />}
          />
          <MetricCard 
            label="Improvement" 
            value={confidence.improvement}
            icon={<Zap className="w-4 h-4" />}
          />
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Key Recommendations</h4>
          <div className="space-y-3">
            <RecommendationItem 
              text="Clarify onboarding checklist"
              priority="High"
              priorityColor="bg-red-50 text-red-700 border-red-100"
            />
            <RecommendationItem 
              text="Improve cross-team communication"
              priority="Medium"
              priorityColor="bg-blue-50 text-blue-700 border-blue-100"
            />
            <RecommendationItem 
              text="Refine feedback form copy"
              priority="Low"
              priorityColor="bg-gray-50 text-gray-600 border-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const getColor = (val: number) => {
    if (val >= 80) return "text-emerald-600";
    if (val >= 60) return "text-blue-600";
    return "text-amber-600";
  };

  const getBgColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 60) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center text-gray-400 mb-1">
        {icon}
      </div>
      <div className={`text-2xl font-bold ${getColor(value)}`}>
        {value}%
      </div>
      <div className="text-xs text-gray-500 font-medium">
        {label}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getBgColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationItem({ text, priority, priorityColor }: { text: string; priority: string; priorityColor: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{text}</span>
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityColor}`}>
        {priority}
      </span>
    </div>
  );
}