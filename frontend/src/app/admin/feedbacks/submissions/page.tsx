'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  MessageSquare, 
  Calendar,
  RefreshCw,
  Search,
  CheckCircle2,
  BarChart2,
  ClipboardList,
  XCircle,
  ChevronRight,
  Target,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

interface TeamMember {
  id: number;
  fullname: string;
}

interface Feedback {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  submissionCount?: number;
  analysis?: FeedbackAnalysis | null;
  hasAnalysis?: boolean;
  isAnalysisLoading?: boolean;
  analysisError?: string;
}

interface FeedbackAnalysis {
  overall_score: number;
  overall_sentiment: string;
  executive_summary: {
    overall_rating: string;
    strengths: Array<{
      category: string;
      score: number;
      description: string;
    }>;
    weaknesses: Array<{
      category: string;
      score: number;
      description: string;
    }>;
    key_insights: string[];
    action_items: Array<{
      description: string;
      category: string;
      priority: string;
    }>;
  };
  key_metrics: {
    overall_satisfaction: number;
    response_quality: number;
    sentiment_score: number;
    improvement_count: number;
  };
}

interface FeedbackResponse {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface SubmissionData {
  submission: {
    id: number;
    feedbackId: number;
    submittedBy: string | null;
  };
}

interface TeamMemberStats {
  total: number;
  submitted: number;
  pending: number;
}

interface FeedbackMemberStats {
  feedbackId: number;
  totalMembers: number;
  submittedMembers: Set<string>;
  pendingMembers: string[];
}

// Add retry logic helper function
const retryRequest = async <T,>(requestFn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Request failed after retries');
};

export default function FeedbackSubmissionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [analysisCache, setAnalysisCache] = useState<Record<number, FeedbackAnalysis>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Add new state for analysis metrics
  const [analysisMetrics, setAnalysisMetrics] = useState({
    totalAnalyzed: 0,
    satisfactionRate: 0,
    previousRate: 0,
    changePercentage: 0
  });

  // Add new state for submission counts
  const [submissionStats, setSubmissionStats] = useState({
    totalSubmissions: 0,
    analyzedSubmissions: 0,
    pendingAnalysis: 0
  });

  // Add new state for team member stats
  const [teamStats, setTeamStats] = useState<TeamMemberStats>({
    total: 0,
    submitted: 0,
    pending: 0
  });

  // Add new state for feedback member stats
  const [feedbackMemberStats, setFeedbackMemberStats] = useState<Record<number, FeedbackMemberStats>>({});

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch feedbacks with pagination
      const feedbacksResponse = await axios.get<FeedbackResponse[]>(
        `http://localhost:8084/api/v1/admin/feedbacks/get-all?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const validFeedbackIds = new Set(feedbacksResponse.data.map(f => f.id));
      
      // Initialize feedbacks with optimistic loading states
      const initialFeedbacks = feedbacksResponse.data.map((feedback) => ({
        ...feedback,
        analysis: analysisCache[feedback.id] || null,
        hasAnalysis: !!analysisCache[feedback.id],
        isAnalysisLoading: !analysisCache[feedback.id],
        submissionCount: 0
      }));

      // Update state based on page
      setFeedbacks(prev => page === 1 ? initialFeedbacks : [...prev, ...initialFeedbacks]);
      setHasMore(feedbacksResponse.data.length === ITEMS_PER_PAGE);

      try {
        // Fetch submissions, analysis data, team stats, and team members
        const [submissionsResponse, analysisStatsResponse, teamStatsResponse] = await Promise.all([
          axios.get<SubmissionData[]>('http://localhost:8085/api/submissions/all', {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 10000
          }).catch(error => {
            console.error('Failed to fetch submissions:', error);
            toast({
              title: 'Warning',
              description: 'Failed to fetch submissions. Some data may be incomplete.',
              variant: 'destructive',
            });
            return { data: [] };
          }),
          axios.get(`http://localhost:8085/api/analysis/stats`, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 10000
          }).catch(error => {
            console.warn('Failed to fetch analysis stats:', error);
            return { data: { totalAnalyzed: 0, satisfactionRate: 0, previousPeriodRate: 0 } };
          }),
          axios.get(`http://localhost:8081/api/manager/list`, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 10000
          }).catch(error => {
            console.warn('Failed to fetch team stats:', error);
            return { data: [] };
          })
        ]);

        // Calculate per-feedback member stats
        const memberStats: Record<number, FeedbackMemberStats> = {};
        const teamMembers = teamStatsResponse.data as TeamMember[];

        feedbacksResponse.data.forEach(feedback => {
          const feedbackSubmissions = submissionsResponse.data.filter(
            s => s.submission?.feedbackId === feedback.id
          );
          const submittedMembers = new Set(
            feedbackSubmissions
              .map(s => s.submission?.submittedBy)
              .filter((id): id is string => id !== null)
          );
          const pendingMembers = teamMembers
            .filter(m => !submittedMembers.has(m.id.toString()))
            .map(m => m.fullname);

          memberStats[feedback.id] = {
            feedbackId: feedback.id,
            totalMembers: teamMembers.length,
            submittedMembers,
            pendingMembers
          };
        });

        setFeedbackMemberStats(memberStats);

        // Log submissions data for debugging
        console.log('Submissions response:', submissionsResponse.data);

        // Process submission counts (safely handle potential undefined data)
        const submissionCounts = (submissionsResponse.data || []).reduce<Record<number, number>>((acc, sub) => {
          if (!sub || !sub.submission) return acc;
          
          const feedbackId = sub.submission.feedbackId;
          if (feedbackId && validFeedbackIds.has(feedbackId)) {
            acc[feedbackId] = (acc[feedbackId] || 0) + 1;
          }
          return acc;
        }, {});

        // Log submission counts for debugging
        console.log('Submission counts:', submissionCounts);

        // Calculate total submissions
        const totalSubs = Object.values(submissionCounts).reduce((a, b) => a + b, 0);
        const analyzedSubs = analysisStatsResponse.data?.totalAnalyzed || 0;

        // Update submission stats
        setSubmissionStats({
          totalSubmissions: totalSubs,
          analyzedSubmissions: analyzedSubs,
          pendingAnalysis: totalSubs - analyzedSubs
        });

        // Update feedbacks with submission counts
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(feedback => ({
            ...feedback,
            submissionCount: submissionCounts[feedback.id] || 0
          }))
        );

        // Update analysis metrics
        const currentSatisfactionRate = analysisStatsResponse.data?.satisfactionRate || 0;
        const previousSatisfactionRate = analysisStatsResponse.data?.previousPeriodRate || 0;
        const rateChange = currentSatisfactionRate - previousSatisfactionRate;

        setAnalysisMetrics({
          totalAnalyzed: analyzedSubs,
          satisfactionRate: currentSatisfactionRate * 100,
          previousRate: previousSatisfactionRate * 100,
          changePercentage: rateChange * 100
        });

        // Calculate team member stats
        const totalTeamMembers = teamMembers.length;
        const submittedMembers = new Set(submissionsResponse.data.map(s => s.submission?.submittedBy).filter(Boolean)).size;

        setTeamStats({
          total: totalTeamMembers,
          submitted: submittedMembers,
          pending: totalTeamMembers - submittedMembers
        });

        // Fetch analysis for feedbacks with submissions
        const feedbacksWithSubmissions = feedbacksResponse.data.filter(
          (feedback) => submissionCounts[feedback.id] > 0
        );

        // Process analysis in smaller batches for better performance
        const batchSize = 3;
        const feedbackBatches = chunk(feedbacksWithSubmissions, batchSize);

        for (const batch of feedbackBatches) {
          await Promise.all(
            batch.map(async (feedback) => {
              if (analysisCache[feedback.id]) return; // Skip if cached

              try {
                const analysisResponse = await retryRequest(
                  () => axios.get<FeedbackAnalysis>(
                    `http://localhost:8085/api/analysis/feedback/${feedback.id}`,
                    { 
                      headers: {
                        'Authorization': `Bearer ${token}`
                      },
                      timeout: 15000 // Increased timeout to 15 seconds
                    }
                  ),
                  3, // Max 3 retries
                  2000 // 2 second base delay between retries
                );

                setFeedbacks(prevFeedbacks => 
                  prevFeedbacks.map(f => 
                    f.id === feedback.id 
                      ? {
                          ...f,
                          analysis: analysisResponse.data,
                          hasAnalysis: true,
                          isAnalysisLoading: false
                        }
                      : f
                  )
                );

                setAnalysisCache(prev => ({
                  ...prev,
                  [feedback.id]: analysisResponse.data
                }));
              } catch (error) {
                console.error(`Failed to fetch analysis for feedback ${feedback.id}:`, error);
                setFeedbacks(prevFeedbacks => 
                  prevFeedbacks.map(f => 
                    f.id === feedback.id 
                      ? {
                          ...f,
                          analysis: null,
                          hasAnalysis: false,
                          isAnalysisLoading: false,
                          analysisError: error instanceof Error ? error.message : 'Failed to load analysis'
                        }
                      : f
                  )
                );
              }
            })
          );
          await new Promise(resolve => setTimeout(resolve, 500)); // Delay between batches
        }
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
        toast({
          title: 'Warning',
          description: 'Some analysis data could not be loaded. The display may be incomplete.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch feedbacks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to chunk array into smaller arrays
  const chunk = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  // Optimize filtering with memoization
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => {
      const matchesSearch = 
        !searchQuery || 
        feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'active' ? feedback.active :
        !feedback.active;

      return matchesSearch && matchesFilter;
    });
  }, [feedbacks, searchQuery, filter]);

  // Infinite scroll handler
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  // Modify the click handler to check for submissions
  const handleFeedbackClick = (feedback: Feedback) => {
    if (feedback.submissionCount === 0) {
      toast({
        title: "No Submissions",
        description: "This feedback has no submissions yet. Please wait for participants to submit their responses.",
        variant: "destructive"
      });
      return;
    }
    router.push(`/admin/feedbacks/submissions/${feedback.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feedback Analysis</h1>
                <p className="text-gray-500 text-sm">
                  {filteredFeedbacks.reduce((acc, f) => acc + (f.submissionCount || 0), 0)} Total Submissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                className="bg-white"
                leftIcon={<RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white shadow-sm">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search feedbacks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 bg-gray-50/50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 bg-gray-50/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Updated Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Active Feedbacks Card */}
          <Card className="bg-white p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 relative">
              <div className="p-3 bg-violet-100 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                <MessageSquare className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Feedbacks</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {filteredFeedbacks.filter(f => f.active).length}
                  </p>
                  <span className="text-sm text-emerald-600 flex items-center gap-1">
                    <span className="text-xs opacity-75">active</span>
                    <span className="text-xs text-gray-500">/ {filteredFeedbacks.length} total</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Response Rate Card */}
          <Card className="bg-white p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 relative">
              <div className="p-3 bg-blue-100 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Team Response Rate</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {((teamStats.submitted / Math.max(teamStats.total, 1)) * 100).toFixed(1)}%
                  </p>
                  <span className="text-sm text-blue-600">completed</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${(teamStats.submitted / Math.max(teamStats.total, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Average Satisfaction Card */}
          <Card className="bg-white p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 relative">
              <div className="p-3 bg-emerald-100 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Average Satisfaction</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {analysisMetrics.satisfactionRate.toFixed(1)}%
                  </p>
                  <div className={cn(
                    "flex items-center gap-1 text-sm px-2 py-0.5 rounded-full",
                    analysisMetrics.changePercentage >= 0 
                      ? "text-emerald-700 bg-emerald-50" 
                      : "text-red-700 bg-red-50"
                  )}>
                    {analysisMetrics.changePercentage >= 0 ? '+' : ''}
                    {analysisMetrics.changePercentage.toFixed(1)}%
                    <span className="text-xs opacity-75">vs previous</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Analysis Status Card */}
          <Card className="bg-white p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 relative">
              <div className="p-3 bg-amber-100 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                <Target className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Analysis Status</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {submissionStats.analyzedSubmissions}/{submissionStats.totalSubmissions}
                  </p>
                  <span className="text-sm text-amber-600">analyzed</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Updated Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((feedback) => {
            const memberStats = feedbackMemberStats[feedback.id];
            const submissionProgress = memberStats ? 
              (memberStats.submittedMembers.size / memberStats.totalMembers) * 100 : 0;

            return (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group"
              >
                <Card
                  className={cn(
                    "bg-white cursor-pointer transition-all duration-200",
                    "hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50"
                  )}
                  onClick={() => handleFeedbackClick(feedback)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <ClipboardList className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {feedback.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn(
                              feedback.active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-50 text-gray-700"
                            )}>
                              {feedback.active ? (
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                              )}
                              {feedback.active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge className="bg-blue-50 text-blue-700">
                              {feedback.projectName}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Team Progress */}
                      <div className="p-3 bg-violet-50 rounded-lg group hover:bg-violet-100/80 transition-colors">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-violet-600" />
                          <span className="text-sm text-violet-700">Team Progress</span>
                        </div>
                        <div className="mt-2">
                          {memberStats?.totalMembers === 0 ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-violet-600 font-medium">No Team Members</span>
                              <span className="text-xs text-violet-500">Add team members to start collecting feedback</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-baseline gap-2">
                                <p className="text-xl font-bold text-violet-900">
                                  {memberStats?.submittedMembers.size || 0}/{memberStats?.totalMembers || 0}
                                </p>
                                <span className="text-xs text-violet-600">responded</span>
                              </div>
                              <div className="w-full h-1.5 bg-violet-100 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-300"
                                  style={{ width: `${submissionProgress}%` }}
                                />
                              </div>
                              {memberStats && memberStats.submittedMembers.size > 0 && (
                                <div className="mt-2 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                  <span className="text-xs text-emerald-600">
                                    {((memberStats.submittedMembers.size / memberStats.totalMembers) * 100).toFixed(0)}% complete
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Analysis Status */}
                      <div className="p-3 bg-violet-50 rounded-lg group hover:bg-violet-100/80 transition-colors">
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-violet-600" />
                          <span className="text-sm text-violet-700">Analysis</span>
                        </div>
                        <div className="mt-2">
                          {memberStats?.totalMembers === 0 ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-violet-600 font-medium">Not Available</span>
                              <span className="text-xs text-violet-500">Team members required for analysis</span>
                            </div>
                          ) : memberStats?.submittedMembers.size === 0 ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-violet-600">No Responses</span>
                              <span className="text-xs text-violet-500">Waiting for team submissions</span>
                            </div>
                          ) : feedback.isAnalysisLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                              <span className="text-sm text-violet-600">Processing...</span>
                            </div>
                          ) : feedback.hasAnalysis ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm text-emerald-600">Analyzed</span>
                              </div>
                              <span className="text-xs text-emerald-500">View detailed insights</span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-amber-600">
                                {feedback.analysisError || 'Pending Analysis'}
                              </span>
                              <span className="text-xs text-amber-500">Analysis will begin shortly</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(feedback.startDate), 'MMM d, yyyy')}</span>
                        <ChevronRight className="h-4 w-4" />
                        <span>{format(new Date(feedback.endDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="bg-violet-50 text-violet-700 hover:bg-violet-100"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading more...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 