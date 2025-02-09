"use client";

import { Users, Calendar, FolderOpen } from "lucide-react";
import React from "react";

const ProjectManage = () => {
  interface MenuOption {
    title: string;
    number: string;
    icon: React.FC<any>;
    color?: string;
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
      subtitle: "Currently in progress",
      icon: FolderOpen,
      color: "text-violet-500",
      background: "bg-violet-50",
    },
    {
      title: "Upcoming Projects",
      number: "5",
      subtitle: "Starting this month",
      icon: Calendar,
      color: "text-red-500",
      background: "bg-red-50",
    },
    {
      title: "Team Members",
      number: "48",
      subtitle: "Across all projects",
      icon: Users,
      color: "text-green-400",
      background: "bg-green-50",
    },
  ];
  

  return (
    <div className="px-3 w-full h-full overflow-x-auto">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-violet-600">
            Projects Dashboard
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Manage and track your feedback collection projects
          </p>
        </div>
        <div className="w-full h-auto mt-9">
          <ul className="grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
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
                      className={`text-sm font-normal text-zinc-500`}
                    >
                      {option.subtitle}
                    </p>
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

export default ProjectManage;
