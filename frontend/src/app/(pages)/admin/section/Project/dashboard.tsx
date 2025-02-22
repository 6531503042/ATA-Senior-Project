"use client";

import { Folders, Users, MessageSquare, HelpCircle } from "lucide-react";
import React from "react";
import MenuOption from "@/app/(pages)/admin/components/MenuOption";

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

  const options = [
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
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-blue-600">
            Project Analytics
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Monitor project performance and team productivity
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

export default ProjectDashboard;
