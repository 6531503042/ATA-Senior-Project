"use client";

import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Brain,
  CircleDot,
  PlusCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FormPop from "@/app/components/forms/create_feedback_form";

interface Post {
  id: number;
  text: string;
  questionType: string;
  category: string;
}

const feedback_manage = () => {
  const [formPop, SetFormPop] = useState(false);
  const [postData, setPostData] = useState<Post[]>([]);

  const getPosts = async () => {
      try {
        const token = localStorage.getItem("access_token");
  
        const res = await fetch(
          "http://localhost:8084/api/v1/admin/questions/get-all",
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
      <div className="w-full h-full">
        <div className="flex flex-row w-full h-auto items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-red-600">
              Feedback Management
            </h1>
            <p className="text-base text-gray-500 font-normal">
              Monitor feedback trends and sentiment analysis
            </p>
          </div>
          <button
            onClick={() => SetFormPop(true)}
            className="flex flex-row gap-2 text-white bg-red-600 p-2.5 rounded-xl text-sm font-semibold items-center shadow-lg hover:shadow-xl transition-all"
          >
            <CircleDot className="w-4 h-4" />
            <p>New Feedback</p>
          </button>
        </div>
        <button
            onClick={() => SetFormPop(true)}
            className="flex flex-row gap-2 text-white bg-red-600 p-2.5 rounded-xl text-sm font-semibold items-center shadow-lg hover:shadow-xl transition-all mt-9"
          >
            <PlusCircle className="w-5 h-5" />
            <p>Create Feedback Form</p>
          </button>
      </div>
      {formPop && <FormPop setIsOpen={SetFormPop} />}
    </div>
  );
};

export default feedback_manage;
