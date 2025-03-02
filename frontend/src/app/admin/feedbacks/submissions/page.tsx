'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  getAllSubmissions, 
  type SubmissionResponse,
  getAIInsights
} from '@/lib/api/submissions';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  AlertCircle, 
  MessageSquare, 
  Calendar,
  User,
  RefreshCw,
  ChevronRight,
  Search,
  FileText,
  CheckCircle2,
  Filter,
  BarChart2,
  Users,
  ClipboardList,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SubmissionAnalysis } from './components/SubmissionAnalysis';
import { SubmissionMetrics } from './components/SubmissionMetrics';
import { Button } from '@/components/ui/Button';
import { AIInsightsCard } from './components/AIInsightsCard';
import type { AIInsights } from '@/lib/api/submissions';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { FeedbackSelector } from './components/FeedbackSelector';
import { useRouter } from 'next/navigation';

interface FeedbackAnalysis {
  feedback_id: number;
  project_id: number;
  project_name: string;
  submitted_by: string | null;
  submitted_at: string;
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
  question_analyses: Array<{
    question_id: number;
    question_text: string;
    question_type: string;
    response: string;
    score: number;
    sentiment: string;
    suggestions: Array<{
      type: string;
      content: string;
      score?: number;
      details?: string[];
    }>;
    improvement_priorities: Array<{
      category: string;
      score: number;
      description: string;
    }>;
    category: string;
  }>;
  key_metrics: {
    overall_satisfaction: number;
    response_quality: number;
    sentiment_score: number;
    improvement_count: number;
  };
}

interface SubmissionCardProps {
  submission: SubmissionResponse;
  isSelected: boolean;
  onClick: () => void;
  analysis?: FeedbackAnalysis;
}

interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  gender: string;
  avatar: string;
  roles: string[];
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, isSelected, onClick, analysis }) => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie('accessToken');
        const response = await axios.get<User[]>('http://localhost:8081/api/manager/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userId = submission.submission.submittedBy;
        if (userId && response.data) {
          const user = response.data.find(u => u.id === parseInt(userId.toString()));
          if (user) {
            setUserData(user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (submission.submission.submittedBy) {
      fetchUserData();
    }
  }, [submission.submission.submittedBy]);

  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "relative w-full cursor-pointer",
        "transition-all duration-200 ease-in-out",
        isSelected ? "scale-[0.98]" : "hover:scale-[1.02]",
      )}
    >
      <div className={cn(
        "relative p-4 rounded-xl transition-all duration-200",
        "bg-white border",
        isSelected 
          ? "border-violet-200 shadow-lg shadow-violet-100/50 bg-violet-50/30" 
          : "border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200"
      )}>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Status & Submission Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium",
                "bg-slate-100 text-slate-700"
              )}>
                <MessageSquare className="h-3.5 w-3.5" />
                Submission #{submission.submission.id}
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Analyzed
              </Badge>
              {analysis && (
                <Badge className={cn(
                  "flex items-center gap-1.5",
                  analysis.overall_sentiment === 'POSITIVE' 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : analysis.overall_sentiment === 'NEGATIVE'
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}>
                  {analysis.executive_summary.overall_rating}
                </Badge>
              )}
            </div>

            {/* Project Info */}
            {submission.submission.feedback ? (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-900">
                  {submission.submission.feedback.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {submission.submission.feedback.projectName}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  Unlinked Submission
                </Badge>
              </div>
            )}

            {/* Analysis Summary */}
            {analysis && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-violet-50 border border-violet-100">
                  <div className="text-xs text-violet-600 mb-1">Response Quality</div>
                  <div className="text-sm font-semibold text-violet-700">
                    {(analysis.key_metrics.response_quality * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="text-xs text-emerald-600 mb-1">Sentiment Score</div>
                  <div className="text-sm font-semibold text-emerald-700">
                    {(analysis.key_metrics.sentiment_score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-xs text-blue-600 mb-1">Satisfaction</div>
                  <div className="text-sm font-semibold text-blue-700">
                    {(analysis.key_metrics.overall_satisfaction * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {/* Comments Preview */}
            <div className="relative mb-3">
              <p className="text-sm text-slate-600 line-clamp-2">
                {submission.submission.overallComments}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-white/0" />
            </div>

            {/* Key Insights */}
            {analysis && analysis.executive_summary.key_insights.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {analysis.executive_summary.key_insights.map((insight, index) => (
                    <Badge 
                      key={index}
                      className="bg-violet-50 text-violet-700 border-violet-100"
                    >
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(new Date(submission.submission.submittedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                {userData ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={userData.avatar} 
                      alt={userData.fullname}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-violet-600 font-medium">{userData.fullname}</span>
                  </div>
                ) : (
                  <>
                    <div className="p-1 bg-violet-50 rounded-full">
                      <User className="h-3.5 w-3.5 text-violet-500" />
                    </div>
                    <span className="text-violet-600 font-medium">
                      {submission.submission.submittedBy ? 'Loading...' : 'Anonymous'}
                    </span>
                  </>
                )}
              </div>
              {submission.submission.privacyLevel && (
                <Badge className={cn(
                  "ml-auto",
                  submission.submission.privacyLevel === 'PUBLIC' 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  {submission.submission.privacyLevel}
                </Badge>
              )}
            </div>
          </div>
          
          <div className={cn(
            "flex-shrink-0 transition-all duration-200",
            isSelected ? "rotate-90" : "group-hover:translate-x-1"
          )}>
            <ChevronRight className={cn(
              "h-5 w-5",
              isSelected ? "text-violet-500" : "text-slate-400"
            )} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function FeedbackSubmissionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [analysisCache, setAnalysisCache] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // First fetch all valid feedbacks from the main API
        const feedbacksResponse = await axios.get('http://localhost:8084/api/v1/admin/feedbacks/get-all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Create a map of valid feedback IDs for quick lookup
        const validFeedbackIds = new Set(feedbacksResponse.data.map((f: any) => f.id));

        // Initialize feedbacks with basic data
        const initialFeedbacks = feedbacksResponse.data.map((feedback: any) => ({
          ...feedback,
          analysis: null,
          hasAnalysis: false,
          isAnalysisLoading: true,
          submissionCount: 0
        }));
        setFeedbacks(initialFeedbacks);

        // Then fetch all submissions from the AI service
        const submissionsResponse = await axios.get('http://localhost:8085/api/submissions/all');
        
        // Count submissions for each feedback
        const submissionCounts = submissionsResponse.data.reduce((acc: Record<number, number>, submission: any) => {
          const feedbackId = submission.submission.feedbackId;
          if (validFeedbackIds.has(feedbackId)) {
            acc[feedbackId] = (acc[feedbackId] || 0) + 1;
          }
          return acc;
        }, {});

        // Update feedbacks with submission counts
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(feedback => ({
            ...feedback,
            submissionCount: submissionCounts[feedback.id] || 0
          }))
        );

        // Then fetch analysis for each feedback that has submissions
        const feedbacksWithSubmissions = feedbacksResponse.data.filter(
          (feedback: any) => submissionCounts[feedback.id] > 0
        );

        // Process analysis in batches
        const batchSize = 3;
        const feedbackBatches = chunk(feedbacksWithSubmissions, batchSize);

        for (const batch of feedbackBatches) {
          await Promise.all(
            batch.map(async (feedback: any) => {
              try {
                const analysisResponse = await axios.get(
                  `http://localhost:8085/api/analysis/feedback/${feedback.id}`,
                  { timeout: 5000 }
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
                          analysisError: 'Failed to load analysis'
                        }
                      : f
                  )
                );
              }
            })
          );
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load feedbacks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [toast]);

  // Helper function to chunk array into smaller arrays
  const chunk = <T,>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => {
      const matchesSearch = feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           feedback.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           feedback.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === 'all' ? true :
                           filter === 'active' ? feedback.active :
                           !feedback.active;

      return matchesSearch && matchesFilter;
    });
  }, [feedbacks, searchQuery, filter]);

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-100">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Feedback Submissions</h1>
              <p className="text-slate-500 text-sm">View and analyze feedback responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Feedbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group"
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200",
                "hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50"
              )}
              onClick={() => router.push(`/admin/feedbacks/submissions/${feedback.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feedback.title}
                    </h3>
                    <Badge className={cn(
                      feedback.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-50 text-gray-700"
                    )}>
                      {feedback.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {/* Analysis Status */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-violet-600" />
                        <span className="text-sm text-violet-600">Submissions</span>
                      </div>
                      <p className="text-xl font-bold text-violet-700 mt-1">
                        {feedback.submissionCount || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-violet-600" />
                        <span className="text-sm text-violet-600">Analysis</span>
                      </div>
                      <p className="text-xl font-bold text-violet-700 mt-1">
                        {feedback.submissionCount === 0 ? (
                          'No Submissions'
                        ) : feedback.isAnalysisLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading...</span>
                          </div>
                        ) : feedback.hasAnalysis ? (
                          'Complete'
                        ) : (
                          feedback.analysisError || 'No Analysis'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(feedback.startDate), 'MMM d, yyyy')}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>{format(new Date(feedback.endDate), 'MMM d, yyyy')}</span>
                  </div>

                  {/* Project Badge */}
                  <Badge className="bg-blue-50 text-blue-700">
                    {feedback.projectName}
                  </Badge>

                  {feedback.submissionCount > 0 && feedback.analysis?.executive_summary?.key_insights && (
                    <div className="flex flex-wrap gap-2">
                      {feedback.analysis.executive_summary.key_insights.slice(0, 2).map((insight: string, index: number) => (
                        <Badge 
                          key={index}
                          className="bg-violet-50 text-violet-700 border-violet-100"
                        >
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 