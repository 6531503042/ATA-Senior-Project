import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2,
  AlertTriangle,
  Brain,
  ThumbsUp,
  CheckCircle2,
  AlertCircle,
  Target,
  Lightbulb,
} from "lucide-react";
import { cn, normalizeScore, formatScoreAsPercentage } from "@/lib/utils";
import type {
  SubmissionResponse,
  FeedbackAnalysis,
} from "@/lib/api/submissions";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
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
  question_id: number | string;
  question_text: string;
  question_type: string;
  response: string;
  score: number;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  suggestions: Array<{
    type: string;
    content: string;
    score?: number;
    details?: string[];
  }>;
  improvement_priorities: Array<{
    description: string;
    priority: string;
  }>;
  category: string | null;
}

interface SubmissionAnalysisProps {
  submissionData: SubmissionResponse;
}

export function SubmissionAnalysis({
  submissionData,
}: SubmissionAnalysisProps) {
  const analysis = submissionData.analysis as FeedbackAnalysis | null;

  const renderQuestionResponse = (
    question: QuestionDetail,
    response: string,
    questionAnalysis: QuestionAnalysis | undefined,
  ) => {
    const renderScore = (score: number) => {
      const normalizedScore = normalizeScore(score);

      return (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                normalizedScore >= 80
                  ? "bg-green-500"
                  : normalizedScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500",
              )}
              style={{ width: `${normalizedScore}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {formatScoreAsPercentage(score)}
          </span>
        </div>
      );
    };

    const renderSentimentBadge = (
      sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE",
    ) => {
      const sentimentConfig = {
        POSITIVE: {
          bg: "bg-emerald-50 hover:bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
          emoji: "😊",
        },
        NEUTRAL: {
          bg: "bg-gray-50 hover:bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          emoji: "😐",
        },
        NEGATIVE: {
          bg: "bg-red-50 hover:bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          emoji: "😞",
        },
      };
      const config = sentimentConfig[sentiment];

      return (
        <Badge
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 shadow-sm transition-colors",
            "border",
            config.bg,
            config.text,
            config.border,
          )}
        >
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
                <span className="text-sm font-medium text-violet-700">
                  Response Score
                </span>
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
                <span className="text-sm font-medium text-gray-700">
                  Sentiment Analysis
                </span>
                {renderSentimentBadge(questionAnalysis.sentiment)}
              </div>
              {questionAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="mt-2">
                  {suggestion.score && renderScore(suggestion.score)}
                </div>
              ))}
              {questionAnalysis.improvement_priorities.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Improvement Priorities
                  </h5>
                  <div className="space-y-2">
                    {questionAnalysis.improvement_priorities.map(
                      (priority, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              priority.priority.toLowerCase() === "high"
                                ? "bg-red-50 text-red-700"
                                : priority.priority.toLowerCase() === "medium"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700",
                            )}
                          >
                            {priority.priority}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {priority.description}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!analysis) {
    return (
      <Card className="p-6 bg-amber-50">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <h3 className="text-base font-medium text-amber-800">
              Analysis Not Available
            </h3>
            <p className="text-sm text-amber-600">
              This submission has not been analyzed yet or analysis data is not
              available.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Analysis Summary
            </h3>
            <p className="text-sm text-gray-500">
              AI-powered insights from this submission
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-violet-700 mb-2">
              Overall Score
            </h4>
            <div className="text-2xl font-bold text-violet-900">
              {analysis.overall_score
                ? formatScoreAsPercentage(analysis.overall_score)
                : "N/A"}
            </div>
          </div>
          <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-emerald-700 mb-2">
              Response Quality
            </h4>
            <div className="text-2xl font-bold text-emerald-900">
              {analysis.key_metrics?.response_quality
                ? formatScoreAsPercentage(analysis.key_metrics.response_quality)
                : "N/A"}
            </div>
          </div>
          <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              Sentiment Score
            </h4>
            <div className="text-2xl font-bold text-blue-900">
              {analysis.key_metrics?.sentiment_score
                ? formatScoreAsPercentage(analysis.key_metrics.sentiment_score)
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-emerald-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">
                Key Strengths
              </h4>
            </div>
            <div className="space-y-3">
              {analysis.executive_summary.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-800">
                        {strength.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-white text-emerald-700">
                          {strength.category?.replace("_", " ") || "General"}
                        </Badge>
                        <Badge className="bg-white text-emerald-700">
                          Score: {strength.score.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">
                Areas for Improvement
              </h4>
            </div>
            <div className="space-y-3">
              {analysis.executive_summary.weaknesses.length > 0 ? (
                analysis.executive_summary.weaknesses.map((weakness, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-red-800">
                          {weakness.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-white text-red-700">
                            {weakness.category?.replace("_", " ") || "General"}
                          </Badge>
                          <Badge className="bg-white text-red-700">
                            Score: {weakness.score.toFixed(1)}%
                          </Badge>
                        </div>
                        {/* Add improvement priorities if available */}
                        {analysis.question_analyses.map((qa) => {
                          if (
                            qa.category === weakness.category &&
                            qa.improvement_priorities.length > 0
                          ) {
                            return (
                              <div
                                key={qa.question_id}
                                className="mt-3 space-y-2"
                              >
                                <p className="text-sm font-medium text-red-700">
                                  Suggested Improvements:
                                </p>
                                {qa.improvement_priorities.map(
                                  (priority, pIndex) => (
                                    <div
                                      key={pIndex}
                                      className="flex items-center gap-2 bg-white/50 p-2 rounded-lg"
                                    >
                                      <Badge
                                        className={cn(
                                          priority.priority.toLowerCase() ===
                                            "high"
                                            ? "bg-red-100 text-red-700"
                                            : priority.priority.toLowerCase() ===
                                                "medium"
                                              ? "bg-amber-100 text-amber-700"
                                              : "bg-emerald-100 text-emerald-700",
                                        )}
                                      >
                                        {priority.priority}
                                      </Badge>
                                      <span className="text-sm text-gray-700">
                                        {priority.description}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500">
                    No significant weaknesses identified
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-base font-medium text-gray-900">
              Action Items
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.executive_summary.action_items.map((item, index) => {
              let itemData;
              try {
                itemData = JSON.parse(item.description.replace(/'/g, '"'));
              } catch (error) {
                console.error("Failed to parse action item:", error);
                return null;
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn(
                          "p-4 bg-white rounded-lg border shadow-sm cursor-pointer",
                          "transition-all duration-200 ease-in-out",
                          item.priority === "High"
                            ? "hover:border-red-200"
                            : item.priority === "Medium"
                              ? "hover:border-yellow-200"
                              : "hover:border-emerald-200",
                          "hover:shadow-md",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Target className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-2">
                              {itemData.content}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-white border shadow-sm">
                                {item.category.replace("_", " ")}
                              </Badge>
                              <Badge
                                className={cn(
                                  "bg-white border shadow-sm",
                                  item.priority === "High"
                                    ? "text-red-700 border-red-200"
                                    : item.priority === "Medium"
                                      ? "text-yellow-700 border-yellow-200"
                                      : "text-emerald-700 border-emerald-200",
                                )}
                              >
                                {item.priority} Priority
                              </Badge>
                              {itemData.score && (
                                <Badge className="bg-white border shadow-sm">
                                  Score: {(itemData.score * 100).toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-96 bg-white p-4">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Action Item Details
                        </h4>
                        {itemData.details && itemData.details.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">
                              Implementation Steps:
                            </p>
                            <ul className="list-disc list-inside text-xs space-y-1.5">
                              {itemData.details.map(
                                (detail: string, i: number) => (
                                  <li key={i} className="text-gray-600">
                                    {detail}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Key Insights */}
        {analysis.executive_summary.key_insights.length > 0 && (
          <div className="mt-8 pt-6 border-t space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Lightbulb className="h-5 w-5 text-violet-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">
                Key Insights
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.executive_summary.key_insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-violet-50 border border-violet-100 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Brain className="h-4 w-4 text-violet-500" />
                    </div>
                    <p className="text-sm text-violet-800">{insight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Questions and Responses */}
      <div className="space-y-6">
        {submissionData.submission.questionDetails.map((question) => {
          const questionAnalysis = analysis.question_analyses?.find(
            (qa) => qa.question_id === question.id,
          );

          return (
            <Card key={question.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900 mb-1">
                      {question.text}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {question.description}
                    </p>
                    {renderQuestionResponse(
                      question,
                      submissionData.submission.responses[question.id],
                      questionAnalysis,
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Category Analysis */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
          </div>
          <h4 className="text-base font-medium text-gray-900">
            Category Analysis
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analysis.categories).map(([category, data]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative p-4 bg-white rounded-lg border border-indigo-100 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-indigo-300">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-900">
                    {category
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")}
                  </h5>
                  <Badge
                    className={cn(
                      "px-2 py-1 shadow-sm",
                      data.sentiment === "POSITIVE"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : data.sentiment === "NEGATIVE"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200",
                    )}
                  >
                    {data.sentiment}
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Category Score</span>
                    <span className="font-medium text-gray-900">
                      {formatScoreAsPercentage(data.score)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        normalizeScore(data.score) / 100 >= 0.7
                          ? "bg-emerald-500"
                          : normalizeScore(data.score) / 100 >= 0.4
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${normalizeScore(data.score)}%` }}
                    />
                  </div>
                </div>
                {data.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      Insights & Recommendations
                    </p>
                    {data.recommendations.map((rec, index) => {
                      try {
                        const recData = JSON.parse(rec.replace(/'/g, '"'));
                        return (
                          <HoverCard key={index}>
                            <HoverCardTrigger asChild>
                              <div
                                className={cn(
                                  "p-4 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer",
                                  "transition-all duration-200 ease-in-out",
                                  "hover:border-indigo-200 hover:shadow-md",
                                )}
                              >
                                <p className="text-sm text-gray-700">
                                  {recData.content}
                                </p>
                                {recData.score && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <Badge className="bg-white border border-indigo-100 text-indigo-700 shadow-sm">
                                      Confidence:{" "}
                                      {formatScoreAsPercentage(recData.score)}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 bg-white p-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">
                                  Detailed Analysis
                                </h4>
                                {recData.details &&
                                  recData.details.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {recData.details.map(
                                        (detail: string, i: number) => (
                                          <p
                                            key={i}
                                            className="text-xs text-gray-600"
                                          >
                                            {detail}
                                          </p>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        );
                      } catch (error) {
                        console.error("Failed to parse recommendation:", error);
                        return null;
                      }
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Improvement Areas */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Target className="h-5 w-5 text-amber-600" />
          </div>
          <h4 className="text-base font-medium text-gray-900">
            Improvement Areas
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.improvement_areas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative p-4 bg-white rounded-lg border border-amber-100 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-amber-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg shadow-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      {area.category
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(" ")}
                    </h5>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Current Score</span>
                        <span className="font-medium text-gray-900">
                          {formatScoreAsPercentage(area.score)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-sm">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            normalizeScore(area.score) / 100 >= 0.7
                              ? "bg-emerald-500"
                              : normalizeScore(area.score) / 100 >= 0.4
                                ? "bg-yellow-500"
                                : "bg-red-500",
                          )}
                          style={{ width: `${normalizeScore(area.score)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {area.recommendations.map((rec, recIndex) => {
                        try {
                          const recData = JSON.parse(rec.replace(/'/g, '"'));
                          return (
                            <HoverCard key={recIndex}>
                              <HoverCardTrigger asChild>
                                <div
                                  className={cn(
                                    "p-4 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer",
                                    "transition-all duration-200 ease-in-out",
                                    "hover:border-amber-200 hover:shadow-md",
                                  )}
                                >
                                  <p className="text-sm text-gray-700 font-medium">
                                    {recData.content}
                                  </p>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 bg-white p-4">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    Improvement Details
                                  </h4>
                                  {recData.details && (
                                    <div className="mt-2 space-y-1">
                                      {recData.details.map(
                                        (detail: string, i: number) => (
                                          <p
                                            key={i}
                                            className="text-xs text-gray-600"
                                          >
                                            {detail}
                                          </p>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          );
                        } catch (error) {
                          console.error(
                            "Failed to parse area recommendation:",
                            error,
                          );
                          return null;
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Overall Priorities */}
      {analysis.overall_priorities.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Target className="h-5 w-5 text-violet-600" />
            </div>
            <h4 className="text-base font-medium text-gray-900">
              Overall Priorities
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.overall_priorities.map((priority, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-violet-50 border border-violet-100 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Target className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm text-violet-800">{priority.name}</p>
                    <Badge className="mt-2 bg-white text-violet-700">
                      Score: {formatScoreAsPercentage(priority.score)}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
