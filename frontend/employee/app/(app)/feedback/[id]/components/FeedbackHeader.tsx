"use client";

import React from "react";
import { EmployeeFeedback } from "../../../../../types/employee";

interface FeedbackHeaderProps {
  feedback: EmployeeFeedback;
}

export function FeedbackHeader({ feedback }: FeedbackHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full">
          <span className="text-3xl">📋</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {feedback.title}
        </h1>
      </div>
      <div className="flex items-start justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 max-w-2xl mx-auto">
        <span className="text-xl">📝</span>
        <p className="text-gray-600 dark:text-gray-400 text-center">{feedback.description}</p>
      </div>
    </div>
  );
}