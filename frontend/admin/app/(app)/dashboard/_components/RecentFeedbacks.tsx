'use client';

import type { FeedbackItem } from '@/types/dashboard';

import { Avatar, Chip, Skeleton } from '@heroui/react';

interface RecentFeedbacksProps {
  feedbacks: FeedbackItem[];
  loading?: boolean;
}

export function RecentFeedbacks({
  feedbacks,
  loading = false,
}: RecentFeedbacksProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-2xl border border-default-200 bg-white shadow-lg hover:shadow-xl transition-all"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
              <Skeleton className="w-full h-3 rounded" />
            </div>
            <Skeleton className="w-16 h-6 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-default-400 text-xl">💬</span>
        </div>
        <p className="text-default-500 text-sm">No recent feedbacks</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.slice(0, 5).map((feedback, index) => (
        <div
          key={feedback.id || index}
          className="flex items-start gap-3 p-4 rounded-2xl border border-default-200 bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <Avatar
            className="flex-shrink-0 bg-primary text-white shadow-md"
            name={feedback.projectTitle?.charAt(0) || 'F'}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-default-900 truncate">
                {feedback.projectTitle}
              </p>
              <Chip
                className="ml-2 shadow-sm"
                color={getSentimentColor(feedback.sentiment)}
                size="sm"
                variant="flat"
              >
                {feedback.status}
              </Chip>
            </div>
            <p className="text-xs text-default-500 truncate mb-2">
              {feedback.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-default-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {feedback.participants} participants
              </span>
              <span>•</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                  feedback.sentiment?.toLowerCase() === 'positive'
                    ? 'bg-green-100 text-green-700'
                    : feedback.sentiment?.toLowerCase() === 'negative'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-default-100 text-default-700'
                }`}
              >
                {feedback.sentiment}
              </span>
              <span>•</span>
              <span className="font-medium">Score: {feedback.score}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
