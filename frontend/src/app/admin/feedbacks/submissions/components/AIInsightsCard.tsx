import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Rocket, 
  Users, 
  Target, 
  Flag,
  Brain,
  Clock,
  ArrowUp,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import type { AIInsights } from '@/lib/api/submissions';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AIInsightsCardProps {
  insights: AIInsights;
}

// Update the animated background with warmer colors
const AnimatedBackground = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:14px_24px] opacity-50" />
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50" />
  </>
);

const renderInsightSection = (
  title: string,
  confidence: number,
  recommendations: Array<{ text: string; priority: string }>,
  icon: React.ReactNode,
  bgColor: string,
  iconColor: string,
  delay: number
) => {
  // Get the solid color version for priority tags
  const solidColor = iconColor.replace('bg-', 'bg-').replace('500', '600');
  const textColor = iconColor.replace('bg-', 'text-').replace('500', '600');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden backdrop-blur-sm rounded-2xl border border-slate-200 bg-white shadow-lg group"
    >
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl transition-transform group-hover:scale-105",
            bgColor,
            "ring-1 ring-slate-200"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1, delay: delay + 0.2 }}
                  className={cn(
                    "h-full rounded-full shadow-sm",
                    iconColor
                  )}
                />
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                bgColor,
                "ring-1 ring-slate-200"
              )}>
                <Brain className={cn("h-4 w-4", textColor)} />
                <span className={cn("text-sm font-medium", textColor)}>
                  {confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="p-4 space-y-3 bg-slate-50">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.1 * index }}
            className={cn(
              "group/item relative p-4 rounded-xl",
              "bg-white",
              "border border-slate-200",
              "hover:shadow-md transition-all duration-300"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg",
                bgColor,
                "flex items-center justify-center",
                "ring-1 ring-slate-200"
              )}>
                <CheckCircle2 className={cn("h-5 w-5", textColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 mb-2.5 leading-relaxed">
                  {rec.text}
                </p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "inline-flex items-center gap-1.5",
                    "text-xs font-medium px-2.5 py-1.5 rounded-full",
                    solidColor,
                    "text-white",
                    "shadow-sm"
                  )}>
                    <Flag className="h-3.5 w-3.5 text-white" />
                    {rec.priority.toUpperCase()} Priority
                  </span>
                  <ArrowUp className={cn(
                    "h-3.5 w-3.5 transform transition-all duration-300",
                    "opacity-0 group-hover/item:opacity-100",
                    "translate-y-1 group-hover/item:translate-y-0",
                    textColor
                  )} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export function AIInsightsCard({ insights }: AIInsightsCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 p-8 bg-white">
      <AnimatedBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-4 rounded-xl",
            "bg-blue-50",
            "ring-1 ring-blue-200"
          )}>
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {insights.title}
            </h2>
            <p className="text-slate-600 text-sm mt-1.5">
              {insights.description}
            </p>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderInsightSection(
            insights.insights.performanceInsights.title,
            insights.insights.performanceInsights.aiConfidence,
            insights.insights.performanceInsights.recommendations,
            <Rocket className="h-6 w-6 text-blue-600" />,
            "bg-blue-50",
            "bg-blue-500",
            0.2
          )}

          {renderInsightSection(
            insights.insights.engagementAnalysis.title,
            insights.insights.engagementAnalysis.aiConfidence,
            insights.insights.engagementAnalysis.recommendations,
            <Users className="h-6 w-6 text-emerald-600" />,
            "bg-emerald-50",
            "bg-emerald-500",
            0.4
          )}

          {renderInsightSection(
            insights.insights.improvementOpportunities.title,
            insights.insights.improvementOpportunities.aiConfidence,
            insights.insights.improvementOpportunities.recommendations,
            <Target className="h-6 w-6 text-indigo-600" />,
            "bg-indigo-50",
            "bg-indigo-500",
            0.6
          )}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4",
            "rounded-xl",
            "bg-slate-50",
            "border border-slate-200"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-blue-50 ring-1 ring-blue-200"
            )}>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500">Last Updated</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-slate-700">
                  {new Date(insights.metadata.analyzedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-blue-50 ring-1 ring-blue-200"
            )}>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500">Total Submissions</p>
              <p className="text-sm font-medium text-slate-700">
                {insights.metadata.totalSubmissions} submissions analyzed
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
} 