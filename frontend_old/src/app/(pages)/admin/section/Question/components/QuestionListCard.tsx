"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  Edit3,
  Eye,
  HelpCircle,
  MessageCircle,
  Trash2
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  text: string;
  questionType: string;
  category: string;
  createdAt?: string;
  responseCount?: number;
}

const QuestionCard = ({ post }: { post: Post }) => {
  const [hoveredQuestionId, setHoveredQuestionId] = useState<number | null>(null);

  // Limit text length
  const truncateText = (text: string, limit: number) => {
    return text.length <= limit ? text : text.slice(0, limit) + "...";
  };

  // Format date
  const formatDate = (dateString: string = new Date().toISOString()) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } catch {
      return "Invalid Date";
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this question?")) {
      // Add your delete logic here
      console.log("Deleting question:", id);
    }
  };

  return (
    <div
      className="relative flex flex-col md:flex-row p-6 border border-slate-500 border-opacity-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 bg-white overflow-hidden"
      onMouseEnter={() => setHoveredQuestionId(post.id)}
      onMouseLeave={() => setHoveredQuestionId(null)}
    >
      {/* Left side content */}
      <div className="flex flex-col gap-4 flex-grow pr-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            {post.text.charAt(0).toUpperCase()}
          </div>
          <h1
            className="text-xl font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors"
            title={post.text}
          >
            {truncateText(post.text, 40)}
          </h1>
        </div>

        {/* Question metadata */}
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center w-max bg-gray-50 rounded-full px-3 py-1.5">
            <CalendarClock className="w-5 h-5 text-gray-600 mr-2" />
            <p className="text-xs font-medium text-gray-700">
              Created: {formatDate(post.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center w-max bg-green-50 rounded-full px-3 py-1.5">
            <HelpCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-xs font-medium text-green-700">
              Type: {post.questionType}
            </p>
          </div>
          
          <div className="flex items-center w-max bg-purple-50 rounded-full px-3 py-1.5">
            <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
            <p className="text-xs font-medium text-purple-700">
              Category: {post.category}
            </p>
          </div>
          
          <div className="flex items-center w-max bg-blue-50 rounded-full px-3 py-1.5">
            <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-xs font-medium text-blue-700">
              Responses: {post.responseCount || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="mt-4 md:mt-0 flex md:flex-col justify-end items-end gap-2 min-w-[180px] relative">
        <div
          className={`flex md:flex-col gap-2 w-full md:w-auto transition-all duration-300 ${
            hoveredQuestionId === post.id ? "opacity-100" : "opacity-80"
          }`}
        >
          <Link href={`/questions/edit/${post.id}`} onClick={(e) => e.stopPropagation()}>
            <button className="w-full bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-transparent shadow-sm transition-all duration-200 ease-in-out">
              <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </div>
            </button>
          </Link>

          <button
            onClick={(e) => handleDelete(post.id, e)}
            className="w-full bg-white rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-transparent shadow-sm transition-all duration-200 ease-in-out"
          >
            <div className="py-2 px-4 flex items-center justify-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Delete</span>
            </div>
          </button>

          <Link href={`/questions/${post.id}/details`} onClick={(e) => e.stopPropagation()}>
            <button className="w-full bg-white rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent shadow-sm transition-all duration-200 ease-in-out">
              <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Details</span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;