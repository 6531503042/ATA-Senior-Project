"use client";

import { MessageSquare, ThumbsUp, ThumbsDown, Clock, Brain } from "lucide-react";
import React from "react";
import MenuOption from "@/app/modules/components/MenuOption";
import { SatisfactionOverview } from "../../../../../../libs/components/SatisfactionArea";

const FeedbackDashboard = () => {

  const options = [
    {
      title: "Total Feedback",
      number: "2,847",
      trend: "+156 this week",
      icon: MessageSquare,
      color: "text-blue-500",
      subtitle: "Responses collected",
      background: "bg-blue-50",
    },
    {
      title: "Positive Feedback",
      number: "78%",
      trend: "+5% vs last month",
      icon: ThumbsUp,
      color: "text-green-500",
      subtitle: "1,986 responses",
      background: "bg-green-50",
    },
    {
      title: "Negative Feedback",
      number: "22%",
      trend: "-3% vs last month",
      icon: ThumbsDown,
      color: "text-red-500",
      subtitle: "861 responses",
      background: "bg-red-50",
    },
    {
      title: "Sentiment Score",
      number: "84%",
      trend: "+2% vs last month",
      icon: Brain,
      color: "text-amber-500",
      subtitle: "Overall sentiment score",
      background: "bg-amber-50",
    },
  ];

  return (
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-600">
            Feedback Analytics
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Monitor feedback trends and sentiment analysis
          </p>
        </div>
        <div className="w-full h-auto mt-9">
          <SatisfactionOverview />
        </div>
        <div className="w-full h-auto mt-9">
        <ul className="grid 2xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
            {options.map((option, index) => (
              <MenuOption
                key={index}
                title={option.title}
                number={option.number}
                icon={option.icon}
                color={option.color}
                background={option.background}
                subtitle={option.subtitle}
                subtitle_color="text-zinc-400"
                trend={option.trend}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
