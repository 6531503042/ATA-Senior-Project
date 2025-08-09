import React from "react";
import { Smile, Meh, Frown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SentimentIndicatorProps {
  sentiment: "positive" | "neutral" | "negative";
  size?: number;
  showTooltip?: boolean;
  className?: string;
}

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({
  sentiment,
  size = 24,
  showTooltip = true,
  className = "",
}) => {
  const getIcon = () => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return (
          <Smile
            className="text-emerald-500 transition-transform hover:scale-110"
            size={size}
          />
        );
      case "neutral":
        return (
          <Meh
            className="text-amber-500 transition-transform hover:scale-110"
            size={size}
          />
        );
      case "negative":
        return (
          <Frown
            className="text-rose-500 transition-transform hover:scale-110"
            size={size}
          />
        );
      default:
        return null;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-emerald-50 border-emerald-200";
      case "neutral":
        return "bg-amber-50 border-amber-200";
      case "negative":
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const icon = getIcon();

  if (!showTooltip) {
    return (
      <div
        className={`p-2 rounded-full border ${getSentimentColor()} ${className}`}
      >
        {icon}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`p-2 rounded-full border cursor-help transition-all duration-200 ${getSentimentColor()} ${className}`}
          >
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{sentiment} Sentiment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SentimentIndicator;
