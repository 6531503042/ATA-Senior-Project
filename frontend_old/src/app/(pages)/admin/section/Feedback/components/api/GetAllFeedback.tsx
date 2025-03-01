"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarClock,
  Captions,
  Eraser,
  Eye,
  Pencil,
  Search,
} from "lucide-react";
import Link from "next/link";

interface Feedback {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const GetAllFeedback = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [hoveredFeedbackId, setHoveredFeedbackId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Limit text length
  const truncateText = (text: string, limit: number) => {
    return text.length <= limit ? text : text.slice(0, limit) + "...";
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } catch {
      return "Invalid Date";
    }
  };

  const getFeedbacks = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8084/api/v1/admin/feedbacks/get-all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

      const data = await res.json();
      console.log("API Response:", data);
      setFeedbackData(data);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`http://localhost:8084/api/v1/admin/feedbacks/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to delete feedback: ${res.status}`);

        // Remove the feedback from state
        setFeedbackData(feedbackData.filter((feedback) => feedback.id !== id));
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  const filteredFeedbacks = feedbackData.filter((feedback) =>
    feedback.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Feedbacks</h1>
        <div className="relative w-[300px] md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-5 text-sm py-3 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-5">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="relative flex flex-col md:flex-row p-6 border border-slate-500 border-opacity-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 bg-white overflow-hidden"
              onMouseEnter={() => setHoveredFeedbackId(feedback.id)}
              onMouseLeave={() => setHoveredFeedbackId(null)}
            >
              {/* Left side content */}
              <div className="flex flex-col gap-4 flex-grow pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {feedback.title.charAt(0).toUpperCase()}
                  </div>
                  <h1
                    className="text-xl font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors"
                    title={feedback.title}
                  >
                    {truncateText(feedback.title, 25)}
                  </h1>
                </div>

                <div className="flex items-center gap-3 pl-2">
                  <Captions className="w-7 h-7 flex-shrink-0 p-1 text-gray-700 bg-gray-100 rounded-full" />
                  <p
                    className="font-normal text-gray-600 text-sm line-clamp-2 break-all"
                    title={feedback.description}
                  >
                    {feedback.description || "No description available"}
                  </p>
                </div>

                {/* Feedback metadata */}
                <div className="flex items-center w-max bg-gray-50 rounded-full px-3 py-1.5 mt-2">
                  <CalendarClock className="w-5 h-5 text-gray-600 mr-2" />
                  <p className="text-xs font-medium text-gray-700">
                    Created: {formatDate(feedback.createdAt)}
                  </p>
                </div>
              </div>

              {/* Right side actions */}
              <div className="mt-4 md:mt-0 flex md:flex-col justify-end items-end gap-2 min-w-[180px] relative">
                <div
                  className={`flex md:flex-col gap-2 w-full md:w-auto transition-all duration-300 ${
                    hoveredFeedbackId === feedback.id ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Link href={`/feedback/edit/${feedback.id}`} onClick={(e) => e.stopPropagation()}>
                    <button className="w-full bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-transparent shadow-sm transition-all duration-200 ease-in-out">
                      <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </div>
                    </button>
                  </Link>

                  <button
                    onClick={(e) => handleDelete(feedback.id, e)}
                    className="w-full bg-white rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-transparent shadow-sm transition-all duration-200 ease-in-out"
                  >
                    <div className="py-2 px-4 flex items-center justify-center gap-1.5">
                      <Eraser className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </div>
                  </button>

                  <Link href={`/feedback/${feedback.id}/details`} onClick={(e) => e.stopPropagation()}>
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
          ))
        ) : (
          <p className="text-gray-500">No feedback found.</p>
        )}
      </div>
    </div>
  );
};

export default GetAllFeedback;
