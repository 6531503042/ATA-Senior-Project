'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  ChevronRight,
  AlertCircle,
  Clock,
  Search,
  CheckCircle2,
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
  Heart,
  ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { SubmissionAnalysis } from '../components/SubmissionAnalysis';
import { SatisfactionOverview } from '../components/SatisfactionOverview';
import { AIInsightsCard } from '../components/AIInsightsCard';
import type { SubmissionResponse, FeedbackAnalysis, SatisfactionAnalysis, AIInsights } from '@/lib/api/submissions';
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

interface SubmissionListItemProps {
  submission: SubmissionResponse;
  isSelected: boolean;
  onClick: () => void;
}

const SubmissionListItem = ({ submission, isSelected, onClick }: SubmissionListItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-sm">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-medium text-gray-900">
                  Submission #{submission.submission.id}
                </h3>
                <Badge className={cn(
                  submission.submission.privacyLevel === 'PUBLIC'
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                )}>
                  {submission.submission.privacyLevel}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(submission.submission.submittedAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {submission.submission.submittedBy ? (
                    <>
                      <User className="h-4 w-4" />
                      <span>User #{submission.submission.submittedBy}</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-gray-400" />
                      <span>Anonymous</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <Badge className={cn(
                  "flex items-center gap-1.5",
                  submission.submission.status === 'analyzed'
                    ? "bg-emerald-50 text-emerald-700"
                    : submission.submission.status === 'error'
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                )}>
                  {submission.submission.status === 'analyzed' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : submission.submission.status === 'error' ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                  {submission.submission.status?.charAt(0).toUpperCase() + submission.submission.status?.slice(1)}
                </Badge>
              </div>
            </div>

            <ChevronRight className={cn(
              "h-5 w-5 transition-transform",
              isSelected ? "rotate-90" : ""
            )} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Beautiful animated progress ring component
const ProgressRing = ({ value, size = 120, strokeWidth = 8 }) => {
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
const StatCard = ({ title, value, icon: Icon, change, color = "violet" }) => {
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
const InsightCard = ({ title, description, metrics, recommendations, icon: Icon, color = "violet" }) => {
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

export default function FeedbackSubmissionPage({ params }: { params: Promise<{ feedbackId: string }> }) {
  const resolvedParams = use(params);
  const feedbackId = parseInt(resolvedParams.feedbackId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [satisfactionAnalysis, setSatisfactionAnalysis] = useState<SatisfactionAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = getCookie('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch all submissions for this feedback
        const submissionsResponse = await axios.get(
          `http://localhost:8085/api/submissions/all`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 10000 // Increased timeout
          }
        );

        // Filter submissions for this feedback
        const feedbackSubmissions = submissionsResponse.data.filter(
          (sub: SubmissionResponse) => sub.submission.feedbackId === feedbackId
        );

        setSubmissions(feedbackSubmissions);

        // Set first submission as selected if available
        if (feedbackSubmissions.length > 0 && !selectedSubmissionId) {
          setSelectedSubmissionId(feedbackSubmissions[0].submission.id);
        }

        // Fetch analyses in parallel
        const [analysisRes, satisfactionRes, insightsRes] = await Promise.all([
          axios.get(`http://localhost:8085/api/analysis/feedback/${feedbackId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8085/api/analysis/satisfaction/${feedbackId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8085/api/analysis/insights/${feedbackId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setAnalysis(analysisRes.data);
        setSatisfactionAnalysis(satisfactionRes.data);
        setAiInsights(insightsRes.data);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load feedback data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (feedbackId) {
      fetchData();
    }
  }, [feedbackId]);

  const filteredSubmissions = submissions.filter(submission =>
    submission.submission.id.toString().includes(searchQuery) ||
    (submission.submission.submittedBy?.toString() || '').includes(searchQuery)
  );

  const selectedSubmission = submissions.find(
    sub => sub.submission.id === selectedSubmissionId
  );

  const analyzedCount = submissions.filter(s => 
    s.submission?.status && s.submission.status === 'analyzed'
  ).length;

  const recentSubmissions = submissions.filter(s => {
    if (!s.submission?.submittedAt) return false;
    const submittedDate = new Date(s.submission.submittedAt);
    const today = new Date();
    return submittedDate.toDateString() === today.toDateString();
  }).length;

  const totalUsers = submissions.filter(s => s.submission?.submittedBy).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-sm text-gray-500">Loading feedback data...</p>
        </div>
      </div>
    );
  }

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
                onClick={() => window.location.reload()}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
                Refresh Analysis
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard
              title="Total Submissions"
              value={submissions.length}
              icon={MessageCircle}
              change="+12%"
              color="violet"
            />
            <StatCard
              title="Analysis Status"
              value={`${analyzedCount}/${submissions.length}`}
              icon={ChartBar}
              change={`${((analyzedCount / submissions.length) * 100).toFixed(1)}% analyzed`}
              color="blue"
            />
            <StatCard
              title="Satisfaction Rate"
              value={satisfactionAnalysis ? `${(satisfactionAnalysis.satisfactionOverview.satisfactionRate * 100).toFixed(1)}%` : 'N/A'}
              icon={Smile}
              change="+5.2%"
              color="green"
            />
            <StatCard
              title="AI Confidence"
              value={aiInsights ? `${aiInsights.insights.performanceInsights.aiConfidence.toFixed(1)}%` : 'N/A'}
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
          {/* Overview Content */}
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

          {/* Satisfaction Overview */}
          {satisfactionAnalysis && (
            <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
              <SatisfactionOverview analysis={satisfactionAnalysis} />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights">
          {/* AI Insights Content */}
          {aiInsights && <AIInsightsCard insights={aiInsights} />}
        </TabsContent>

        <TabsContent value="submissions">
          {/* Submissions List and Details */}
          <div className="grid grid-cols-12 gap-6">
            {/* Submissions List */}
            <div className="col-span-12 lg:col-span-3">
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

                  <ScrollArea className="h-[calc(100vh-20rem)]">
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
            <div className="col-span-12 lg:col-span-9">
              <AnimatePresence mode="wait">
                {selectedSubmission ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="border-0 shadow-lg overflow-hidden bg-white">
                      <div className="p-6">
                        <SubmissionAnalysis submissionData={selectedSubmission} />
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="p-12 text-center border-0 shadow-lg overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                          <MessageSquare className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Select a Submission</h3>
                          <p className="text-sm text-gray-500 mt-1">Choose a submission from the list to view its detailed analysis</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          {/* Metrics Content */}
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 