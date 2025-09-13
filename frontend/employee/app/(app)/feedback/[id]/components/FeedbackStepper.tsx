import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/libs/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface FeedbackStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const FeedbackStepper: React.FC<FeedbackStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index <= currentStep;

          return (
            <React.Fragment key={step.title}>
              {/* Step indicator */}
              <div className="flex flex-col items-center relative group">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    isCompleted
                      ? "bg-violet-600 border-violet-600"
                      : isCurrent
                        ? "border-violet-600 bg-violet-50"
                        : "border-gray-300 bg-white",
                    isClickable && "cursor-pointer hover:shadow-md",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle
                      className={cn(
                        "w-6 h-6",
                        isCurrent ? "text-violet-600" : "text-gray-400",
                      )}
                    />
                  )}

                  {/* Step label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "text-violet-600" : "text-gray-500",
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 relative">
                  <div className="absolute inset-0 bg-gray-200" />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="absolute inset-0 bg-violet-600"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackStepper;
