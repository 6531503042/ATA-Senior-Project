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
  AlertTriangle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface QuestionDetail {
  id: number;
  text: string;
  description: string;
  questionType: string;
  category: string;
  choices: string[];
  response: string;
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

interface SubmissionDetailsProps {
  submission: Submission;
}

const QuestionResponse = ({ question, response }: { question: QuestionDetail; response: string }) => {
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
        </div>
      </div>
    </motion.div>
  );
};

export function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  if (!submission) return null;

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
              Submission #{submission.id}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(submission.submittedAt), 'PPP')}</span>
              <ChevronRight className="h-4 w-4" />
              <span>{format(new Date(submission.submittedAt), 'pp')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {submission.submittedBy ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                User #{submission.submittedBy}
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
              submission.privacyLevel === 'PUBLIC' 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
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

      {/* Overall Comments */}
      <Card className="bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Overall Comments</h4>
        <p className="text-gray-700">{submission.overallComments}</p>
      </Card>

      {/* Questions and Responses */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Responses</h4>
        <div className="grid grid-cols-1 gap-4">
          {submission.questionDetails.map((question) => (
            <QuestionResponse
              key={question.id}
              question={question}
              response={submission.responses[question.id]}
            />
          ))}
        </div>
      </div>

      {/* Analysis Status */}
      {submission.status === 'analyzed' ? (
        <Card className="bg-emerald-50 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckSquare className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-emerald-900">Analysis Complete</h4>
              <p className="text-sm text-emerald-700">
                This submission has been analyzed successfully.
              </p>
            </div>
          </div>
        </Card>
      ) : submission.status === 'error' ? (
        <Card className="bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-900">Analysis Failed</h4>
              <p className="text-sm text-red-700">
                {submission.error || 'An error occurred during analysis.'}
              </p>
            </div>
          </div>
        </Card>
      ) : submission.status === 'pending' ? (
        <Card className="bg-amber-50 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-amber-900">Analysis Pending</h4>
              <p className="text-sm text-amber-700">
                This submission is waiting to be analyzed.
              </p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
} 