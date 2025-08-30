"use client";

import React from "react";
import { Textarea } from "@components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";
import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";
import { Users, Lock, UserCircle2 } from "lucide-react";

const MAX_TEXT_LENGTH = 255;

interface FeedbackOverallCommentsProps {
  overallComments: string;
  privacyLevel: "PUBLIC" | "PRIVATE" | "ANONYMOUS";
  onCommentsChange: (comments: string) => void;
  onPrivacyChange: (privacy: "PUBLIC" | "PRIVATE" | "ANONYMOUS") => void;
}

export function FeedbackOverallComments({
  overallComments,
  privacyLevel,
  onCommentsChange,
  onPrivacyChange,
}: FeedbackOverallCommentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Comments Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Overall Comments
          </h3>
          <p className="text-sm text-gray-600">
            Please provide your overall feedback, suggestions, and any
            additional thoughts.
          </p>
        </div>
        <div className="space-y-2">
          <Textarea
            value={overallComments}
            onChange={(e) => {
              const text = e.target.value;
              if (text.length <= MAX_TEXT_LENGTH) {
                onCommentsChange(text);
              }
            }}
            placeholder="Share your thoughts here..."
            className="min-h-[200px] text-base p-6 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500 shadow-sm"
            maxLength={MAX_TEXT_LENGTH}
          />
          <div className="flex justify-end">
            <span
              className={cn(
                "text-sm",
                overallComments.length >= MAX_TEXT_LENGTH * 0.9
                  ? "text-red-500 font-medium"
                  : "text-gray-500",
              )}
            >
              {overallComments.length}/{MAX_TEXT_LENGTH} characters
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Privacy Settings
          </h3>
          <p className="text-sm text-gray-600">
            Choose how you want your feedback to be shared.
          </p>
        </div>
        <RadioGroup
          value={privacyLevel}
          onValueChange={(value: "PUBLIC" | "PRIVATE" | "ANONYMOUS") =>
            onPrivacyChange(value)
          }
          className="space-y-4"
        >
          <div
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              "hover:bg-violet-50/50 hover:border-violet-200 hover:shadow-md",
              privacyLevel === "PUBLIC"
                ? "border-violet-500 bg-violet-50/50 shadow-md"
                : "border-gray-200",
            )}
          >
            <RadioGroupItem value="PUBLIC" id="public" />
            <Label htmlFor="public" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-600" />
                <div className="text-lg font-medium text-gray-900">Public</div>
              </div>
              <div className="text-sm text-gray-600 ml-7">
                Your feedback will be visible to the team
              </div>
            </Label>
          </div>
          <div
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              "hover:bg-violet-50/50 hover:border-violet-200 hover:shadow-md",
              privacyLevel === "PRIVATE"
                ? "border-violet-500 bg-violet-50/50 shadow-md"
                : "border-gray-200",
            )}
          >
            <RadioGroupItem value="PRIVATE" id="private" />
            <Label htmlFor="private" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-violet-600" />
                <div className="text-lg font-medium text-gray-900">Private</div>
              </div>
              <div className="text-sm text-gray-600 ml-7">
                Only administrators can see your feedback
              </div>
            </Label>
          </div>
          <div
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              "hover:bg-violet-50/50 hover:border-violet-200 hover:shadow-md",
              privacyLevel === "ANONYMOUS"
                ? "border-violet-500 bg-violet-50/50 shadow-md"
                : "border-gray-200",
            )}
          >
            <RadioGroupItem value="ANONYMOUS" id="anonymous" />
            <Label htmlFor="anonymous" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-violet-600" />
                <div className="text-lg font-medium text-gray-900">
                  Anonymous
                </div>
              </div>
              <div className="text-sm text-gray-600 ml-7">
                Your feedback will be visible but without your name
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </motion.div>
  );
}
