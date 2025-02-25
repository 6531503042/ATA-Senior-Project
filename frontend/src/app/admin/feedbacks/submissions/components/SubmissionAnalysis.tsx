import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  Lock,
  Unlock,
  ChevronRight,
  AlertTriangle,
  Clock,
  RefreshCw,
  LifeBuoy,
  BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SubmissionResponse } from '@/lib/api/submissions';
import { Button } from '@/components/ui/Button';
import axios from 'axios';

interface QuestionDetail {
  id: number;
  text: string;
  description: string;
  questionType: string;
  category: string;
  choices: string[];
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
    details?: string[];
  }>;
  improvement_priorities: Array<{
    category: string;
    score: number;
    description: string;
  }>;
  category: string;
}

interface FeedbackAnalysis {
  feedback_id: number;
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
  question_analyses: QuestionAnalysis[];
  key_metrics: {
    overall_satisfaction: number;
    response_quality: number;
    sentiment_score: number;
    improvement_count: number;
  };
}

interface SubmissionAnalysisProps {
  submissionData: SubmissionResponse;
}

export function SubmissionAnalysis({ submissionData }: SubmissionAnalysisProps) {
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<FeedbackAnalysis>(
          `http://localhost:8085/api/analysis/feedback/${submissionData.submission.feedbackId}`
        );
        setAnalysis(response.data);
      } catch (error) {
        console.error('Failed to fetch analysis:', error);
        setError('Failed to fetch analysis data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [submissionData.submission.feedbackId]);

  const renderQuestionResponse = (
    question: QuestionDetail,
    response: string,
    questionAnalysis: QuestionAnalysis | undefined
  ) => {
    const renderScore = (score: number) => (
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-violet-600">
          {(score * 100).toFixed(1)}%
        </span>
      </div>
    );

    const renderSentimentBadge = (sentiment: string) => {
      const sentimentConfig = {
        'POSITIVE': { bg: 'bg-green-50', text: 'text-green-700', emoji: '😊' },
        'NEUTRAL': { bg: 'bg-gray-50', text: 'text-gray-700', emoji: '😐' },
        'NEGATIVE': { bg: 'bg-red-50', text: 'text-red-700', emoji: '😞' }
      };
      const config = sentimentConfig[sentiment as keyof typeof sentimentConfig] || sentimentConfig.NEUTRAL;
      
      return (
        <Badge className={cn("flex items-center gap-2 px-3 py-1.5", config.bg, config.text)}>
          <span className="text-lg">{config.emoji}</span>
          <span>{sentiment}</span>
        </Badge>
      );
    };

    return (
      <div className="space-y-4">
        {/* Response Content */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{response}</p>
        </div>

        {/* Analysis Metrics */}
        {questionAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-violet-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-violet-700">Response Score</span>
                <BarChart2 className="h-4 w-4 text-violet-600" />
              </div>
              {renderScore(questionAnalysis.score)}
              {questionAnalysis.suggestions.map((suggestion, index) => (
                <p key={index} className="mt-2 text-sm text-violet-600">
                  {suggestion.content}
                </p>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Sentiment Analysis</span>
                {renderSentimentBadge(questionAnalysis.sentiment)}
              </div>
              {questionAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="mt-2">
                  {suggestion.score && renderScore(suggestion.score)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-violet-600 animate-spin" />
          <span className="text-sm text-gray-600">Loading analysis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50/50 p-6 border-red-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-red-900">Analysis Failed</h4>
            <p className="text-sm text-red-700">{error}</p>
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-white hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('mailto:support@example.com')}
                className="bg-white hover:bg-red-50"
              >
                <LifeBuoy className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Submission #{submissionData.submission.id}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(submissionData.submission.submittedAt), 'PPP')}</span>
              <ChevronRight className="h-4 w-4" />
              <span>{format(new Date(submissionData.submission.submittedAt), 'pp')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {submissionData.submission.submittedBy ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                User #{submissionData.submission.submittedBy}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Anonymous</span>
            </div>
          )}
          <Badge
            className={cn(
              "flex items-center gap-1.5",
              submissionData.submission.privacyLevel === 'PUBLIC' 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}
          >
            {submissionData.submission.privacyLevel === 'PUBLIC' ? (
              <Unlock className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            {submissionData.submission.privacyLevel}
          </Badge>
        </div>
      </div>

      {/* Analysis Overview */}
      {analysis && (
        <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <h4 className="text-sm font-medium text-violet-700 mb-2">Overall Score</h4>
              <div className="text-2xl font-bold text-violet-900">
                {analysis.executive_summary.overall_rating}
              </div>
            </div>
            <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <h4 className="text-sm font-medium text-emerald-700 mb-2">Response Quality</h4>
              <div className="text-2xl font-bold text-emerald-900">
                {(analysis.key_metrics.response_quality * 100).toFixed(1)}%
              </div>
            </div>
            <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Sentiment Score</h4>
              <div className="text-2xl font-bold text-blue-900">
                {(analysis.key_metrics.sentiment_score * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Questions and Responses */}
      <div className="space-y-6">
        {submissionData.submission.questionDetails.map((question) => {
          const questionAnalysis = analysis?.question_analyses.find(
            qa => qa.question_id === question.id
          );
          
          return (
            <Card key={question.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900 mb-1">
                      {question.text}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">{question.description}</p>
                    {renderQuestionResponse(
                      question,
                      submissionData.submission.responses[question.id],
                      questionAnalysis
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Overall Comments */}
      <Card className="bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">Overall Feedback</h4>
            <p className="text-sm text-gray-500">Summary of all responses</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{submissionData.submission.overallComments}</p>
        
        {analysis && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Insights */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Key Insights</h5>
              <div className="space-y-2">
                {analysis.executive_summary.key_insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-violet-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Action Items</h5>
              <div className="space-y-2">
                {analysis.executive_summary.action_items.map((item, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-violet-50 text-violet-700">
                        {item.category}
                      </Badge>
                      <Badge className="bg-amber-50 text-amber-700">
                        {item.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 