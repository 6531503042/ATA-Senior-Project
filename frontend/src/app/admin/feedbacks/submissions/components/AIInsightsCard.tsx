import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Rocket, 
  Users, 
  Target, 
  Flag,
  Brain,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  Share2,
  BarChart2,
  Zap,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import type { AIInsights } from '@/lib/api/submissions';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface AIInsightsCardProps {
  insights: AIInsights;
}

// Animated background with subtle grid pattern
const AnimatedBackground = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:14px_24px] opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-slate-50/40" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
  </>
);

// Confidence indicator with tooltip
const ConfidenceIndicator = ({ value, color }: { value: number; color: string }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="flex items-center gap-3 cursor-help">
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full shadow-sm",
              color
            )}
          />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
          value >= 90 ? "bg-emerald-50 text-emerald-700" : 
          value >= 70 ? "bg-blue-50 text-blue-700" : 
          "bg-amber-50 text-amber-700",
          "ring-1 ring-slate-200"
        )}>
          <BarChart2 className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80 p-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">AI Confidence Score: {value.toFixed(1)}%</h4>
        <p className="text-xs text-slate-500">
          This score represents the AI&apos;s confidence level in these recommendations based on analyzed data patterns, team feedback, and industry best practices.
        </p>
        <div className="pt-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-slate-600">90-100%: High confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-slate-600">70-89%: Medium confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-xs text-slate-600">Below 70%: Consider with caution</span>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

// Priority badge with appropriate styling
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityStyles = () => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          bg: "bg-red-600",
          text: "text-white",
          icon: <Zap className="h-3.5 w-3.5" />
        };
      case 'medium':
        return {
          bg: "bg-amber-500",
          text: "text-white",
          icon: <Flag className="h-3.5 w-3.5" />
        };
      case 'low':
        return {
          bg: "bg-emerald-500",
          text: "text-white",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />
        };
      default:
        return {
          bg: "bg-slate-500",
          text: "text-white",
          icon: <Info className="h-3.5 w-3.5" />
        };
    }
  };

  const styles = getPriorityStyles();
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5",
      "text-xs font-medium px-2.5 py-1.5 rounded-full",
      styles.bg,
      styles.text,
      "shadow-sm"
    )}>
      {styles.icon}
      {priority.toUpperCase()} Priority
    </span>
  );
};

// Insight section with expandable recommendations
const InsightSection = ({ 
  title, 
  confidence, 
  recommendations, 
  icon, 
  bgColor, 
  iconColor, 
  textColor,
  delay 
}: { 
  title: string;
  confidence: number;
  recommendations: Array<{ text: string; priority: string }>;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  textColor: string;
  delay: number;
}) => {
  const [expanded, setExpanded] = useState(true);
  
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
            "p-3.5 rounded-xl transition-transform group-hover:scale-105",
            bgColor,
            "ring-1 ring-slate-200 shadow-sm"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setExpanded(!expanded)}
              >
                <ChevronDown className={cn(
                  "h-5 w-5 text-slate-400 transition-transform",
                  expanded ? "transform rotate-180" : ""
                )} />
              </Button>
            </div>
            <ConfidenceIndicator value={confidence} color={iconColor} />
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {expanded && (
        <div className="p-5 space-y-4 bg-slate-50/80">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 * index }}
              className={cn(
                "group/item relative p-5 rounded-xl",
                "bg-white",
                "border border-slate-200",
                "hover:shadow-md transition-all duration-300",
                "hover:border-slate-300"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-lg",
                  bgColor,
                  "flex items-center justify-center",
                  "ring-1 ring-slate-200 shadow-sm"
                )}>
                  <Lightbulb className={cn("h-5 w-5", textColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 mb-3 leading-relaxed">
                    {rec.text}
                  </p>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={rec.priority} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: delay + 0.2 + 0.1 * index }}
                      className="flex items-center gap-1.5 text-xs text-slate-500"
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Recommended by AI</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-xl",
              "bg-blue-50",
              "ring-1 ring-blue-200 shadow-sm"
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
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border border-slate-200 bg-gradient-to-br from-blue-50/30 to-blue-100/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Rocket className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-700">Performance</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {insights.insights.performanceInsights.aiConfidence.toFixed(0)}%
              </span>
              <span className="text-sm text-slate-500">confidence</span>
            </div>
            <div className="mt-2">
              <Progress 
                value={insights.insights.performanceInsights.aiConfidence} 
                className="h-1.5 bg-blue-100"
              />
            </div>
          </Card>
          
          <Card className="p-4 border border-slate-200 bg-gradient-to-br from-emerald-50/30 to-emerald-100/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-700">Engagement</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {insights.insights.engagementAnalysis.aiConfidence.toFixed(0)}%
              </span>
              <span className="text-sm text-slate-500">confidence</span>
            </div>
            <div className="mt-2">
              <Progress 
                value={insights.insights.engagementAnalysis.aiConfidence} 
                className="h-1.5 bg-emerald-100"
              />
            </div>
          </Card>
          
          <Card className="p-4 border border-slate-200 bg-gradient-to-br from-indigo-50/30 to-indigo-100/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-700">Improvement</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {insights.insights.improvementOpportunities.aiConfidence.toFixed(0)}%
              </span>
              <span className="text-sm text-slate-500">confidence</span>
            </div>
            <div className="mt-2">
              <Progress 
                value={insights.insights.improvementOpportunities.aiConfidence} 
                className="h-1.5 bg-indigo-100"
              />
            </div>
          </Card>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InsightSection
            title={insights.insights.performanceInsights.title}
            confidence={insights.insights.performanceInsights.aiConfidence}
            recommendations={insights.insights.performanceInsights.recommendations}
            icon={<Rocket className="h-6 w-6 text-blue-600" />}
            bgColor="bg-blue-50"
            iconColor="bg-blue-500"
            textColor="text-blue-600"
            delay={0.2}
          />

          <InsightSection
            title={insights.insights.engagementAnalysis.title}
            confidence={insights.insights.engagementAnalysis.aiConfidence}
            recommendations={insights.insights.engagementAnalysis.recommendations}
            icon={<Users className="h-6 w-6 text-emerald-600" />}
            bgColor="bg-emerald-50"
            iconColor="bg-emerald-500"
            textColor="text-emerald-600"
            delay={0.4}
          />

          <InsightSection
            title={insights.insights.improvementOpportunities.title}
            confidence={insights.insights.improvementOpportunities.aiConfidence}
            recommendations={insights.insights.improvementOpportunities.recommendations}
            icon={<Target className="h-6 w-6 text-indigo-600" />}
            bgColor="bg-indigo-50"
            iconColor="bg-indigo-500"
            textColor="text-indigo-600"
            delay={0.6}
          />
        </div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">About AI Insights</h4>
              <p className="text-xs text-blue-700 mt-1">
                These insights are generated using machine learning algorithms that analyze patterns across all feedback submissions.
                The recommendations are prioritized based on potential impact and implementation feasibility.
              </p>
            </div>
          </div>
        </motion.div>

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