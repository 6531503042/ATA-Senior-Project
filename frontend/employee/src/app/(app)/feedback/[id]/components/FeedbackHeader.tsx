"use client";

import { FeedbackSubmission } from "@/app/types/employee";

interface FeedbackHeaderProps {
  feedback: FeedbackSubmission;
}

export function FeedbackHeader({ feedback }: FeedbackHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {feedback.title}
      </h1>
      <p className="text-gray-500 max-w-2xl mx-auto">{feedback.description}</p>
    </div>
  );
}
