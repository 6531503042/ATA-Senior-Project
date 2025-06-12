"use client";

import { Progress } from "@/components/ui/progress";

interface FeedbackProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FeedbackProgress({
  currentStep,
  totalSteps,
}: FeedbackProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-medium">Overall Progress</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
