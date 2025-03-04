import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Brain,
  Target,
  Users,
  Clock,
  Download,
  Share2,
  BarChart2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  CalendarClock,
  UserCog,
  MessagesSquare,
  GraduationCap,
  HeartHandshake,
  Zap,
  Rocket,
  ShieldAlert,
  Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface AIInsights {
  feedbackId: number;
  title: string;
  description: string;
  insights: {
    performanceInsights: InsightSection;
    engagementAnalysis: InsightSection;
    improvementOpportunities: InsightSection;
  };
  metadata: {
    totalSubmissions: number;
    analyzedAt: string;
    categories: string[];
    confidence: {
      overall: number;
      performance: number;
      engagement: number;
      improvement: number;
    };
  };
}

interface InsightSection {
  title: string;
  aiConfidence: number;
  recommendations: Array<{
    text: string;
    priority: 'high' | 'medium' | 'low';
    impact: number;
    category: string;
  }>;
}

interface AIInsightsCardProps {
  insights: AIInsights;
}

interface RecommendationProps {
  text: string;
  priority: 'high' | 'medium' | 'low';
  impact?: number;
  category: string;
}

// Add this new component for confidence indicator
const ConfidenceIndicator = ({ value, label }: { value: number; label: string }) => {
  const getColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 70) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-3 cursor-help">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn("h-full rounded-full", getColor(value))}
            />
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            value >= 90 ? "bg-emerald-50 text-emerald-700" : 
            value >= 70 ? "bg-blue-50 text-blue-700" : 
            "bg-amber-50 text-amber-700"
          )}>
            <BarChart2 className="h-3.5 w-3.5" />
            <span>{value.toFixed(1)}%</span>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">AI Confidence: {value.toFixed(1)}%</h4>
          <p className="text-xs text-gray-500">
            {label}
          </p>
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-600">90-100%: High confidence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-600">70-89%: Medium confidence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-600">Below 70%: Consider with caution</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

type CategoryIconMap = {
  'Work Environment': { icon: typeof Briefcase; color: string };
  'Work-Life Balance': { icon: typeof HeartHandshake; color: string };
  'Team Collaboration': { icon: typeof Users; color: string };
  'Project Management': { icon: typeof Workflow; color: string };
  'Communication': { icon: typeof MessagesSquare; color: string };
  'Personal Growth': { icon: typeof GraduationCap; color: string };
  'Time Management': { icon: typeof CalendarClock; color: string };
  'Leadership': { icon: typeof UserCog; color: string };
  'Performance': { icon: typeof Rocket; color: string };
  'Productivity': { icon: typeof Zap; color: string };
  'Risk Management': { icon: typeof ShieldAlert; color: string };
};

const getCategoryIcon = (category: string) => {
  const icons: CategoryIconMap = {
    'Work Environment': { icon: Briefcase, color: 'text-blue-500' },
    'Work-Life Balance': { icon: HeartHandshake, color: 'text-pink-500' },
    'Team Collaboration': { icon: Users, color: 'text-indigo-500' },
    'Project Management': { icon: Workflow, color: 'text-purple-500' },
    'Communication': { icon: MessagesSquare, color: 'text-orange-500' },
    'Personal Growth': { icon: GraduationCap, color: 'text-teal-500' },
    'Time Management': { icon: CalendarClock, color: 'text-cyan-500' },
    'Leadership': { icon: UserCog, color: 'text-violet-500' },
    'Performance': { icon: Rocket, color: 'text-emerald-500' },
    'Productivity': { icon: Zap, color: 'text-yellow-500' },
    'Risk Management': { icon: ShieldAlert, color: 'text-red-500' }
  };

  const defaultIcon = { icon: Target, color: 'text-gray-500' };
  return icons[category as keyof CategoryIconMap] || defaultIcon;
};

const RecommendationCard = ({ 
  recommendation,
  delay 
}: { 
  recommendation: RecommendationProps;
  delay: number;
}) => {
  const getPriorityColor = (priority: string): {
    bg: string;
    text: string;
    border: string;
    icon: string;
    label: string;
    description: string;
  } => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-100',
          icon: 'text-red-500',
          label: 'URGENT',
          description: 'Requires immediate attention'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-100',
          icon: 'text-amber-500',
          label: 'IMPORTANT',
          description: 'Should be addressed soon'
        };
      default:
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
          icon: 'text-emerald-500',
          label: 'CONSIDER',
          description: 'Can be implemented when possible'
        };
    }
  };

  const colors = getPriorityColor(recommendation.priority);
  const categoryName = recommendation.category || 'General';
  const CategoryIcon = getCategoryIcon(categoryName).icon;
  const categoryColor = getCategoryIcon(categoryName).color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "p-4 rounded-xl border",
        colors.bg,
        colors.border,
        "hover:shadow-md transition-all"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <CategoryIcon className={cn("h-4 w-4", categoryColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium mb-2", colors.text)}>
            {recommendation.text}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <HoverCard>
              <HoverCardTrigger>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium cursor-help",
                  colors.bg,
                  colors.text
                )}>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {colors.label}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{colors.label} Priority</p>
                  <p className="text-xs text-gray-500">{colors.description}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
            {recommendation.impact !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white text-xs font-medium text-gray-600">
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                {recommendation.impact.toFixed(0)}% Impact
              </span>
            )}
            <HoverCard>
              <HoverCardTrigger>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white text-xs font-medium text-gray-600 cursor-help">
                  <CategoryIcon className={cn("h-3.5 w-3.5", categoryColor)} />
                  {categoryName}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Category: {categoryName}</p>
                  <p className="text-xs text-gray-500">
                    Recommendations in this category focus on {categoryName.toLowerCase()} improvements.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function AIInsightsCard({ insights }: AIInsightsCardProps) {
  if (!insights) {
    return (
      <Card className="bg-white p-6 shadow-lg rounded-2xl border-0 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
            <p className="text-sm text-gray-500 mt-1">Loading analysis data...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Add default confidence values with proper type checking
  const confidenceMetrics = {
    overall: insights?.metadata?.confidence?.overall ?? 0,
    performance: insights?.metadata?.confidence?.performance ?? 0,
    engagement: insights?.metadata?.confidence?.engagement ?? 0,
    improvement: insights?.metadata?.confidence?.improvement ?? 0
  };

  // Add safe category mapping
  const getCategoryDisplay = (category: string | undefined) => {
    if (!category) return 'General';
    // Convert from backend format to display format
    return category.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Add safe recommendation rendering
  const renderRecommendations = (recommendations: InsightSection['recommendations'] = [], baseDelay: number) => {
    if (!recommendations.length) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">No recommendations available yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <RecommendationCard 
            key={i} 
            recommendation={{
              ...rec,
              category: getCategoryDisplay(rec.category)
            }}
            delay={baseDelay + i * 0.1}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white p-6 shadow-lg rounded-2xl border-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{insights.title || 'AI Insights'}</h2>
            <p className="text-sm text-gray-500 mt-1">{insights.description || 'Analysis of feedback submissions'}</p>
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

      {/* Overall Confidence */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Overall AI Confidence</h3>
          <span className="text-sm text-gray-500">
            Based on {insights.metadata?.totalSubmissions || 0} submissions
          </span>
        </div>
        <ConfidenceIndicator 
          value={confidenceMetrics.overall}
          label="Overall confidence score based on data quality, patterns, and consistency across all analyzed submissions."
        />
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Insights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Performance Insights</h3>
            <ConfidenceIndicator 
              value={confidenceMetrics.performance}
              label="Confidence in performance-related insights and recommendations."
            />
          </div>
          {renderRecommendations(insights.insights?.performanceInsights?.recommendations, 0.2)}
        </div>

        {/* Engagement Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Engagement Analysis</h3>
            <ConfidenceIndicator 
              value={confidenceMetrics.engagement}
              label="Confidence in engagement-related insights and recommendations."
            />
          </div>
          {renderRecommendations(insights.insights?.engagementAnalysis?.recommendations, 0.4)}
        </div>

        {/* Improvement Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Improvement Opportunities</h3>
            <ConfidenceIndicator 
              value={confidenceMetrics.improvement}
              label="Confidence in improvement-related insights and recommendations."
            />
          </div>
          {renderRecommendations(insights.insights?.improvementOpportunities?.recommendations, 0.6)}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">
              {insights.metadata?.analyzedAt ? 
                new Date(insights.metadata.analyzedAt).toLocaleDateString() :
                'Not available'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Submissions</p>
            <p className="text-sm font-medium text-gray-900">
              {insights.metadata?.totalSubmissions || 0} analyzed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Target className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-sm font-medium text-gray-900">
              {insights.metadata?.categories?.length || 0} analyzed
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
} 