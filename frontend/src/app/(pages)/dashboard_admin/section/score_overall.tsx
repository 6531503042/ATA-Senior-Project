"use client";

import { FileText, UserPlus, ThumbsUp, Hourglass } from "lucide-react";
import React from "react";

const score_overall = () => {
  interface MenuOption {
    title: string;
    number: string;
    icon: React.FC<any>;
    color: string;
    background?: string;
    subtitle?: string;
    trend?: string;
    subtitle_color?: string;
  }

  const options: MenuOption[] = [
    {
      title: "Total Feedback Submissions",
      number: "1,847",
      trend: "+234 this week",
      subtitle: "85% completion rate",
      icon: FileText,
      color: "text-blue-500",
      background: "bg-blue-50",
      subtitle_color: "text-blue-600",
    },
    {
      title: "Engaged Participants",
      number: "526",
      trend: "+48 new users",
      subtitle: "92% engagement rate",
      icon: UserPlus,
      color: "text-violet-500",
      background: "bg-violet-50",
      subtitle_color: "text-violet-600",
    },
    {
      title: "Average Feedback Score",
      number: "4.8",
      trend: "↑ 0.3 vs last month",
      subtitle: "From 2,456 ratings",
      icon: ThumbsUp,
      color: "text-amber-500",
      background: "bg-amber-50",
      subtitle_color: "text-amber-600",
    },
    {
      title: "Average Feedback Resolution Time",
      number: "1.2h",
      trend: "↓ 0.5h faster",
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
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <li
                  key={index}
                  className="flex-1 p-6 flex flex-row items-center justify-between border border-opacity-5 border-black rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-zinc-600">
                      {option.title}
                    </p>
                    <p className="text-2xl font-bold">{option.number}</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-green-500">
                        {option.trend}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`${option.background} p-3 rounded-lg hidden sm:block ${option.color}`}
                  >
                    <Icon className={``} strokeWidth={2} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default score_overall;
