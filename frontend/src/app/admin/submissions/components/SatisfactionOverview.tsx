"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart2,
  Download,
  Users,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SatisfactionMeter from "./SatisfactionMeterBar";

interface SatisfactionOverviewProps {
  analysis: {
    satisfactionOverview: {
      overallSatisfaction: number;
      satisfactionRate: number;
      totalSubmissions: number;
      previousPeriod?: {
        satisfactionRate: number;
        totalSubmissions: number;
      };
    };
    sentimentDistribution: {
      positive: {
        percentage: number;
        emoji: string;
        label: string;
      };
      neutral: {
        percentage: number;
        emoji: string;
        label: string;
      };
      negative: {
        percentage: number;
        emoji: string;
        label: string;
      };
    };
    suggestions: string[];
  };
}

const SentimentDistributionCard = ({
  emoji,
  percentage,
  label,
  color,
}: {
  emoji: string;
  percentage: number;
  label: string;
  color: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="relative group cursor-pointer">
        <span className="text-6xl block mb-4 transform group-hover:scale-110 transition-transform">
          {emoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p
        className={cn(
          "text-2xl font-bold mb-1",
          color === "positive"
            ? "text-emerald-600"
            : color === "neutral"
            ? "text-gray-600"
            : "text-red-600"
        )}
      >
        {percentage.toFixed(1)}%
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  );
};

export function SatisfactionOverview({ analysis }: SatisfactionOverviewProps) {
  const { satisfactionOverview, sentimentDistribution, suggestions } = analysis;

  // Ensure satisfaction rate is between 0 and 100
  const normalizedSatisfactionRate = Math.min(
    Math.max(satisfactionOverview.satisfactionRate * 100, 0),
    100
  );

  return (
    <Card className="bg-white p-4 md:p-6 shadow-lg rounded-2xl border-0 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 md:space-y-8 relative"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-sm">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Satisfaction Overview
              </h2>
              <p className="text-sm text-gray-500">
                Year-over-year satisfaction analysis and sentiment distribution
              </p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Users className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-violet-600 font-medium">
                  Total Responses
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-violet-700">
                    {satisfactionOverview.totalSubmissions}
                  </p>
                  <span className="text-xs text-emerald-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 md:gap-12">
          {/* Satisfaction Rate */}
          <div className="flex flex-col items-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-white to-violet-50/20 shadow-md shadow-slate-300 border border-slate-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overall Satisfaction
            </h3>
            <SatisfactionMeter
              percentage={normalizedSatisfactionRate}
              previousYear={
                satisfactionOverview.previousPeriod?.satisfactionRate || 0
              }
            />
          </div>

          {/* Sentiment Distribution */}
          <div className="flex flex-col p-4 md:p-8 shadow-md shadow-slate-300 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 w-full flex justify-center">
              Sentiment Distribution
            </h3>
            <div className="h-full flex items-center justify-center">
              <div className="flex gap-4 flex-row h-max w-full">
                <SentimentDistributionCard
                  emoji="😃"
                  percentage={sentimentDistribution.positive.percentage}
                  label="Positive"
                  color="positive"
                />
                <SentimentDistributionCard
                  emoji="😐"
                  percentage={sentimentDistribution.neutral.percentage}
                  label="Neutral"
                  color="neutral"
                />
                <SentimentDistributionCard
                  emoji="😞"
                  percentage={sentimentDistribution.negative.percentage}
                  label="Negative"
                  color="negative"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4 pt-6 border-t"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Key Suggestions
                </h3>
              </div>
              <span className="text-sm text-gray-500">
                {suggestions.length} suggestions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50/50 rounded-xl border border-yellow-100 text-sm text-gray-700 hover:shadow-md transition-all duration-300"
                >
                  {suggestion}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}
