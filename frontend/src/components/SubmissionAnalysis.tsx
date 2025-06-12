"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Brain,
  Target,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Lightbulb,
  Clock,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  project_id: number;
  project_name: string;
  submitted_by: string | null;
  submitted_at: string;
  executive_summary: ExecutiveSummary;
  question_analyses: QuestionAnalysis[];
  overall_score: number;
  overall_sentiment: string;
  overall_suggestions: string[];
  overall_priorities: Array<{
    name: string;
    score: number;
  }>;
  categories: Record<string, unknown>;
  satisfaction_score: number;
  improvement_areas: string[];
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
    privacyLevel: "PUBLIC" | "ANONYMOUS";
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
    case "positive":
      return <ThumbsUp className="h-5 w-5 text-emerald-500" />;
    case "negative":
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
  }
};

const QuestionResponseCard = ({
  question,
  analysis,
}: {
  question: QuestionDetail;
  analysis: QuestionAnalysis;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-emerald-500";
    if (score >= 0.7) return "text-amber-500";
    return "text-red-500";
  };

  const getBgColor = (score: number) => {
    if (score >= 0.9) return "bg-emerald-50 border-emerald-100";
    if (score >= 0.7) return "bg-amber-50 border-amber-100";
    return "bg-red-50 border-red-100";
  };

  const getProgressColor = (score: number) => {
    if (score >= 0.9) return "bg-emerald-500";
    if (score >= 0.7) return "bg-amber-500";
    return "bg-red-500";
  };

  const getResponseDisplay = () => {
    if (
      question.questionType === "MULTIPLE_CHOICE" &&
      question.choices.length > 0
    ) {
      const selectedChoices = question.response.split(", ");
      return (
        <div className="space-y-2 mt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.choices.map((choice, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                  selectedChoices.includes(choice)
                    ? "bg-violet-50 border border-violet-200 shadow-sm"
                    : "bg-gray-50 border border-gray-200 opacity-70",
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex-shrink-0",
                    selectedChoices.includes(choice)
                      ? "bg-violet-500 ring-2 ring-violet-200 ring-offset-1"
                      : "bg-gray-300",
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    selectedChoices.includes(choice)
                      ? "text-violet-700 font-medium"
                      : "text-gray-500",
                  )}
                >
                  {choice}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-violet-600 bg-violet-50 p-2 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Selected {selectedChoices.length} out of {question.choices.length}{" "}
              options
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-3">
        <p className="text-gray-700 whitespace-pre-line">{question.response}</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-violet-100 text-violet-700">
                  {question.questionType}
                </Badge>
                {question.category && (
                  <Badge className="bg-blue-100 text-blue-700">
                    {question.category}
                  </Badge>
                )}
              </div>
              {question.description && (
                <p className="text-sm text-gray-500 mt-2">
                  {question.description}
                </p>
              )}
            </div>
          </div>

          {/* Response Section */}
          <div
            className={cn(
              "rounded-xl p-6 mb-6 border shadow-sm transition-all duration-300",
              getBgColor(analysis.score),
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Brain className="h-5 w-5 text-violet-600" />
                </div>
                <h4 className="font-medium text-gray-900">Response Analysis</h4>
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center gap-2 cursor-help bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getScoreColor(analysis.score),
                      )}
                    >
                      {(analysis.score * 100).toFixed(1)}%
                    </span>
                    {getSentimentIcon(analysis.sentiment)}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Analysis Score: {(analysis.score * 100).toFixed(1)}%
                    </h4>
                    <p className="text-sm text-gray-500">
                      This score represents the quality and relevance of the
                      response.
                    </p>
                    <div className="pt-2 border-t border-gray-100">
                      <h4 className="font-medium text-sm">
                        Sentiment: {analysis.sentiment}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {analysis.sentiment === "POSITIVE"
                          ? "The response expresses a positive sentiment or satisfaction."
                          : analysis.sentiment === "NEGATIVE"
                            ? "The response expresses a negative sentiment or dissatisfaction."
                            : "The response expresses a neutral sentiment."}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700">
                    Response
                  </h5>
                  <Badge
                    className={cn(
                      "px-2 py-1",
                      analysis.sentiment === "POSITIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : analysis.sentiment === "NEGATIVE"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {getSentimentIcon(analysis.sentiment)}
                      <span>{analysis.sentiment}</span>
                    </div>
                  </Badge>
                </div>
                {getResponseDisplay()}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-500">
                    Response Score
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      getScoreColor(analysis.score),
                    )}
                  >
                    {(analysis.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.score * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      getProgressColor(analysis.score),
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </div>
                <h4 className="font-medium text-gray-900">Analysis Insights</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Target className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-medium text-amber-700">
                            {suggestion.type
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase(),
                              )
                              .join(" ")}
                          </span>
                          {suggestion.score && (
                            <Badge className="bg-white text-amber-700">
                              Score: {(suggestion.score * 100).toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-amber-800">{suggestion.content}</p>
                        {suggestion.details &&
                          suggestion.details.length > 0 && (
                            <ul className="mt-2 space-y-1 bg-white p-3 rounded-lg border border-amber-100">
                              {suggestion.details.map((detail, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-amber-600"
                                >
                                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-amber-500" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Priorities */}
          {analysis.improvement_priorities &&
            analysis.improvement_priorities.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-gray-900">
                    Improvement Priorities
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {analysis.improvement_priorities.map((priority, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Target className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-blue-800">
                            {priority.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge className="bg-white text-blue-700">
                              {priority.category || "General"}
                            </Badge>
                            <Badge className="bg-white text-blue-700">
                              Score: {priority.score.toFixed(1)}%
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
      </Card>
    </motion.div>
  );
};

const SubmissionAnalysis: React.FC<SubmissionAnalysisProps> = ({
  submissionData,
}) => {
  const { submission, analysis } = submissionData;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-3xl opacity-20 -mt-20 -mr-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full filter blur-3xl opacity-20 -mb-20 -ml-20" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Submission Analysis
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-violet-100">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(submission.submittedAt), "MMMM do, yyyy")}
                  </span>
                  <span className="text-violet-200">•</span>
                  <span>
                    {format(new Date(submission.submittedAt), "h:mm:ss a")}
                  </span>
                </div>
                <Badge
                  className={cn(
                    "text-lg px-4 py-2",
                    submission.privacyLevel === "PUBLIC"
                      ? "bg-emerald-400/20 text-emerald-100"
                      : "bg-amber-400/20 text-amber-100",
                  )}
                >
                  {submission.privacyLevel}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {submission.submittedBy ? (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-violet-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-violet-800">
                        {submission.submittedBy.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white">
                      User #{submission.submittedBy}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-violet-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-violet-800">
                        A
                      </span>
                    </div>
                    <span className="text-white">Anonymous</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <MessageSquare className="h-4 w-4 text-violet-200" />
                  <span className="text-white">
                    {submission.questionDetails.length} Questions
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-violet-200 mb-1">Overall Score</p>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <svg className="w-20 h-20">
                        <circle
                          className="text-violet-300/20"
                          strokeWidth="5"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="40"
                          cy="40"
                        />
                        <motion.circle
                          className="text-white"
                          strokeWidth="5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="40"
                          cy="40"
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{
                            strokeDasharray: `${analysis.overall_score * 100} 100`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{
                            transformOrigin: "center",
                            transform: "rotate(-90deg)",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xl font-bold text-white">
                          {(analysis.overall_score * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-violet-200 mb-1">Sentiment</p>
                  <div className="flex items-center justify-center mt-2">
                    <div className="p-3 bg-white/20 rounded-full">
                      {getSentimentIcon(analysis.overall_sentiment)}
                    </div>
                    <span className="ml-2 text-lg font-medium text-white">
                      {analysis.overall_sentiment}
                    </span>
                  </div>
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
            <h3 className="text-xl font-semibold text-gray-900">
              Executive Summary
            </h3>
            <Badge className="ml-auto bg-violet-100 text-violet-700">
              Overall Rating: {analysis.executive_summary.overall_rating}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analysis.executive_summary.strengths.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Key Strengths
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysis.executive_summary.strengths.map(
                    (strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-emerald-800">
                              {strength.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {strength.category && (
                                <Badge className="bg-white text-emerald-700">
                                  {strength.category}
                                </Badge>
                              )}
                              <Badge className="bg-white text-emerald-700">
                                Score: {strength.score.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Action Items */}
            {analysis.executive_summary.action_items.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 rounded-lg">
                    <Target className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Action Items
                  </h4>
                </div>
                <div className="space-y-3">
                  {analysis.executive_summary.action_items.map(
                    (item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Target className="h-4 w-4 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-amber-800">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
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
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Key Insights */}
          {analysis.executive_summary.key_insights &&
            analysis.executive_summary.key_insights.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Key Insights
                  </h4>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                  <ul className="space-y-2">
                    {analysis.executive_summary.key_insights.map(
                      (insight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
                            <Brain className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-blue-800">{insight}</span>
                        </motion.li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}

          {/* Overall Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 shadow-sm">
              <div className="text-sm text-violet-700 mb-1">Overall Score</div>
              <div className="text-2xl font-bold text-violet-900">
                {(analysis.overall_score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 shadow-sm">
              <div className="text-sm text-emerald-700 mb-1">Satisfaction</div>
              <div className="text-2xl font-bold text-emerald-900">
                {(analysis.satisfaction_score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="text-sm text-blue-700 mb-1">Response Quality</div>
              <div className="text-2xl font-bold text-blue-900">
                {(analysis.key_metrics.response_quality * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 shadow-sm">
              <div className="text-sm text-amber-700 mb-1">Sentiment Score</div>
              <div className="text-2xl font-bold text-amber-900">
                {(analysis.key_metrics.sentiment_score * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Question Analysis */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-sm">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Question Analysis
          </h3>
        </div>

        <ScrollArea className="h-[calc(100vh-24rem)]">
          <div className="space-y-6 pr-4">
            {submission.questionDetails.map((question) => {
              const questionAnalysis = analysis.question_analyses.find(
                (qa) => qa.question_id === question.id,
              );

              return questionAnalysis ? (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  analysis={questionAnalysis}
                />
              ) : null;
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SubmissionAnalysis;
