import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  ListChecks,
  Star,
  MessageCircle,
  Lightbulb,
  CheckSquare,
  ArrowRight,
  Target,
  Briefcase,
  Heart,
  Users,
  ClipboardList,
  ThumbsUp,
  Code,
  MessagesSquare,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SubmissionResponse } from '@/lib/api/submissions';

interface SubmissionResponseAnalysisProps {
  submissionData: SubmissionResponse;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'WORK_ENVIRONMENT':
      return <Briefcase className="h-5 w-5 text-blue-600" />;
    case 'WORK_LIFE_BALANCE':
      return <Heart className="h-5 w-5 text-pink-600" />;
    case 'TEAM_COLLABORATION':
      return <Users className="h-5 w-5 text-indigo-600" />;
    case 'PROJECT_MANAGEMENT':
      return <ClipboardList className="h-5 w-5 text-purple-600" />;
    case 'PROJECT_SATISFACTION':
      return <ThumbsUp className="h-5 w-5 text-cyan-600" />;
    case 'TECHNICAL_SKILLS':
      return <Code className="h-5 w-5 text-emerald-600" />;
    case 'COMMUNICATION':
      return <MessagesSquare className="h-5 w-5 text-orange-600" />;
    case 'PERSONAL_GROWTH':
      return <GraduationCap className="h-5 w-5 text-teal-600" />;
    default:
      return <Target className="h-5 w-5 text-gray-600" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'WORK_ENVIRONMENT':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'WORK_LIFE_BALANCE':
      return 'bg-pink-50 text-pink-700 border-pink-100';
    case 'TEAM_COLLABORATION':
      return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'PROJECT_MANAGEMENT':
      return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'PROJECT_SATISFACTION':
      return 'bg-cyan-50 text-cyan-700 border-cyan-100';
    case 'TECHNICAL_SKILLS':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'COMMUNICATION':
      return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'PERSONAL_GROWTH':
      return 'bg-teal-50 text-teal-700 border-teal-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

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

const ResponseCard = ({ question, response }: { 
  question: { 
    id: number;
    text: string;
    description: string;
    questionType: string;
    category: string;
    choices: string[];
  }; 
  response: string;
}) => {
  const renderResponse = () => {
    if (!response) {
      return (
        <div className="mt-2 p-4 bg-amber-50 rounded-lg text-amber-700 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>No response provided</span>
          </div>
        </div>
      );
    }

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        const choices = response.split(', ').filter(Boolean);
        if (choices.length === 0) {
          return (
            <div className="mt-2 p-4 bg-amber-50 rounded-lg text-amber-700 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>No options selected</span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {choices.map((choice, index) => (
              <Badge
                key={index}
                className="bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1.5"
              >
                {choice}
              </Badge>
            ))}
          </div>
        );

      case 'SENTIMENT':
        const sentimentColors = {
          'POSITIVE': {
            bg: 'bg-green-50',
            text: 'text-green-700',
            border: 'border-green-100',
            icon: '😊'
          },
          'NEUTRAL': {
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-100',
            icon: '😐'
          },
          'NEGATIVE': {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-100',
            icon: '😞'
          }
        };
        const sentiment = sentimentColors[response as keyof typeof sentimentColors] || sentimentColors.NEUTRAL;
        
        return (
          <div className="flex items-center gap-2 mt-2">
            <Badge
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-base",
                sentiment.bg,
                sentiment.text,
                sentiment.border
              )}
            >
              <span className="text-xl">{sentiment.icon}</span>
              <span className="font-medium">{response}</span>
            </Badge>
          </div>
        );

      case 'TEXT_BASED':
        if (!response.trim()) {
          return (
            <div className="mt-2 p-4 bg-amber-50 rounded-lg text-amber-700 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>No text response provided</span>
              </div>
            </div>
          );
        }

        const points = response.split('. ').filter(point => point.trim());
        
        return (
          <div className="mt-2 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <p className="text-sm leading-relaxed">{response}</p>
            </div>
            
            {points.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-violet-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium text-violet-700">Key Points</span>
                  </div>
                  <ul className="space-y-2">
                    {points.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-violet-700">{point.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Analysis</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-emerald-600">Main Focus</span>
                        <p className="text-sm text-emerald-700">{points[0]}</p>
                      </div>
                    </div>
                    {points.length > 1 && (
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <div>
                          <span className="text-xs font-medium text-emerald-600">Supporting Points</span>
                          <ul className="mt-1 space-y-1">
                            {points.slice(1).map((point, index) => (
                              <li key={index} className="text-sm text-emerald-700">
                                {point.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 text-sm">
            {response}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="p-3 bg-gray-50 rounded-xl">
            {getQuestionTypeIcon(question.questionType)}
          </div>
          <div className="mt-4 flex justify-center">
            <div className={cn(
              "p-2 rounded-lg transition-transform hover:scale-110",
              getCategoryColor(question.category)
            )}>
              {getCategoryIcon(question.category)}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900">{question.text}</h4>
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            </div>
            <Badge className={cn(
              "ml-4 whitespace-nowrap",
              getCategoryColor(question.category)
            )}>
              {question.category.split('_').map(word => 
                word.charAt(0) + word.slice(1).toLowerCase()
              ).join(' ')}
            </Badge>
          </div>
          <div className="mt-4">
            {renderResponse()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function SubmissionResponseAnalysis({ submissionData }: SubmissionResponseAnalysisProps) {
  const { submission } = submissionData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Response Analysis</h3>
            <p className="text-sm text-gray-500">Detailed analysis of each response</p>
          </div>
        </div>
      </div>

      {/* Questions and Responses */}
      <div className="space-y-6">
        {submission.questionDetails.map((question) => (
          <ResponseCard
            key={question.id}
            question={question}
            response={submission.responses[question.id]}
          />
        ))}
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
        <p className="text-gray-700 leading-relaxed">{submission.overallComments}</p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-violet-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-700">Key Insights</span>
              </div>
              <ul className="list-disc list-inside text-sm text-violet-600 space-y-1">
                {submission.overallComments.split('. ').map((insight, index) => (
                  <li key={index}>{insight.trim()}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Areas of Focus</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(submission.questionDetails.map(q => q.category))).map((category, index) => (
                  <Badge key={index} className={cn("px-3 py-1", getCategoryColor(category))}>
                    {category.split('_').map(word => 
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 