'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart2, 
  Download, 
  ChevronUp,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SatisfactionAnalysis } from '@/lib/api/submissions';

interface SatisfactionOverviewProps {
  analysis: SatisfactionAnalysis;
}

const SentimentCard = ({ emoji, percentage, label, color, icon: Icon }: {
  emoji: string;
  percentage: number;
  label: string;
  color: 'green' | 'gray' | 'red';
  icon: React.ElementType;
}) => {
  const colors = {
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      progress: 'bg-emerald-500',
      icon: 'text-emerald-600'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      progress: 'bg-gray-400',
      icon: 'text-gray-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-100',
      progress: 'bg-red-500',
      icon: 'text-red-600'
    }
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border",
        colors.bg,
        colors.border,
        "hover:shadow-md transition-all duration-300"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-xl",
        colors.bg,
        "flex items-center justify-center relative group"
      )}>
        <Icon className={cn("h-6 w-6 absolute", colors.icon, "group-hover:opacity-0 transition-opacity")} />
        <span className="text-2xl absolute opacity-0 group-hover:opacity-100 transition-opacity">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={cn("font-medium", colors.text)}>{label}</span>
          <span className={cn("font-bold", colors.text)}>{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn(
              "h-full rounded-full",
              colors.progress,
              "shadow-lg"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

export function SatisfactionOverview({ analysis }: SatisfactionOverviewProps) {
  const { satisfactionOverview, sentimentDistribution, suggestions } = analysis;

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
            <div className="p-3 bg-violet-100 rounded-xl">
              <BarChart2 className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Satisfaction Overview</h2>
              <p className="text-sm text-gray-500">Year-over-year satisfaction analysis and sentiment distribution</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Users className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-violet-600 font-medium">Total Responses</p>
                <p className="text-lg font-bold text-violet-700">{satisfactionOverview.totalSubmissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Satisfaction Rate */}
          <div className="flex flex-col items-center p-4 md:p-8 rounded-2xl bg-white shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Overall Satisfaction</h3>
            <div className="relative w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-violet-600 mb-2">
                  {(satisfactionOverview.satisfactionRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Satisfaction Rate</div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <ChevronUp className="h-4 w-4 text-emerald-600" />
                  <div className="text-sm">
                    <span className="font-medium text-emerald-600">+2.5%</span>
                    <span className="text-gray-500 ml-1">vs Last Month</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">30 Days</span>
                    <span className="text-gray-500 ml-1">Analysis Period</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Sentiment Distribution</h3>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="space-y-4">
              <SentimentCard
                emoji={sentimentDistribution.positive.emoji}
                percentage={sentimentDistribution.positive.percentage}
                label={sentimentDistribution.positive.label}
                color="green"
                icon={ThumbsUp}
              />
              <SentimentCard
                emoji={sentimentDistribution.neutral.emoji}
                percentage={sentimentDistribution.neutral.percentage}
                label={sentimentDistribution.neutral.label}
                color="gray"
                icon={Meh}
              />
              <SentimentCard
                emoji={sentimentDistribution.negative.emoji}
                percentage={sentimentDistribution.negative.percentage}
                label={sentimentDistribution.negative.label}
                color="red"
                icon={ThumbsDown}
              />
            </div>
          </div>
        </div>

        {/* Suggestions */}
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
              <h3 className="text-lg font-semibold text-gray-900">Key Suggestions</h3>
            </div>
            <span className="text-sm text-gray-500">{suggestions.length} suggestions</span>
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
      </motion.div>
    </Card>
  );
} 