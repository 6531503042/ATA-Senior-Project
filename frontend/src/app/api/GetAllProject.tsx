"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "@/app/components/dropdown-ui/dropdown_project_management";

interface Post {
  id: number;
  name: string;
  memberIds: string[] | string | number[];
  description: string;
  projectStartDate: string;
  projectEndDate: string;
}

const GetAllProject = () => {
  const [postData, setPostData] = useState<Post[]>([]);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

  {/* Limit the max text show up */}
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

    {/* Count User by IDs */}
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

    {/* Change format date */}
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


  return <div className="grid grid-cols-3 items-stretch gap-6 pb-5">
  {postData.length > 0 ? (
    postData.map((post) => (
      <label
        key={post.id}
        className="flex flex-row p-6 border border-slate-500 shadow-slate-100 hover:shadow-slate-100 
     border-opacity-5 rounded-md shadow-md hover:shadow-xl transition-all duration-200 bg-white"
        onMouseEnter={() => setHoveredProjectId(post.id)}
        onMouseLeave={() => setHoveredProjectId(null)}
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
            <p
              className="font-medium text-xs py-1 px-2 shadow-md shadow-slate-100 border border-slate-500 
            border-opacity-5 rounded-2xl text-zinc-500"
            >
              {formatDate(post.projectStartDate)}
            </p>
            <p
              className="font-medium text-xs py-1 px-2 shadow-md shadow-slate-100 border border-slate-500 
            border-opacity-5 rounded-2xl text-stone-600"
            >
              {countTotalUsers(post.memberIds)} Members
            </p>
          </div>
        </div>

        <label className="flex flex-col w-1/4 items-end relative">
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
</div>;
};

export default GetAllProject;
