"use client";

import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface FeedbackNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function FeedbackNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  canProceed,
  onPrevious,
  onNext,
  onSubmit,
}: FeedbackNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6">
      <Button
        variant="bordered"
        onClick={onPrevious}
        disabled={currentStep === 0}
        startContent={<ChevronLeft className="h-4 w-4" />}
      >
        Previous
      </Button>

      {currentStep === totalSteps ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !canProceed}
          color="primary"
          endContent={<CheckCircle2 className="h-4 w-4" />}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          color="primary"
          endContent={<ChevronRight className="h-4 w-4" />}
        >
          {currentStep === totalSteps - 1 ? "Final Step" : "Next Question"}
        </Button>
      )}
    </div>
  );
}