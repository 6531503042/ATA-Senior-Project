"use client";

import React from "react";
import { Textarea, RadioGroup, Card, CardBody } from "@heroui/react";
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Overall Comments
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
            className="min-h-[200px]"
            maxLength={MAX_TEXT_LENGTH}
          />
          <div className="flex justify-end">
            <span
              className={`text-sm ${
                overallComments.length >= MAX_TEXT_LENGTH * 0.9
                  ? "text-red-500 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {overallComments.length}/{MAX_TEXT_LENGTH} characters
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Privacy Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how you want your feedback to be shared.
          </p>
        </div>
        <RadioGroup
          value={privacyLevel}
          onValueChange={(value: string) =>
            onPrivacyChange(value as "PUBLIC" | "PRIVATE" | "ANONYMOUS")
          }
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="public"
              name="privacy"
              value="PUBLIC"
              checked={privacyLevel === "PUBLIC"}
              onChange={() => onPrivacyChange("PUBLIC")}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">Public</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Your feedback will be visible to the team
                </div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="private"
              name="privacy"
              value="PRIVATE"
              checked={privacyLevel === "PRIVATE"}
              onChange={() => onPrivacyChange("PRIVATE")}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">Private</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Only administrators can see your feedback
                </div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="anonymous"
              name="privacy"
              value="ANONYMOUS"
              checked={privacyLevel === "ANONYMOUS"}
              onChange={() => onPrivacyChange("ANONYMOUS")}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="anonymous" className="flex items-center gap-2 cursor-pointer">
              <UserCircle2 className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  Anonymous
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Your feedback will be visible but without your name
                </div>
              </div>
            </label>
          </div>
        </RadioGroup>
      </div>
    </motion.div>
  );
}