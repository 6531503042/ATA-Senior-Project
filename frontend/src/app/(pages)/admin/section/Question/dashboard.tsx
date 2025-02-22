"use client";

import { HelpCircle, BarChart2, Target, Lightbulb } from "lucide-react";
import React from "react";
import MenuOption from "@/app/(pages)/admin/components/MenuOption";

const QuestionDashboard = () => {

  const options = [
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
      number: "Customer Support",
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
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-violet-500">
            Question Analytics
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Monitor question performance and feedback insights
          </p>
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

export default QuestionDashboard;
