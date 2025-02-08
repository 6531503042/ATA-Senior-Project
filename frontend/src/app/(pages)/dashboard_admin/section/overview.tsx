"use client";

import {
  ChartNoAxesColumn,
  CircleHelp,
  FolderOpenDot,
  LayoutDashboard,
  LucideIcon,
  MessageCircle,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import React from "react";

const overview = () => {
  interface MenuOption {
    title: string;
    number: string;
    icon: LucideIcon;
  }

  const options: MenuOption[] = [
    {
      title: "Total Responses",
      number: "1,234",
      icon: ChartNoAxesColumn ,
    },
    {
      title: "Active Users",
      number: "256",
      icon: UsersRound ,
    },
    {
      title: "Average Rating",
      number: "4.8",
      icon: Star,
    },
    {
      title: "Response Rate",
      number: "92%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="px-3 w-full h-full overflow-x-auto">
      <div className="w-full h-full">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-base text-gray-500 font-medium">
          Here's what's happening with your feedback system.
        </p>
        <div className="w-full h-auto mt-9">
          <ul className="grid 2xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5 ">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <li
                  key={index}
                  className="flex-1 p-6 flex flex-row  items-center justify-between border border-opacity-5 border-black rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-zinc-500">{option.title}</p>
                    <p className="text-2xl font-bold">{option.number}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg hidden sm:block">
                    <Icon className="" strokeWidth={2.5}/>
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

export default overview;
