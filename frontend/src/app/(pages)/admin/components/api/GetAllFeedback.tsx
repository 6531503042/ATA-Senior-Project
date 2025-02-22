"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "@/app/(pages)/admin/components/dropdown-ui/DropdownProjectManage";
import {
  CalendarClock,
  Captions,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";

interface Post {
  id: number;
  title: string;
  description: string;
  project: {
    id: number;
    name: string;
    description: string;
    memberIds: number[];
    projectStartDate: string;
    projectEndDate: string;
  };
}


const GetAllFeedback = () => {
  const [postData, setPostData] = useState<Post[]>([]);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  {
    /* Limit the max text show up */
  }
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  {
    /* Count User by IDs */
  }
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

  {
    /* Change format date */
  }
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
        "http://localhost:8084/api/v1/admin/feedbacks/get-all",
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

  const filteredProjects = postData.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full py-8">
      <div className="relative w-[500px] mb-6">
        <Search className="absolute left-3 top-[10px] text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search Project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-5 text-sm py-2 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-[0.5px] focus:ring-zinc-200"
        />
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-3 lg:grid-cols-2 items-stretch gap-6 pb-5">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((post) => (
            <label
              key={post.id}
              className="relative flex flex-row p-6 border h-max border-slate-500 shadow-slate-100 hover:shadow-slate-100 border-opacity-5 rounded-md shadow-md hover:shadow-xl transition-all duration-200 bg-white"
              onMouseEnter={() => setHoveredProjectId(post.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
            >
              <div
                className={`absolute cursor-pointer flex flex-row items-center bottom-5 right-5 text-tiny text-gray-600  transition-all duration-250 transform ${
                  hoveredProjectId === post.id
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
              >
                {" "}
                <p className="">View Information</p>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-4 w-11/12 justify-between">
                <div className="flex flex-row  rounded-full items-center gap-3">
                  <h1
                    className="text-2xl font-semibold text-zinc-700 truncate"
                    title={post.title}
                  >
                    {truncateText(post.title, 25)}
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-3 px-2">
                  <div className="h-full flex items-start">
                    <Captions className="w-8 h-8 flex-shrink-0 text-gray-700 bg-gray-100 p-1.5 rounded-full" />
                  </div>
                  <p
                    className="font-normal text-gray-500 text-sm line-clamp-3 break-all overflow-hidden text-ellipsis"
                    title={post.description}
                  >
                    {post.description}
                  </p>
                </div>

                <div className="flex flex-row gap-3 items-start px-2">
                  <div className="flex flex-row bg-green-500 rounded-full items-center p-1">
                    <CalendarClock className="w-7 h-7 text-green-700 bg-green-50 p-1.5 rounded-full" />
                    <p className="font-semibold text-xs py-1.5 px-3 text-white">
                    {formatDate(post.project.projectStartDate)}
                    </p>
                  </div>
                  <div className="flex flex-row bg-red-500 rounded-full items-center p-1">
                    <CalendarClock className="w-7 h-7 text-red-700 bg-red-50 p-1.5 rounded-full" />
                    <p className="font-semibold text-xs py-1.5 px-3 text-white">
                    {formatDate(post.project.projectEndDate)}
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex flex-col w-1/12 items-end relative">
                <div
                  className={`absolute top-0 right-0 transition-all duration-250 transform ${
                    hoveredProjectId === post.id
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                >
                  <Dropdown />
                </div>
              </label>
            </label>
          ))
        ) : (
          <p className="text-gray-500">No Project found.</p>
        )}
      </div>
    </div>
  );
};

export default GetAllFeedback;
