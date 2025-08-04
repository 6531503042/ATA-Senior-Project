"use client";

import { Card, CardBody, CardHeader, Button, Avatar, Chip, Progress } from "@heroui/react";
import { EyeIcon, MoreVerticalIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";
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

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex justify-between items-center pb-4">
        <div>
          <h3 className="text-xl font-bold text-default-900">
            Recently Feedbacks
          </h3>
          <p className="text-sm text-default-500">
            latest feedback's projects
          </p>
        </div>
        <Button
          variant="light"
          color="primary"
          startContent={<EyeIcon className="w-4 h-4" />}
        >
          View All
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-default-200 hover:bg-default-50 transition-colors"
          >
            <Avatar
              src={feedback.avatar}
              className="w-12 h-12"
              showFallback
              name={feedback.projectTitle.charAt(0)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-default-900 truncate">
                  {feedback.projectTitle}
                </h4>
                <Chip
                  size="sm"
                  color={getStatusColor(feedback.status)}
                  variant="flat"
                >
                  {feedback.status}
                </Chip>
                <Chip
                  size="sm"
                  color={getSentimentColor(feedback.sentiment)}
                  variant="flat"
                  startContent={getSentimentIcon(feedback.sentiment)}
                >
                  {feedback.sentiment}
                </Chip>
              </div>
              <p className="text-sm text-default-600 mb-2 line-clamp-2">
                {feedback.description}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-default-500">
                  {feedback.participants} Participants
                </span>
                <span className="text-xs text-default-400">
                  {feedback.createdAt}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-default-700">
                  Score: {feedback.score}/10
                </span>
                <Progress
                  value={feedback.score * 10}
                  className="flex-1 max-w-32"
                  size="sm"
                  color={feedback.score >= 7 ? "success" : feedback.score >= 5 ? "warning" : "danger"}
                />
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
} 