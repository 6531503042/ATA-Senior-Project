"use client";

import { FileText, UserPlus, ThumbsUp, Hourglass } from "lucide-react";
import React from "react";
import MenuOption from "@/app/(pages)/admin/components/MenuOption";

const score_overall = () => {
  const options = [
    {
      title: "Total Feedback Submissions",
      number: "2,153",
      trend: "+306 this week",
      subtitle: "87% completion rate",
      icon: FileText,
      color: "text-blue-500",
      background: "bg-blue-50",
      subtitle_color: "text-blue-600",
    },
    {
      title: "Engaged Participants",
      number: "612",
      trend: "+56 new users",
      subtitle: "94% engagement rate",
      icon: UserPlus,
      color: "text-violet-500",
      background: "bg-violet-50",
      subtitle_color: "text-violet-600",
    },
    {
      title: "Average Feedback Score",
      number: "4.6",
      trend: "↓ 0.2 vs last month",
      subtitle: "From 2,892 ratings",
      icon: ThumbsUp,
      color: "text-amber-500",
      background: "bg-amber-50",
      subtitle_color: "text-amber-600",
    },
    {
      title: "Average Feedback Resolution Time",
      number: "1.8h",
      trend: "↑ 0.6h slower",
      subtitle: "Average resolution time",
      icon: Hourglass,
      color: "text-green-500",
      background: "bg-green-50",
      subtitle_color: "text-green-600",
    },
  ];
  

  return (
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-blue-600">Score Analytics</h1>
          <div className="flex flex-col gap-1">
            <p className="text-base text-gray-600 font-normal">
              A quick overview of feedback statistics and engagement.
            </p>
          </div>
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

export default score_overall;
