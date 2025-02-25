'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Zap,
  ChartBar,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Lightbulb,
  List,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionDetail {
  id: number;
  text: string;
  description: string;
  questionType: string;
  category: string;
  choices: string[];
  response: string;
}

interface QuestionAnalysis {
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
    items?: string[];
    details?: string[];
  }>;
  improvement_priorities: Array<{
    category: string;
    score: number;
    description: string;
  }>;
  category: string;
}

interface ExecutiveSummary {
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
}

interface Analysis {
  feedback_id: number;
  executive_summary: ExecutiveSummary;
  question_analyses: QuestionAnalysis[];
  overall_score: number;
  overall_sentiment: string;
  overall_suggestions: string[];
  key_metrics: {
    overall_satisfaction: number;
    response_quality: number;
    sentiment_score: number;
    improvement_count: number;
  };
}

interface SubmissionResponse {
  submission: {
    id: number;
    feedbackId: number;
    submittedBy: string | null;
    responses: Record<string, string>;
    questionDetails: QuestionDetail[];
    overallComments: string;
    privacyLevel: 'PUBLIC' | 'ANONYMOUS';
    submittedAt: string;
    updatedAt: string;
  };
  analysis: Analysis;
  error: string | null;
}

interface SubmissionAnalysisProps {
  submissionData: SubmissionResponse;
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return <ThumbsUp className="h-5 w-5 text-emerald-500" />;
    case 'negative':
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
  }
};

const QuestionResponseCard = ({ 
  question, 
  analysis 
}: { 
  question: QuestionDetail; 
  analysis: QuestionAnalysis;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-500';
    if (score >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white">
        <div className="p-6">
          {/* Question Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {question.text}
              </h3>
              <div className="flex items-center gap-3">
                <Badge className="bg-violet-100 text-violet-700">
                  {question.questionType}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {question.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">{question.description}</p>
            </div>
          </div>

          {/* Response Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                <h4 className="font-medium text-gray-900">Response Analysis</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-2xl font-bold",
                  getScoreColor(analysis.score)
                )}>
                  {(analysis.score * 100).toFixed(1)}%
                </span>
                {getSentimentIcon(analysis.sentiment)}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Response</h5>
                <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-100">
                  {question.response}
                </p>
              </div>
              <Progress value={analysis.score * 100} className="h-2" />
            </div>
          </div>

          {/* Analysis Details */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium text-gray-900">Analysis Details</h4>
              </div>
              {analysis.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Target className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-amber-700">
                          {suggestion.type}
                        </span>
                        {suggestion.score && (
                          <Badge className="bg-white text-amber-700">
                            Score: {(suggestion.score * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-amber-800">{suggestion.content}</p>
                      {suggestion.details && suggestion.details.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {suggestion.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-amber-600">
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                      {suggestion.items && suggestion.items.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {suggestion.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-amber-600">
                              <List className="h-4 w-4 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const SubmissionAnalysis: React.FC<SubmissionAnalysisProps> = ({ submissionData }) => {
  const { submission, analysis } = submissionData;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Submission Analysis
              </h2>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-2 text-violet-100">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(submission.submittedAt), 'MMMM do, yyyy')}</span>
                </div>
                <Badge className={cn(
                  "text-lg px-4 py-2",
                  submission.privacyLevel === 'PUBLIC'
                    ? "bg-emerald-400/20 text-emerald-100"
                    : "bg-amber-400/20 text-amber-100"
                )}>
                  {submission.privacyLevel}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-violet-200">Overall Score</p>
                <p className="text-3xl font-bold text-white">
                  {(analysis.overall_score * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-violet-200">Sentiment</p>
                <div className="mt-1">
                  {getSentimentIcon(analysis.overall_sentiment)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-sm">
              <Star className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Executive Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analysis.executive_summary.strengths.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Key Strengths</h4>
                <div className="space-y-3">
                  {analysis.executive_summary.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-emerald-50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-emerald-800">{strength.description}</p>
                          <Badge className="mt-2 bg-white text-emerald-700">
                            Score: {strength.score.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {analysis.executive_summary.action_items.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Action Items</h4>
                <div className="space-y-3">
                  {analysis.executive_summary.action_items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-amber-50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Target className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-amber-800">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge className="bg-white text-amber-700">
                              {item.category}
                            </Badge>
                            <Badge className="bg-white text-amber-700">
                              {item.priority} Priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Question Analysis */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-sm">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Question Analysis</h3>
        </div>

        <ScrollArea className="h-[calc(100vh-24rem)]">
          <div className="space-y-6 pr-4">
            {submission.questionDetails.map((question, index) => {
              const questionAnalysis = analysis.question_analyses.find(
                qa => qa.question_id === question.id
              );
              
              if (!questionAnalysis) return null;

              return (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  analysis={questionAnalysis}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SubmissionAnalysis; 