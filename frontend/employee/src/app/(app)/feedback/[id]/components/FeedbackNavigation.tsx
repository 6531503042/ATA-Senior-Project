"use client";

import { Button } from "@components/ui/button";
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
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {currentStep === totalSteps ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !canProceed}
          className="gap-2 bg-violet-600 hover:bg-violet-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              Submit Feedback
              <CheckCircle2 className="h-4 w-4" />
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2 bg-violet-600 hover:bg-violet-700"
        >
          {currentStep === totalSteps - 1 ? "Final Step" : "Next Question"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
