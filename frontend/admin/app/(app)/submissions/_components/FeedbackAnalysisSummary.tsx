'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Chip, Progress } from '@heroui/react';
import { BarChart3, Users, MessageCircle, TrendingUp, AlertCircle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import type { SubmitDto } from '@/types/submission';
import { apiRequest } from '@/utils/api';

type Props = {
  feedbackId: number;
  submissions: SubmitDto[];
};

type QuestionAnalysis = {
  id: number;
  text: string;
  type: string;
  responses: string[];
  commonResponses?: { text: string; count: number }[];
  averageRating?: number;
  sentimentSummary?: { positive: number; neutral: number; negative: number };
};

export default function FeedbackAnalysisSummary({ feedbackId, submissions }: Props) {
  const [questions, setQuestions] = useState<QuestionAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  // Load questions and analyze responses
  useEffect(() => {
    let mounted = true;
    const loadAnalysis = async () => {
      setLoading(true);
      try {
        // Get feedback questions
        const feedbackRes = await apiRequest<any>(`/api/feedbacks/${feedbackId}`, 'GET');
        const questionIds: number[] = feedbackRes.data?.questionIds || [];

        if (questionIds.length > 0) {
          // Get question details
          const questionDetails = await Promise.all(
            questionIds.map(id =>
              apiRequest<any>(`/api/questions/${id}`, 'GET')
                .then(r => r.data)
                .catch(() => ({ id, text: `Question #${id}`, questionType: 'TEXT' }))
            )
          );

          // Analyze responses for each question
          const analysis: QuestionAnalysis[] = questionDetails.map(question => {
            const responses = submissions
              .map(s => (s as any).responses?.[question.id])
              .filter(Boolean)
              .map(String);

            const analyzed: QuestionAnalysis = {
              id: question.id,
              text: question.text,
              type: question.questionType || 'TEXT',
              responses
            };

            // Analyze based on question type
            if (question.questionType === 'RATING') {
              const ratings = responses.map(Number).filter(n => !isNaN(n));
              analyzed.averageRating = ratings.length > 0 
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
                : 0;
            } else if (question.questionType === 'MULTIPLE_CHOICE') {
              const responseCount = new Map<string, number>();
              responses.forEach(r => {
                r.split(/[,;]\s*/).forEach(choice => {
                  responseCount.set(choice, (responseCount.get(choice) || 0) + 1);
                });
              });
              analyzed.commonResponses = Array.from(responseCount.entries())
                .map(([text, count]) => ({ text, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
            } else if (question.questionType === 'TEXT') {
              // Simple sentiment analysis for text responses
              const sentiments = responses.map(response => {
                const text = response.toLowerCase();
                if (text.includes('good') || text.includes('great') || text.includes('excellent') || 
                    text.includes('love') || text.includes('amazing') || text.includes('perfect')) {
                  return 'positive';
                } else if (text.includes('bad') || text.includes('terrible') || text.includes('awful') || 
                          text.includes('hate') || text.includes('worst')) {
                  return 'negative';
                } else {
                  return 'neutral';
                }
              });

              analyzed.sentimentSummary = {
                positive: sentiments.filter(s => s === 'positive').length,
                neutral: sentiments.filter(s => s === 'neutral').length,
                negative: sentiments.filter(s => s === 'negative').length
              };
            }

            return analyzed;
          });

          if (mounted) setQuestions(analysis);
        }
      } catch (error) {
        console.error('Failed to load analysis:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAnalysis();
    return () => { mounted = false; };
  }, [feedbackId, submissions]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalResponses = submissions.length;
    const completionRate = totalResponses > 0 ? 100 : 0; // All submissions are complete by definition
    
    // Calculate average quality from admin ratings (if any)
    const ratingsWithRatings = submissions.filter(s => (s as any).adminRating > 0);
    const averageQuality = ratingsWithRatings.length > 0
      ? ratingsWithRatings.reduce((sum, s) => sum + ((s as any).adminRating || 0), 0) / ratingsWithRatings.length
      : 0;

    // Sentiment distribution from admin analysis
    const sentiments = submissions.map(s => (s as any).adminSentiment).filter(Boolean);
    const sentimentStats = {
      positive: sentiments.filter(s => s === 'positive').length,
      neutral: sentiments.filter(s => s === 'neutral').length,
      negative: sentiments.filter(s => s === 'negative').length
    };

    return {
      totalResponses,
      completionRate,
      averageQuality,
      sentimentStats,
      analyzedCount: ratingsWithRatings.length
    };
  }, [submissions]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-default-200 rounded w-3/4 mb-2"></div>
            <div className="h-20 bg-default-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">{overallStats.totalResponses}</p>
            <p className="text-xs text-blue-600">Total Responses</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">{overallStats.completionRate}%</p>
            <p className="text-xs text-green-600">Completion Rate</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">
              {overallStats.averageQuality > 0 ? overallStats.averageQuality.toFixed(1) : 'N/A'}
            </p>
            <p className="text-xs text-purple-600">Avg Quality</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-4 text-center">
            <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-700">{overallStats.analyzedCount}</p>
            <p className="text-xs text-orange-600">Analyzed</p>
          </CardBody>
        </Card>
      </div>

      {/* Sentiment Overview */}
      {overallStats.sentimentStats.positive + overallStats.sentimentStats.neutral + overallStats.sentimentStats.negative > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardBody className="p-4">
            <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Overall Sentiment Analysis
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <ThumbsUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700">{overallStats.sentimentStats.positive}</p>
                <p className="text-xs text-green-600">Positive</p>
              </div>
              <div className="text-center">
                <Minus className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-700">{overallStats.sentimentStats.neutral}</p>
                <p className="text-xs text-gray-600">Neutral</p>
              </div>
              <div className="text-center">
                <ThumbsDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-700">{overallStats.sentimentStats.negative}</p>
                <p className="text-xs text-red-600">Negative</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Question Analysis */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-default-700 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Question-by-Question Analysis
        </h4>
        
        {questions.map((q, index) => (
          <Card key={q.id} className="bg-white border-default-200">
            <CardBody className="p-4">
              <div className="mb-3">
                <h5 className="text-sm font-medium text-default-800 mb-1">
                  Q{index + 1}: {q.text}
                </h5>
                <Chip size="sm" variant="flat" color="primary" className="text-xs">
                  {q.type} • {q.responses.length} responses
                </Chip>
              </div>

              {/* Rating Questions */}
              {q.type === 'RATING' && q.averageRating !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-default-600">Average Rating</span>
                    <span className="text-sm font-semibold text-default-900">
                      {q.averageRating.toFixed(1)}/5
                    </span>
                  </div>
                  <Progress 
                    value={(q.averageRating / 5) * 100} 
                    color="primary" 
                    size="sm"
                    className="w-full"
                  />
                </div>
              )}

              {/* Multiple Choice Questions */}
              {q.type === 'MULTIPLE_CHOICE' && q.commonResponses && (
                <div className="space-y-2">
                  <span className="text-sm text-default-600">Most Common Responses:</span>
                  <div className="space-y-1">
                    {q.commonResponses.slice(0, 3).map((response, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-default-700 truncate">{response.text}</span>
                        <Chip size="sm" variant="flat" color="secondary">
                          {response.count}
                        </Chip>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Questions with Sentiment */}
              {q.type === 'TEXT' && q.sentimentSummary && (
                <div className="space-y-2">
                  <span className="text-sm text-default-600">Response Sentiment:</span>
                  <div className="flex gap-2">
                    <Chip size="sm" variant="flat" color="success">
                      😊 {q.sentimentSummary.positive}
                    </Chip>
                    <Chip size="sm" variant="flat" color="default">
                      😐 {q.sentimentSummary.neutral}
                    </Chip>
                    <Chip size="sm" variant="flat" color="danger">
                      😞 {q.sentimentSummary.negative}
                    </Chip>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Research Recommendations */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardBody className="p-4">
          <h4 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Research & HR Insights
          </h4>
          <div className="space-y-2 text-sm text-indigo-700">
            <p>• <strong>Response Rate:</strong> {overallStats.completionRate}% completion indicates strong engagement</p>
            <p>• <strong>Quality Score:</strong> {overallStats.averageQuality > 0 ? `Average ${overallStats.averageQuality.toFixed(1)}/10 quality rating` : 'Quality analysis pending'}</p>
            <p>• <strong>Sentiment Trend:</strong> {overallStats.sentimentStats.positive > overallStats.sentimentStats.negative ? 'Overall positive feedback' : 'Mixed feedback patterns'}</p>
            <p>• <strong>Data Export:</strong> Use CSV export for statistical analysis and research purposes</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
