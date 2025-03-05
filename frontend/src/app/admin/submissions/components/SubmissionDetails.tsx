import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  CheckSquare, 
  ListChecks,
  Star,
  MessageCircle,
  Lock,
  Unlock,
  ChevronRight,
  Lightbulb,
  BarChart2,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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
    details?: string[];
  }>;
  improvement_priorities: Array<{
    category: string;
    score: number;
    description: string;
  }>;
  category: string;
}

interface Submission {
  id: number;
  feedbackId: number;
  submittedBy: string | null;
  responses: Record<string, string>;
  questionDetails: QuestionDetail[];
  overallComments: string;
  privacyLevel: 'ANONYMOUS' | 'PUBLIC';
  submittedAt: string;
  updatedAt: string;
  status?: 'analyzed' | 'pending' | 'error';
  feedback?: {
    projectName: string;
    title: string;
  };
  overallSentiment?: 'positive' | 'neutral' | 'negative';
  error?: string;
}

interface Analysis {
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

interface SubmissionDetailsProps {
  submission: Submission;
  analysis?: Analysis | null;
}

const QuestionResponse = ({ 
  question, 
  response, 
  analysis 
}: { 
  question: QuestionDetail; 
  response: string;
  analysis?: QuestionAnalysis;
}) => {
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return <CheckSquare className="h-5 w-5 text-blue-600" />;
      case 'MULTIPLE_CHOICE':
        return <ListChecks className="h-5 w-5 text-purple-600" />;
      case 'SENTIMENT':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'TEXT_BASED':
        return <MessageCircle className="h-5 w-5 text-green-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'WORK_ENVIRONMENT':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'WORK_LIFE_BALANCE':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'TEAM_COLLABORATION':
        return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'PROJECT_MANAGEMENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'NEUTRAL':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      case 'NEGATIVE':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return '😊';
      case 'NEUTRAL':
        return '😐';
      case 'NEGATIVE':
        return '😞';
      default:
        return '😐';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderResponse = () => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        const choices = response.split(', ');
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {choices.map((choice, index) => (
              <Badge
                key={index}
                className="bg-violet-50 text-violet-700 border border-violet-100"
              >
                {choice}
              </Badge>
            ))}
          </div>
        );
      case 'SENTIMENT':
        const sentimentColors = {
          'POSITIVE': 'bg-green-50 text-green-700 border-green-100',
          'NEUTRAL': 'bg-gray-50 text-gray-700 border-gray-100',
          'NEGATIVE': 'bg-red-50 text-red-700 border-red-100'
        };
        const sentimentEmojis = {
          'POSITIVE': '😊',
          'NEUTRAL': '😐',
          'NEGATIVE': '😞'
        };
        return (
          <div className="flex items-center gap-2 mt-2">
            <Badge
              className={cn(
                sentimentColors[response as keyof typeof sentimentColors] || sentimentColors.NEUTRAL,
                "text-base"
              )}
            >
              {sentimentEmojis[response as keyof typeof sentimentEmojis]} {response}
            </Badge>
          </div>
        );
      case 'TEXT_BASED':
        return (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
            {response}
          </div>
        );
      default:
        return <div className="mt-2 text-gray-700">{response}</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl p-4 bg-white"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getQuestionTypeIcon(question.questionType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-sm font-medium text-gray-900">{question.text}</h4>
            <Badge className={getCategoryColor(question.category)}>
              {question.category.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-3">{question.description}</p>
          {renderResponse()}
          
          {/* Analysis Section */}
          {analysis && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-violet-600" />
                  <h5 className="text-sm font-medium text-gray-900">Response Analysis</h5>
                </div>
                <Badge className={getSentimentColor(analysis.sentiment)}>
                  {getSentimentEmoji(analysis.sentiment)} {analysis.sentiment}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Response Score</span>
                    <span className={cn("text-sm font-medium", getScoreColor(analysis.score))}>
                      {(analysis.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={analysis.score * 100} 
                    className={cn("h-2", 
                      analysis.score >= 0.8 ? "bg-green-100" : 
                      analysis.score >= 0.6 ? "bg-yellow-100" : 
                      "bg-red-100"
                    )}
                  />
                </div>
                
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-medium text-gray-700">Analysis</span>
                    </div>
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        {suggestion.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function SubmissionDetails({ submission, analysis }: SubmissionDetailsProps) {
  if (!submission) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Submission #{submission.id}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/80 mt-1">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{format(new Date(submission.submittedAt), 'PPP')}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  <span>{format(new Date(submission.submittedAt), 'pp')}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
              {submission.submittedBy ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <User className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    User #{submission.submittedBy}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <User className="h-4 w-4 text-white/80" />
                  <span className="text-sm text-white/80 font-medium">Anonymous</span>
                </div>
              )}
              <Badge
                className={cn(
                  "flex items-center gap-1.5 py-2 px-3",
                  submission.privacyLevel === 'PUBLIC' 
                    ? "bg-emerald-400/20 text-white border-emerald-400/30"
                    : "bg-amber-400/20 text-white border-amber-400/30"
                )}
              >
                {submission.privacyLevel === 'PUBLIC' ? (
                  <Unlock className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
                {submission.privacyLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        {analysis && (
          <div className="bg-white p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Analysis Summary</h4>
                <p className="text-sm text-gray-500">AI-powered insights from this submission</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div className="p-4 md:p-5 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl shadow-sm border border-blue-100">
                <div className="text-sm text-blue-700 mb-1 font-medium">Overall Score</div>
                <div className="text-2xl md:text-3xl font-bold text-blue-900 flex items-baseline gap-2">
                  {(analysis.overall_score * 100).toFixed(1)}%
                  <span className="text-xs md:text-sm font-normal text-blue-600">confidence</span>
                </div>
                <Progress 
                  value={analysis.overall_score * 100} 
                  className="h-2 mt-2 bg-blue-200"
                />
              </div>
              <div className="p-4 md:p-5 bg-gradient-to-br from-violet-50 to-violet-100/30 rounded-xl shadow-sm border border-violet-100">
                <div className="text-sm text-violet-700 mb-1 font-medium">Response Quality</div>
                <div className="text-2xl md:text-3xl font-bold text-violet-900 flex items-baseline gap-2">
                  {(analysis.key_metrics.response_quality * 100).toFixed(1)}%
                  <span className="text-xs md:text-sm font-normal text-violet-600">score</span>
                </div>
                <Progress 
                  value={analysis.key_metrics.response_quality * 100} 
                  className="h-2 mt-2 bg-violet-200"
                />
              </div>
              <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl shadow-sm border border-emerald-100 sm:col-span-2 md:col-span-1">
                <div className="text-sm text-emerald-700 mb-1 font-medium">Sentiment Score</div>
                <div className="text-2xl md:text-3xl font-bold text-emerald-900 flex items-baseline gap-2">
                  {(analysis.key_metrics.sentiment_score * 100).toFixed(1)}%
                  <span className="text-xs md:text-sm font-normal text-emerald-600">positive</span>
                </div>
                <Progress 
                  value={analysis.key_metrics.sentiment_score * 100} 
                  className="h-2 mt-2 bg-emerald-200"
                />
              </div>
            </div>
            
            {analysis.executive_summary.key_insights.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h5 className="text-base font-semibold text-gray-900">Key Insights</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.executive_summary.key_insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-lg"
                    >
                      <div className="p-1.5 bg-amber-100 rounded-full flex-shrink-0">
                        <Target className="h-4 w-4 text-amber-600" />
                      </div>
                      <p className="text-sm text-amber-800">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Overall Comments */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Overall Comments</h4>
          </div>
          <div className="p-4 md:p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <p className="text-gray-700 leading-relaxed">{submission.overallComments}</p>
          </div>
        </div>
      </Card>

      {/* Responses */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-violet-100 rounded-xl">
            <ListChecks className="h-5 w-5 text-violet-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Responses</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {submission.questionDetails.map((question) => {
            const questionAnalysis = analysis?.question_analyses.find(
              (qa) => qa.question_id === question.id
            );
            
            return (
              <QuestionResponse
                key={question.id}
                question={question}
                response={submission.responses[question.id.toString()]}
                analysis={questionAnalysis}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
} 