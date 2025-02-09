"use client";

import { Folders, Users, MessageSquare, HelpCircle } from "lucide-react";
import React from "react";

const ProjectDashboard = () => {
  interface MenuOption {
    title: string;
    number: string;
    icon: React.FC<any>;
    color: string;
    background?: string;
    subtitle?: string;
    subnumber?: string;
    subtitle_color?: string;
    trend?: string;
  }

  const options: MenuOption[] = [
    {
      title: "Active Projects",
      number: "12",
      subnumber: "+2",
      subtitle: "8 on track • 4 at risk",
      subtitle_color: "text-violet-600",
      trend: "75% completion rate",
      icon: Folders,
      color: "text-violet-500",
      background: "bg-violet-50",
    },
    {
      title: "Team Members",
      number: "48",
      subnumber: "+5",
      subtitle: "32 active • 16 on leave",
      subtitle_color: "text-red-600",
      trend: "89% engagement",
      icon: Users,
      color: "text-red-500",
      background: "bg-red-50",
    },
    {
      title: "Feedback Collected",
      number: "156",
      subnumber: "+23",
      subtitle: "142 positive • 14 pending",
      subtitle_color: "text-green-600",
      trend: "92% response rate",
      icon: MessageSquare,
      color: "text-green-400",
      background: "bg-green-50",
    },
    {
      title: "Active Questions",
      number: "280",
      subnumber: "+20",
      subtitle: "245 answered • 35 pending",
      subtitle_color: "text-yellow-600",
      trend: "87% resolution rate",
      icon: HelpCircle,
      color: "text-yellow-400",
      background: "bg-yellow-50",
    },
  ];

  return (
    <div className="px-3 w-full h-full overflow-x-auto">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-violet-600">
            Project Analytics
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Monitor project performance and team productivity
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
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-zinc-600">
                      {option.title}
                    </p>
                    <span className="flex flex-row items-center gap-2 py-1">
                      <p className="text-2xl font-bold">{option.number}</p>
                      <p className="text-green-500 text-sm font-medium">
                        {option.subnumber}
                      </p>
                    </span>
                    <p
                      className={`text-xs font-medium  ${option.subtitle_color}`}
                    >
                      {option.subtitle}
                    </p>
                    {option.trend && (
                      <p className="text-xs text-gray-500 mt-1">
                        {option.trend}
                      </p>
                    )}
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

export default ProjectDashboard;
