"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@components/ui/card";
import {
  BarChart2,
  Download,
  Users,
  ThumbsUp,
  ThumbsDown,
  Meh,
} from "lucide-react";
import { motion } from "framer-motion";
import { getSatisfactionAnalysis } from "@/app/lib/api/submissions";
import type { SatisfactionAnalysisResponse } from "@/app/lib/api/submissions";

interface SatisfactionDashboardProps {
  feedbackId: number;
}

const SatisfactionDashboard = ({ feedbackId }: SatisfactionDashboardProps) => {
  const [data, setData] = useState<SatisfactionAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSatisfactionAnalysis(feedbackId);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [feedbackId]);

  if (loading)
    return (
      <Card className="p-8 flex justify-center items-center">
        <div className="animate-pulse">Loading satisfaction data...</div>
      </Card>
    );

  if (error)
    return (
      <Card className="p-8 bg-red-50 border-red-200">
        <div className="text-red-600">Error: {error}</div>
      </Card>
    );

  if (!data)
    return (
      <Card className="p-8">
        <div>No satisfaction data available</div>
      </Card>
    );

  // Ensure satisfaction rate is a valid number
  const satisfactionRate = isNaN(data.satisfactionOverview.satisfactionRate)
    ? 0
    : data.satisfactionOverview.satisfactionRate;

  return (
    <Card className="bg-white p-6 shadow-lg rounded-2xl border-0 overflow-hidden relative">
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
                Satisfaction Dashboard
              </h2>
              <p className="text-sm text-gray-500">
                Feedback satisfaction analysis and sentiment distribution
              </p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>

        {/* Satisfaction Overview */}
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Satisfaction Overview
          </h3>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-violet-700">
                {satisfactionRate.toFixed(1)}%
              </p>
              <p className="text-sm text-violet-600">
                Based on {data.satisfactionOverview.totalSubmissions}{" "}
                submissions
              </p>
            </div>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="p-4 rounded-xl bg-white border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sentiment Distribution
          </h3>
          <div className="space-y-4">
            <SentimentBar
              label="Positive"
              percentage={
                isNaN(data.sentimentDistribution.positive.percentage)
                  ? 0
                  : data.sentimentDistribution.positive.percentage
              }
              emoji={data.sentimentDistribution.positive.emoji}
              icon={ThumbsUp}
              color="bg-green-500"
            />
            <SentimentBar
              label="Neutral"
              percentage={
                isNaN(data.sentimentDistribution.neutral.percentage)
                  ? 0
                  : data.sentimentDistribution.neutral.percentage
              }
              emoji={data.sentimentDistribution.neutral.emoji}
              icon={Meh}
              color="bg-gray-500"
            />
            <SentimentBar
              label="Negative"
              percentage={
                isNaN(data.sentimentDistribution.negative.percentage)
                  ? 0
                  : data.sentimentDistribution.negative.percentage
              }
              emoji={data.sentimentDistribution.negative.emoji}
              icon={ThumbsDown}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Suggested Improvements
          </h3>
          <ul className="space-y-2">
            {data.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Card>
  );
};

interface SentimentBarProps {
  label: string;
  percentage: number;
  emoji: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const SentimentBar = ({
  label,
  percentage,
  emoji,
  icon: Icon,
  color,
}: SentimentBarProps) => {
  // Ensure percentage is a valid number
  const validPercentage = isNaN(percentage) ? 0 : percentage;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{emoji}</span>
        </div>
        <span className="text-sm font-bold">{validPercentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${validPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default SatisfactionDashboard;
