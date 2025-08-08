"use client";

import { Card, CardBody, CardHeader, Button, Avatar, Chip, Progress } from "@heroui/react";
import { EyeIcon, MoreVerticalIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, MessageSquareIcon, UsersIcon, CalendarIcon } from "lucide-react";
import type { Feedback } from "@/types/dashboard";

interface DashboardFeedbacksProps {
  feedbacks: Feedback[];
}

export function DashboardFeedbacks({ feedbacks }: DashboardFeedbacksProps) {
  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'analyzed':
        return 'success';
      case 'completed':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSentimentIcon = (sentiment: Feedback['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (sentiment: Feedback['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      case 'neutral':
        return 'default';
      default:
        return 'default';
    }
  };

  const getInitials = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      return words[0].charAt(0) + words[1].charAt(0);
    }
    return title.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full min-h-[500px]">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
            <MessageSquareIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-default-900">
              Recent Feedbacks
            </h3>
            <p className="text-sm text-default-500">
              Latest feedback analysis and insights
            </p>
          </div>
        </div>
        <Button
          variant="bordered"
          color="success"
          size="sm"
          startContent={<EyeIcon className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          View All
        </Button>
      </CardHeader>
      <CardBody className="space-y-4 p-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-default-200 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 cursor-pointer bg-white dark:bg-default-50"
          >
            <Avatar
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold shadow-md"
              showFallback
              name={getInitials(feedback.projectTitle)}
            >
              {getInitials(feedback.projectTitle)}
            </Avatar>
            
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="font-semibold text-default-900 truncate text-base">
                  {feedback.projectTitle}
                </h4>
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    color={getStatusColor(feedback.status)}
                    variant="flat"
                    className="text-xs font-medium"
                  >
                    {feedback.status}
                  </Chip>
                  <Chip
                    size="sm"
                    color={getSentimentColor(feedback.sentiment)}
                    variant="flat"
                    startContent={getSentimentIcon(feedback.sentiment)}
                    className="text-xs font-medium"
                  >
                    {feedback.sentiment}
                  </Chip>
                </div>
              </div>
              
              <p className="text-sm text-default-600 line-clamp-2 leading-relaxed">
                {feedback.description}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-4 text-xs text-default-500">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" />
                    <span>{feedback.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{feedback.createdAt}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-default-700">
                    Score: {feedback.score}/10
                  </span>
                  <div className="w-24">
                    <Progress
                      value={feedback.score * 10}
                      className="h-2"
                      color={feedback.score >= 7 ? "success" : feedback.score >= 5 ? "warning" : "danger"}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-default-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
} 