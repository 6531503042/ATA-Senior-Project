"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/shared/DropdownCardProjectManage";
import {
  CalendarClock,
  Captions,
  ChevronRight,
  Eraser,
  Eye,
  Pencil,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Limit the max text show up
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  // Count User by IDs
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

  // Change format date
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

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `http://localhost:8084/api/v1/admin/projects/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to delete project: ${res.status}`);
        }

        // Remove the project from state
        setPostData(postData.filter((project) => project.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const filteredProjects = postData.filter((post) =>
    post.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <div className="relative w-[300px] md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-5 text-sm py-3 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-5">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((post) => (
            <Link
              href={`/project/${post.id}`}
              key={post.id}
              className="block group"
            >
              <div
                className="relative flex flex-col md:flex-row p-6 border border-slate-500 border-opacity-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 bg-white overflow-hidden"
                onMouseEnter={() => setHoveredProjectId(post.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {/* Left side content */}
                <div className="flex flex-col gap-4 flex-grow pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {post.name.charAt(0).toUpperCase()}
                    </div>
                    <h1
                      className="text-xl font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors"
                      title={post.name}
                    >
                      {truncateText(post.name, 25)}
                    </h1>
                  </div>

                  <div className="flex items-center gap-3 pl-2">
                    <div className="">
                      <Captions className="w-7 h-7 flex-shrink-0 p-1 text-gray-700 bg-gray-100 rounded-full" />
                    </div>
                    <p
                      className="font-normal text-gray-600 text-sm line-clamp-2 break-all"
                      title={post.description}
                    >
                      {post.description || "No description available"}
                    </p>
                  </div>

                  {/* Project metadata */}
                  <div className="flex flex-wrap gap-3 mt-1 pl-2">
                    <div className="flex items-center bg-red-50 rounded-full px-3 py-1.5">
                      <CalendarClock className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-xs font-medium text-red-700">
                        Start: {formatDate(post.projectStartDate)}
                      </p>
                    </div>
                    {post.projectEndDate && (
                      <div className="flex items-center bg-green-50 rounded-full px-3 py-1.5">
                        <CalendarClock className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-xs font-medium text-green-700">
                          End: {formatDate(post.projectEndDate)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center bg-blue-50 rounded-full px-3 py-1.5">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-xs font-medium text-blue-700">
                        {countTotalUsers(post.memberIds)} Members
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="mt-4 md:mt-0 flex md:flex-col justify-end items-end gap-2 min-w-[180px] relative">
                  <div
                    className={`flex md:flex-col gap-2 w-full md:w-auto transition-all duration-300 ${
                      hoveredProjectId === post.id
                        ? "opacity-100"
                        : "opacity-80"
                    }`}
                  >
                    <Link
                      href={`/project/edit/${post.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="w-full bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-gray-400 shadow-sm transition-all duration-200 ease-in-out">
                        <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                          <Pencil className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </div>
                      </button>
                    </Link>

                    <button
                      onClick={(e) => handleDelete(post.id, e)}
                      className="w-full bg-white rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-400 shadow-sm transition-all duration-200 ease-in-out"
                    >
                      <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                        <Eraser className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </div>
                    </button>

                    <Link
                      href={`/project/${post.id}/details`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="w-full bg-white rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-400 shadow-sm transition-all duration-200 ease-in-out">
                        <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">Details</span>
                        </div>
                      </button>
                    </Link>
                  </div>

                  <div className="absolute -top-5 -right-5 bg-gray-50 w-28 h-28 rounded-full transform rotate-45 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl text-center shadow">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mt-4 text-lg">
              No projects found matching your search.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllProject;
