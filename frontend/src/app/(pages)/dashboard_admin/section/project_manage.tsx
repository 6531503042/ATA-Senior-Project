"use client";

import {
  Users,
  Calendar,
  FolderOpen,
  CircleDot,
  SlidersHorizontal,
  Search,
  MessageCircle,
  Ellipsis,
  Pencil,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormPop from "@/app/components/forms/create_project_manage";
import MenuOption from "@/app/components/MenuOption";

interface Post {
  id: number;
  name: string;
  memberIds: string[] | string | number[];
  description: string;
  projectStartDate: string;
  projectEndDate: string;
}

const ProjectManage = () => {
  const [postData, setPostData] = useState<Post[]>([]);

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

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const [formPop, SetFormPop] = useState(false);
  const router = useRouter();

  const countTotalUsers = (memberIds: string[] | string | number[]) => {
    if (Array.isArray(memberIds)) {
      return memberIds.length;
    }
    if (typeof memberIds === "string") {
      if (!memberIds.trim()) return 0;
      try {
        const parsed = JSON.parse(memberIds);
        if (Array.isArray(parsed)) {
          return parsed.length;
        }
      } catch {
        if (memberIds.includes(",")) {
          return memberIds.split(",").length;
        }
        return 1;
      }
    }
    return 0;
  };

  // Function to format date as mm/dd/yy
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      return `${month}/${day}/${year}`;
    } catch {
      return "Invalid Date";
    }
  };

  const getPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        "http://localhost:8084/api/v1/admin/projects/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data);
      setPostData(data);
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

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
        <div className="flex flex-row gap-5 items-center my-5">
          <div className="relative w-[640px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-5 text-sm py-2 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-[0.5px] focus:ring-zinc-200"
            />
          </div>
          <button className="hover:shadow-lg transition-all shadow-sm p-2 border border-black rounded-lg border-opacity-10">
            <SlidersHorizontal className="text-black text-opacity-80 w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 items-stretch gap-6 pb-5">
          {postData.length > 0 ? (
            postData.map((post) => (
              <label
                key={post.id}
                className="flex flex-row p-6 border border-slate-500 shadow-slate-100 hover:shadow-slate-100 border-opacity-5 rounded-md shadow-md hover:shadow-xl transition-all duration-200 bg-white"
              >
                <div className="flex flex-col gap-3 w-4/5 justify-between">
                  <h1
                    className="text-2xl font-semibold text-zinc-700 truncate"
                    title={post.name}
                  >
                    {truncateText(post.name, 25)}
                  </h1>
                  <p
                    className="font-normal text-gray-500 text-sm whitespace-normal break-words overflow-wrap-break-word"
                    title={post.description}
                  >
                    {truncateText(post.description, 120)}
                  </p>
                  <div className="flex flex-col gap-3 items-start">
                    <p className="font-medium text-xs py-1 px-2 shadow-md shadow-slate-100 border border-slate-500 border-opacity-5 rounded-2xl text-zinc-500">
                      {formatDate(post.projectStartDate)}
                    </p>
                    <p className="font-medium text-xs py-1 px-2 shadow-md shadow-slate-100 border border-slate-500 border-opacity-5 rounded-2xl text-stone-600">
                      {countTotalUsers(post.memberIds)} Members
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-1/4 items-end">
                  <button className="p-2 rounded-full hover:text-zinc-500 text-transparent transition-all duration-200">
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </div>
              </label>
            ))
          ) : (
            <p className="text-gray-500">No Project found.</p>
          )}
        </div>
      </div>
      {formPop && <FormPop setIsOpen={SetFormPop} />}
    </div>
  );
};

export default ProjectManage;
