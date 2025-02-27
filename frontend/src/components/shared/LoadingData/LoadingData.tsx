"use client";

import React from "react";

interface EnhancedLoadingIndicatorProps {
  message?: string;
  secondaryMessage?: string;
  theme?: "light" | "blue" | "gradient";
}

const LoadingData: React.FC<EnhancedLoadingIndicatorProps> = ({
  message = "Loading data...",
  secondaryMessage = "Please wait while we fetch the latest information",
  theme = "blue",
}) => {
  // Theme variations
  const themeStyles = {
    light: {
      bg: "bg-white bg-opacity-90",
      spinner: "border-gray-200 border-t-gray-600",
      text: "text-gray-700",
      secondaryText: "text-gray-500",
    },
    blue: {
      bg: "bg-white bg-opacity-90",
      spinner: "border-blue-200 border-t-blue-600",
      text: "text-blue-700",
      secondaryText: "text-blue-500",
    },
    gradient: {
      bg: "bg-slate-100 bg-opacity-10",
      spinner: "border-indigo-300 border-t-indigo-600",
      text: "text-indigo-700",
      secondaryText: "text-indigo-500",
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${currentTheme.bg} z-20 backdrop-blur-sm transition-all duration-300`}
    >
      <div className="flex flex-col items-center max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white">
        {/* Pulse ring animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-400" />
          <div
            className={`w-16 h-16 border-4 ${currentTheme.spinner} rounded-full animate-spin`}
          />
        </div>

        {/* Progress dots */}
        <div className="flex space-x-2 mt-6">
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Text */}
        <p className={`mt-4 ${currentTheme.text} font-medium text-lg`}>
          {message}
        </p>
        {secondaryMessage && (
          <p
            className={`mt-2 ${currentTheme.secondaryText} text-sm text-center`}
          >
            {secondaryMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingData;
