'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  AlertCircle,
  Search,
  Loader2,
  ArrowLeft,
  Brain,
  BarChart2,
  Target,
  Sparkles,
  Zap,
  Smile,
  MessageCircle,
  ChartBar,
  Cpu,
  LineChart,
  PieChart,
  Activity,
  Star,
  Unlock,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { 
  SubmissionResponse,
  FeedbackAnalysis,
  SatisfactionAnalysis,
  AIInsights as ImportedAIInsights,
  Analysis as ImportedAnalysis
} from '@/lib/api/submissions';
import { getFeedbackData } from '@/lib/api/submissions';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tabs,
  TabsContent,
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { SubmissionDetails } from '../components/SubmissionDetails';
import { SatisfactionOverview } from '../components/SatisfactionOverview';
import { AIInsightsCard } from '../components/AIInsightsCard';
import { 
  SubmissionDetailsSkeleton, 
  MetricCardSkeleton, 
  InsightCardSkeleton 
} from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cacheManager } from '@/lib/cache';

// Type definitions
interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string | null;
  color?: 'violet' | 'blue' | 'green' | 'yellow';
}

interface InsightCardProps {
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string | number;
    change?: string;
  }>;
  recommendations: Array<{
    text: string;
    priority: string;
  }>;
  icon: React.ElementType;
  color?: 'violet' | 'blue' | 'green';
}

interface SubmissionListItemProps {
  submission: SubmissionResponse;
  isSelected: boolean;
  onClick: () => void;
}

//Unused file
interface CacheManager {
  setFeedbackData: (feedbackId: number, data: Partial<FeedbackCache>) => void;
  getFeedbackData: (feedbackId: number) => FeedbackCache | null;
  clearCache: (feedbackId?: number) => void;
  isCacheValid: (feedbackId: number) => boolean;
  shouldBackgroundUpdate: (feedbackId: number) => boolean;
}

interface FeedbackCache {
  submissions: SubmissionResponse[];
  analysis: FeedbackAnalysis | null;
  satisfaction: SatisfactionAnalysis | null;
  insights: AIInsights | null;
}

interface AIInsightsRecommendation {
  text: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  category: string;
}

interface AIInsightSection {
  title: string;
  aiConfidence: number;
  recommendations: AIInsightsRecommendation[];
}

interface AIInsights extends Omit<ImportedAIInsights, 'insights'> {
  insights: {
    performanceInsights: AIInsightSection;
    engagementAnalysis: AIInsightSection;
    improvementOpportunities: AIInsightSection;
  };
}

const SubmissionListItem = ({ submission, isSelected, onClick }: SubmissionListItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200",
          isSelected
            ? "border-violet-200 shadow-lg shadow-violet-100/50 bg-violet-50/30"
            : "hover:border-violet-200 hover:shadow-md"
        )}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-violet-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                Submission #{submission.submission.id}
              </h3>
            </div>
            <Badge className={cn(
              "flex items-center gap-1.5",
              submission.submission.privacyLevel === 'PUBLIC' 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            )}>
              {submission.submission.privacyLevel === 'PUBLIC' ? (
                <Unlock className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              {submission.submission.privacyLevel}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(submission.submission.submittedAt), 'PPP')}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {submission.submission.submittedBy ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <User className="h-3.5 w-3.5" />
                  <span>User #{submission.submission.submittedBy}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <User className="h-3.5 w-3.5" />
                  <span>Anonymous</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Beautiful animated progress ring component
const ProgressRing = ({ value, size = 120, strokeWidth = 8 }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <motion.circle
          className="text-violet-500"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  );
};

// Beautiful stat card with hover effects
const StatCard = ({ title, value, icon: Icon, change, color = "violet" }: StatCardProps) => {
  const colors = {
    violet: "from-violet-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-emerald-500 to-teal-600",
    yellow: "from-amber-500 to-yellow-600"
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <motion.div
          whileHover={{ y: -4 }}
          className="relative p-6 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full"
            style={{ background: `conic-gradient(from 90deg at 40% 40%, ${colors[color]})` }}
          />

          <div className="relative flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br shadow-lg",
              colors[color]
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {change && (
                  <Badge className="bg-emerald-50 text-emerald-700">
                    {change}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">
            View detailed metrics and trends for this indicator.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

// Beautiful insights card with animations
const InsightCard = ({ title, description, metrics, recommendations, icon: Icon, color = "violet" }: InsightCardProps) => {
  const colors = {
    violet: {
      light: "bg-violet-50",
      border: "border-violet-100",
      text: "text-violet-700",
      gradient: "from-violet-500 to-purple-600"
    },
    blue: {
      light: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      gradient: "from-blue-500 to-cyan-600"
    },
    green: {
      light: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      gradient: "from-emerald-500 to-teal-600"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-6 rounded-2xl bg-white shadow-lg border",
        colors[color].border
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-br shadow-lg",
          colors[color].gradient
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className={cn(
            "p-4 rounded-xl",
            colors[color].light
          )}>
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className={cn(
                "text-2xl font-bold",
                colors[color].text
              )}>{metric.value}</span>
              {metric.change && (
                <Badge className={cn(
                  "bg-white",
                  colors[color].text
                )}>
                  {metric.change}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Key Recommendations</h4>
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-xl flex items-start gap-3",
              colors[color].light
            )}
          >
            <div className="p-2 bg-white rounded-lg">
              <Zap className={cn("h-4 w-4", colors[color].text)} />
            </div>
            <div>
              <p className={cn("text-sm", colors[color].text)}>{rec.text}</p>
              <Badge className={cn(
                "mt-2 bg-white",
                colors[color].text
              )}>
                {rec.priority} Priority
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Add loading components
function LoadingMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <MetricCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

function LoadingInsights() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <InsightCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Add this new component for no submissions state
function NoSubmissionsState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="p-4 bg-amber-50 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h2>
      <p className="text-gray-500 max-w-md mb-6">
        This feedback form hasn&apos;t received any submissions yet. Please wait for participants to submit their responses.
      </p>
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="bg-white"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Go Back
      </Button>
    </div>
  );
}

// Add this new component for unified loading state
function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-12 w-12 bg-gray-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse p-6 bg-white rounded-xl border">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-[200px] bg-gray-200 rounded-xl" />
        <div className="h-[300px] bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function FeedbackSubmissionPage({ params }: { params: Promise<{ feedbackId: string }> }) {
  const resolvedParams = use(params);
  const feedbackId = parseInt(resolvedParams.feedbackId);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [satisfactionAnalysis, setSatisfactionAnalysis] = useState<SatisfactionAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cached data immediately and setup background refresh if needed
  useEffect(() => {
    const loadCachedData = () => {
      const cachedData = cacheManager.getFeedbackData(feedbackId);
      if (cachedData?.submissions) {
        // Validate that cached submissions belong to current feedback ID
        const validSubmissions = cachedData.submissions.filter(
          sub => sub.submission.feedbackId === feedbackId
        );
        
        if (validSubmissions.length > 0) {
          setSubmissions(validSubmissions);
          setSatisfactionAnalysis(cachedData.satisfaction);
          setAiInsights(cachedData.insights as AIInsights);
          setIsLoading(false);

          // If cache is getting old, trigger a background refresh
          if (cacheManager.shouldBackgroundUpdate(feedbackId)) {
            refreshDataInBackground();
          }
        } else {
          // Clear invalid cache
          cacheManager.clearCache(feedbackId);
        }
      }
    };

    const refreshDataInBackground = async () => {
      try {
        const data = await getFeedbackData(feedbackId);
        
        // Only update if we got valid data
        if (data.submissions?.length > 0) {
          // Validate submissions belong to current feedback ID
          const validSubmissions = data.submissions.filter(
            sub => sub.submission.feedbackId === feedbackId
          );

          if (validSubmissions.length > 0) {
            setSubmissions(validSubmissions);
            setSatisfactionAnalysis(data.satisfaction as unknown as SatisfactionAnalysis);
            setAiInsights(data.insights as unknown as AIInsights);

            // Update cache with fresh data
            cacheManager.setFeedbackData(feedbackId, {
              submissions: validSubmissions,
              analysis: data.analysis as unknown as FeedbackAnalysis,
              satisfaction: data.satisfaction as unknown as SatisfactionAnalysis,
              insights: data.insights as unknown as AIInsights
            });
          }
        }
      } catch (err) {
        // Don't show error toast for background updates
        console.warn('Background refresh failed:', err);
      }
    };

    loadCachedData();
  }, [feedbackId]);

  // Fetch fresh data only if no cache or explicitly refreshing
  useEffect(() => {
    const fetchData = async () => {
      // Skip if we're not refreshing and have valid cache
      if (!isRefreshing && cacheManager.isCacheValid(feedbackId)) {
        return;
      }

      try {
        setError(null);
        const data = await getFeedbackData(feedbackId);

        // Validate submissions belong to current feedback ID
        const validSubmissions = data.submissions?.filter(
          sub => sub.submission.feedbackId === feedbackId
        ) || [];

        // Check if there are any submissions
        if (validSubmissions.length === 0) {
          setError('no-submissions');
          // Clear any existing submissions
          setSubmissions([]);
          setSatisfactionAnalysis(null);
          setAiInsights(null);
          return;
        }

        // Update state with fresh data
        setSubmissions(validSubmissions);
        setSatisfactionAnalysis(data.satisfaction as unknown as SatisfactionAnalysis);
        setAiInsights(data.insights as unknown as AIInsights);

        // Cache the valid data
        cacheManager.setFeedbackData(feedbackId, {
          submissions: validSubmissions,
          analysis: data.analysis as unknown as FeedbackAnalysis,
          satisfaction: data.satisfaction as unknown as SatisfactionAnalysis,
          insights: data.insights as unknown as AIInsights
        });

        // Set first submission as selected if none selected
        if (validSubmissions.length > 0 && !selectedSubmissionId) {
          setSelectedSubmissionId(validSubmissions[0].submission.id);
        }

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error('Failed to fetch data:', errorMessage);
        setError(errorMessage);
        
        // Show error toast only if we don't have cached data
        if (!cacheManager.getFeedbackData(feedbackId)) {
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchData();
  }, [feedbackId, isRefreshing, selectedSubmissionId, toast]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    cacheManager.clearCache(feedbackId);
  };

  // Show appropriate state based on loading and error
  if (isLoading && !cacheManager.getFeedbackData(feedbackId)) {
    return <LoadingState />;
  }

  if (error === 'no-submissions') {
    return <NoSubmissionsState />;
  }

  const filteredSubmissions = submissions.filter(submission =>
    submission.submission.id.toString().includes(searchQuery) ||
    (submission.submission.submittedBy?.toString() || '').includes(searchQuery)
  );

  const selectedSubmission = submissions.find(
    sub => sub.submission.id === selectedSubmissionId
  );

  const analyzedCount = submissions.filter(s => 
    s.analysis !== null && s.analysis !== undefined
  ).length;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mx-auto"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-gray-50/50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Page Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 rounded-xl blur-lg opacity-20" />
                <div className="relative p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  Feedback Analysis Dashboard
                </h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <span>Comprehensive insights for feedback #{feedbackId}</span>
                  <Badge className="bg-violet-100 text-violet-700">
                    {submissions.length} Submissions
                  </Badge>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="gap-2 hover:bg-violet-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Sparkles className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
              </Button>
            </div>
          </div>

          {/* Quick Stats with loading states */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard
              title="Total Submissions"
              value={isRefreshing ? '...' : submissions.length}
              icon={MessageCircle}
              change={isRefreshing ? null : "+12%"}
              color="violet"
            />
            <StatCard
              title="Analysis Status"
              value={isRefreshing ? '...' : `${analyzedCount}/${submissions.length}`}
              icon={ChartBar}
              change={isRefreshing ? null : `${((analyzedCount / submissions.length) * 100).toFixed(1)}% analyzed`}
              color="blue"
            />
            <StatCard
              title="Satisfaction Rate"
              value={isRefreshing ? '...' : (satisfactionAnalysis ? `${Math.min(Math.max(satisfactionAnalysis.satisfactionOverview.satisfactionRate, 0), 100).toFixed(1)}%` : 'N/A')}
              icon={Smile}
              change={isRefreshing ? null : "+5.2%"}
              color="green"
            />
            <StatCard
              title="AI Confidence"
              value={isRefreshing ? '...' : (aiInsights ? `${aiInsights.insights.performanceInsights.aiConfidence.toFixed(1)}%` : 'N/A')}
              icon={Cpu}
              color="yellow"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-lg border">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="submissions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="metrics" className="gap-2">
            <LineChart className="h-4 w-4" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<LoadingMetrics />}>
            {isLoading ? (
              <LoadingMetrics />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Insights Summary */}
                {aiInsights && (
                  <div className="lg:col-span-2">
                    <InsightCard
                      title="Performance Analysis"
                      description="AI-powered insights and recommendations"
                      metrics={[
                        {
                          label: "Overall Score",
                          value: `${aiInsights.insights.performanceInsights.aiConfidence.toFixed(1)}%`,
                          change: "+5.2%"
                        },
                        {
                          label: "Analyzed Submissions",
                          value: analyzedCount,
                          change: `${((analyzedCount / submissions.length) * 100).toFixed(1)}%`
                        }
                      ]}
                      recommendations={aiInsights.insights.performanceInsights.recommendations}
                      icon={Target}
                      color="violet"
                    />
                  </div>
                )}

                {/* Key Metrics */}
                <div className="lg:col-span-1">
                  <Card className="p-6 bg-white shadow-lg border-0">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <Activity className="h-5 w-5 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
                      </div>

                      <div className="flex justify-center">
                        <ProgressRing value={75} />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">Analysis Progress</span>
                            <span className="text-sm font-medium text-violet-600">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">Satisfaction Rate</span>
                            <span className="text-sm font-medium text-emerald-600">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">Response Rate</span>
                            <span className="text-sm font-medium text-blue-600">88%</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </Suspense>

          <Suspense fallback={<LoadingInsights />}>
            {isRefreshing ? (
              <div className="relative">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
                {/* Show existing content while refreshing */}
                {satisfactionAnalysis && (
                  <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    <SatisfactionOverview analysis={satisfactionAnalysis} />
                  </Card>
                )}
              </div>
            ) : (
              <>
                {satisfactionAnalysis && (
                  <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    <SatisfactionOverview analysis={satisfactionAnalysis} />
                  </Card>
                )}
              </>
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="insights">
          <Suspense fallback={<InsightCardSkeleton />}>
            {isLoading ? (
              <InsightCardSkeleton />
            ) : (
              aiInsights && <AIInsightsCard insights={aiInsights} />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="submissions">
          <Suspense fallback={<SubmissionDetailsSkeleton />}>
            {isLoading ? (
              <SubmissionDetailsSkeleton />
            ) : (
              <div className="grid grid-cols-12 gap-6">
                {/* Submissions List */}
                <div className="col-span-12 md:col-span-5 lg:col-span-4">
                  <Card className="sticky top-6 border-0 shadow-lg overflow-hidden bg-white">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
                        </div>
                        <Badge className="bg-violet-100 text-violet-700">
                          {submissions.length} Total
                        </Badge>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search submissions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50/50"
                        />
                      </div>

                      <ScrollArea className="h-[calc(100vh-22rem)] max-h-[600px]">
                        <div className="space-y-2 pr-4">
                          <AnimatePresence>
                            {filteredSubmissions.map((submission) => (
                              <SubmissionListItem
                                key={submission.submission.id}
                                submission={submission}
                                isSelected={selectedSubmissionId === submission.submission.id}
                                onClick={() => setSelectedSubmissionId(submission.submission.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </div>
                  </Card>
                </div>

                {/* Submission Details */}
                <div className="col-span-12 md:col-span-7 lg:col-span-8">
                  <div className="flex-1 overflow-y-auto">
                    {selectedSubmission ? (
                      <div className="space-y-6">
                        <SubmissionDetails 
                          submission={selectedSubmission.submission}
                          analysis={selectedSubmission.analysis as unknown as ImportedAnalysis}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[400px]">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Submission Selected</h3>
                          <p className="text-sm text-gray-500">
                            Select a submission from the list to view details
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="metrics">
          <Suspense fallback={<LoadingMetrics />}>
            {isLoading ? (
              <LoadingMetrics />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Submission Trends */}
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <LineChart className="h-5 w-5 text-violet-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Submission Trends</h3>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <PieChart className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                  {/* Add your charts/graphs here */}
                </Card>

                {/* Satisfaction Distribution */}
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <ChartBar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Satisfaction Distribution</h3>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Star className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                  {/* Add your charts/graphs here */}
                </Card>
              </div>
            )}
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Show loading overlay when refreshing */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-50 pointer-events-none flex items-center justify-center">
          <Card className="p-4 bg-white/80 shadow-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
              <p className="text-sm font-medium text-gray-900">Refreshing data...</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 