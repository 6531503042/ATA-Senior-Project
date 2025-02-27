"use client";

import { BarChart2, Users, Star, Clock } from "lucide-react";
import React from "react";
import MenuOption from "@/components/shared/MenuOption";
import { AreaChartComponent } from "@/components/AreaChartComponent";
import { BarChartComponent } from "@/components/BarChartComponent";


const Overview = () => {
  const options = [
    {
      title: "Total Responses",
      number: "1,847",
      trend: "+234 this week",
      subtitle: "85% completion rate",
      icon: BarChart2,
      color: "text-blue-500",
      background: "bg-blue-50",
      subtitle_color: "text-blue-600",
    },
    {
      title: "Active Users",
      number: "526",
      trend: "+48 new users",
      subtitle: "92% engagement rate",
      icon: Users,
      color: "text-violet-500",
      background: "bg-violet-50",
      subtitle_color: "text-violet-600",
    },
    {
      title: "Average Rating",
      number: "4.8",
      trend: "↑ 0.3 vs last month",
      subtitle: "From 2,456 ratings",
      icon: Star,
      color: "text-amber-500",
      background: "bg-amber-50",
      subtitle_color: "text-amber-600",
    },
    {
      title: "Response Time",
      number: "1.2h",
      trend: "↓ 0.5h faster",
      subtitle: "Average resolution time",
      icon: Clock,
      color: "text-green-500",
      background: "bg-green-50",
      subtitle_color: "text-green-600",
    },
  ];

  return (
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-blue-600">Welcome back!</h1>
          <div className="flex flex-col gap-1">
            <p className="text-base text-gray-600 font-normal">
              Here's your feedback system overview
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <AreaChartComponent/>
          <BarChartComponent/>
        </div>
      </div>
    </div>
  );
};

export default Overview;
