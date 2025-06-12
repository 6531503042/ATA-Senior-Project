"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SatisfactionMeter = ({
  percentage,
  previousYear,
}: {
  percentage: number;
  previousYear: number;
}) => {
  // Ensure percentage and previousYear are valid numbers
  const validPercentage = isNaN(percentage) ? 0 : percentage;
  const validPreviousYear = isNaN(previousYear) ? 0 : previousYear;

  // Ensure percentage is between 0 and 100 (limiting to 100)
  const normalizedPercentage = Math.min(Math.max(validPercentage, 0), 80);
  const angle = (normalizedPercentage / 100) * 90; // Angle from 0 to 90 degrees (semi-circle)
  const radius = 120; // Reduced radius to prevent overflow

  // Calculate the (x, y) position for the progress arc
  const x = 150 + radius * Math.cos((angle - 90) * (Math.PI / 180)); // -90 to start from the left
  const y = 150 + radius * Math.sin((angle - 90) * (Math.PI / 180)); // -90 to start from the top

  // Fixed emoji position at 100% (end of the arc, 180 degrees)
  const emojiX = 150 + radius * Math.cos(0 * (Math.PI / 180)); // Fixed at 180 degrees
  const emojiY = 150 + radius * Math.sin(0 * (Math.PI / 180)); // Fixed at 180 degrees

  // Calculate year-over-year change
  const change = normalizedPercentage - validPreviousYear;
  const changeText = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div className="relative w-full aspect-[3/2] max-w-[400px]">
        <svg viewBox="0 0 300 200" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 30 150 A 120 120 0 0 1 270 150"
            className="stroke-slate-200"
            fill="none"
            strokeWidth="25"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.path
            d={`M 30 150 A 120 120 0 ${angle > 90 ? 1 : 0} 1 ${x} ${y}`}
            className="stroke-violet-500"
            fill="none"
            strokeWidth="25"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: normalizedPercentage / 100 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          {/* Emoji at fixed 100% position */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            <circle
              cx={emojiX}
              cy={emojiY}
              r="18"
              className="fill-yellow-400"
            />
            <text
              x={emojiX}
              y={emojiY + 7}
              textAnchor="middle"
              className="text-2xl select-none"
            >
              {normalizedPercentage >= 80
                ? "😊"
                : normalizedPercentage >= 50
                  ? "😐"
                  : "😞"}
            </text>
          </motion.g>
        </svg>
      </div>

      <div className="absolute bottom-10 w-full flex justify-between px-4 text-sm font-medium ">
        <span className="text-gray-400">0%</span>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white px-6 py-3 rounded-2xl "
          >
            <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {normalizedPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Satisfaction Rate</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <ArrowUpRight
                className={cn(
                  "h-4 w-4",
                  change >= 0
                    ? "text-emerald-500"
                    : "text-red-500 transform rotate-90",
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  change >= 0 ? "text-emerald-600" : "text-red-600",
                )}
              >
                {changeText} vs Last Year
              </span>
            </div>
          </motion.div>
        </div>
        <span className="text-gray-400">100%</span>
      </div>
    </div>
  );
};

export default SatisfactionMeter;
