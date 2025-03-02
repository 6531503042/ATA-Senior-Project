import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SubmissionResponse } from '@/lib/api/submissions';
import { Progress } from '@/components/ui/progress';

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

interface SubmissionAnalysisProps {
  submissionData: SubmissionResponse;
}

export function SubmissionAnalysis({ submissionData }: SubmissionAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analysis = submissionData.analysis;

  const renderQuestionResponse = (
    question: QuestionDetail,
    response: string,
    questionAnalysis: QuestionAnalysis | undefined
  ) => {
    const renderScore = (score: number) => (
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              score >= 0.8 ? "bg-green-500" : 
              score >= 0.6 ? "bg-yellow-500" : 
              "bg-red-500"
            )}
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
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
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="text-base font-medium text-red-800">Error Loading Analysis</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6 bg-amber-50">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <h3 className="text-base font-medium text-amber-800">Analysis Not Available</h3>
            <p className="text-sm text-amber-600">
              This submission has not been analyzed yet or analysis data is not available.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-violet-700 mb-2">Overall Score</h4>
            <div className="text-2xl font-bold text-violet-900">
              {analysis.overall_score ? (analysis.overall_score * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
          <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-emerald-700 mb-2">Response Quality</h4>
            <div className="text-2xl font-bold text-emerald-900">
              {analysis.key_metrics?.response_quality ? 
                (analysis.key_metrics.response_quality * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
          <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-blue-700 mb-2">Sentiment Score</h4>
            <div className="text-2xl font-bold text-blue-900">
              {analysis.key_metrics?.sentiment_score ? 
                (analysis.key_metrics.sentiment_score * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        {analysis.executive_summary?.key_insights && analysis.executive_summary.key_insights.length > 0 && (
          <div className="mt-6 pt-6 border-t border-violet-100">
            <h4 className="text-sm font-medium text-violet-700 mb-3">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.executive_summary.key_insights.map((insight, index) => (
                <div key={index} className="p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {analysis.executive_summary?.action_items && analysis.executive_summary.action_items.length > 0 && (
          <div className="mt-6 pt-6 border-t border-violet-100">
            <h4 className="text-sm font-medium text-violet-700 mb-3">Action Items</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.executive_summary.action_items.map((item, index) => (
                <div key={index} className="p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-violet-50 text-violet-700 border border-violet-100">
                          {item.category}
                        </Badge>
                        <Badge className={cn(
                          item.priority.toLowerCase() === 'high' ? "bg-red-50 text-red-700 border-red-100" :
                          item.priority.toLowerCase() === 'medium' ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                          "bg-green-50 text-green-700 border-green-100"
                        )}>
                          {item.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Questions and Responses */}
      <div className="space-y-6">
        {submissionData.submission.questionDetails.map((question) => {
          const questionAnalysis = analysis.question_analyses?.find(
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
    </div>
  );
} 