import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, Rocket, Users, Target, Flag } from 'lucide-react';
import type { AIInsights } from '@/lib/api/submissions';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AIInsightsCardProps {
  insights: AIInsights;
}

export function AIInsightsCard({ insights }: AIInsightsCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-50/80',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: 'text-red-500',
          ring: 'ring-red-500/20',
          gradient: 'from-red-50/50 to-red-100/50'
        };
      case 'medium':
        return {
          bg: 'bg-orange-50/80',
          text: 'text-orange-700',
          border: 'border-orange-200',
          icon: 'text-orange-500',
          ring: 'ring-orange-500/20',
          gradient: 'from-orange-50/50 to-orange-100/50'
        };
      case 'low':
        return {
          bg: 'bg-green-50/80',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: 'text-green-500',
          ring: 'ring-green-500/20',
          gradient: 'from-green-50/50 to-green-100/50'
        };
      default:
        return {
          bg: 'bg-gray-50/80',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'text-gray-500',
          ring: 'ring-gray-500/20',
          gradient: 'from-gray-50/50 to-gray-100/50'
        };
    }
  };

  const renderInsightSection = (
    title: string,
    confidence: number,
    recommendations: Array<{ text: string; priority: string }>,
    icon: React.ReactNode,
    bgColor: string,
    iconColor: string,
    delay: number
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-4 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl", bgColor)}>
            {icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1, delay: delay + 0.2 }}
                  className={cn("h-full rounded-full", iconColor)}
                />
              </div>
              <span className="text-sm text-gray-500">
                {confidence.toFixed(1)}% Confidence
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const colors = getPriorityColor(rec.priority);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 * index }}
              className={cn(
                "relative p-4 rounded-xl border transition-all",
                "hover:shadow-md hover:scale-[1.02]",
                colors.bg,
                colors.border,
                colors.ring,
                "bg-gradient-to-br",
                colors.gradient
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-1", colors.icon)}>
                  <Flag className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", colors.text)}>
                    {rec.text}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      colors.bg,
                      colors.text,
                      "border",
                      colors.border
                    )}>
                      {rec.priority.toUpperCase()} Priority
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <Card className="bg-white p-6 shadow-lg rounded-2xl border-0 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 relative"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-100 rounded-xl">
            <Lightbulb className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{insights.title}</h2>
            <p className="text-sm text-gray-500">{insights.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {renderInsightSection(
            insights.insights.performanceInsights.title,
            insights.insights.performanceInsights.aiConfidence,
            insights.insights.performanceInsights.recommendations,
            <Rocket className="h-5 w-5 text-blue-600" />,
            "bg-blue-50",
            "bg-blue-500",
            0.2
          )}

          {renderInsightSection(
            insights.insights.engagementAnalysis.title,
            insights.insights.engagementAnalysis.aiConfidence,
            insights.insights.engagementAnalysis.recommendations,
            <Users className="h-5 w-5 text-emerald-600" />,
            "bg-emerald-50",
            "bg-emerald-500",
            0.4
          )}

          {renderInsightSection(
            insights.insights.improvementOpportunities.title,
            insights.insights.improvementOpportunities.aiConfidence,
            insights.insights.improvementOpportunities.recommendations,
            <Target className="h-5 w-5 text-purple-600" />,
            "bg-purple-50",
            "bg-purple-500",
            0.6
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-6 border-t border-gray-100"
        >
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Total Submissions: {insights.metadata.totalSubmissions}</span>
            <span>Last Updated: {new Date(insights.metadata.analyzedAt).toLocaleDateString()}</span>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
} 