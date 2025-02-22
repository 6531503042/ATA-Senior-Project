"use client";

import {
  Users,
  Calendar,
  FolderOpen,
  CircleDot,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FormPop from "@/app/(pages)/admin/components/forms/ProjectManagement";
import MenuOption from "@/app/(pages)/admin/components/MenuOption";
import GetAllProjectByAPI from "@/app/(pages)/admin/components/api/GetAllProject";

interface Post {
  id: number;
  text: string;
  questionType: string;
  category: string;
}

const ProjectManage = () => {
  const [formPop, SetFormPop] = useState(false);
  const [feedbackData, setFeedbackData] = useState<Post[]>([]);
    const [questionData, setQuestionData] = useState<Post[]>([]);

  const options = [
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
    <div className="px-3 w-full h-full">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-row w-full h-auto items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-blue-600">
              Project Management
            </h1>
            <p className="text-base text-gray-500 font-normal">
              Manage and track your feedback collection projects
            </p>
          </div>
          <button
            onClick={() => SetFormPop(true)}
            className="flex flex-row gap-2 text-white bg-blue-600 p-2.5 rounded-xl text-sm font-semibold items-center shadow-lg hover:shadow-xl transition-all"
          >
            <CircleDot className="w-4 h-4" />
            <p>New Project</p>
          </button>
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
              />
            ))}
          </ul>
        </div>
        
        {/* List All Project in DATABASE */}
        <GetAllProjectByAPI />
      </div>
      {formPop && <FormPop setIsOpen={SetFormPop} />}
    </div>
  );
};

export default ProjectManage;
