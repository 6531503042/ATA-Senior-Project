"use client";

import { HelpCircle, BarChart2, Target, Lightbulb } from "lucide-react";
import React from "react";

const QuestionDashboard = () => {
  interface MenuOption {
    title: string;
    number: string;
    icon: React.FC<any>;
    color: string;
    background?: string;
    subtitle?: string;
    subtitle_color?: string;
    trend?: string;
  }

  const options: MenuOption[] = [
    {
      title: "Active Questions",
      number: "156",
      trend: "+12 this month",
      icon: HelpCircle,
      color: "text-blue-500",
      subtitle: "Questions in use",
      background: "bg-blue-50",
    },
    {
      title: "Engagement Rate",
      number: "87%",
      trend: "+5% vs last month",
      icon: Target,
      color: "text-green-500",
      subtitle: "Average response rate",
      background: "bg-green-50",
    },
    {
      title: "Top Performing",
      number: "Customer Service",
      trend: "92% response rate",
      icon: BarChart2,
      color: "text-purple-500",
      subtitle: "Most engaged category",
      background: "bg-purple-50",
    },
    {
      title: "Insights Generated",
      number: "1,284",
      trend: "+243 this week",
      icon: Lightbulb,
      color: "text-amber-500",
      subtitle: "Data points collected",
      background: "bg-amber-50",
    },
  ];

  return (
    <div className="px-3 w-full h-full overflow-x-auto">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-amber-500">
            Question Analytics
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Monitor question performance and feedback insights
          </p>
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
                    <p className="text-sm font-medium text-zinc-500">
                      {option.title}
                    </p>
                    <p className="text-2xl font-bold">{option.number}</p>
                    <div className="flex flex-col gap-1">
                      {option.trend && (
                        <p className="text-xs font-medium text-green-500">
                          {option.trend}
                        </p>
                      )}
                      {option.subtitle && (
                        <p className="text-xs text-zinc-400">
                          {option.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${option.background} p-3 rounded-lg hidden sm:block ${option.color}`}
                  >
                    <Icon className={``} strokeWidth={2.7} />
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

export default QuestionDashboard;
