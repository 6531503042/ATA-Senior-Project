"use client";

import { BookOpen, CircleDot, FileText, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import FormPop from "@/app/(pages)/modules/forms/FeedbackManagement";
import MenuOption from "@/app/(pages)/modules/components/MenuOption";
import GetAllFeedbackByAPI from "@/app/(pages)/modules/components/api/GetAllFeedback";

interface Post {
  id: number;
  text: string;
  questionType: string;
  category: string;
}

const FeedbackManagement = () => {
  const [formPop, setFormPop] = useState(false);
  const [feedbackData, setFeedbackData] = useState<Post[]>([]);
  const [questionData, setQuestionData] = useState<Post[]>([]);

  const getQuestions = async () => {
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
        throw new Error(`Failed to fetch questions: ${res.status}`);
      }

      const data = await res.json();
      console.log("Questions API Response:", data);
      setQuestionData(data);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const getFeedbacks = async () => {
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
        throw new Error(`Failed to fetch feedbacks: ${res.status}`);
      }

      const data = await res.json();
      console.log("Feedback API Response:", data);
      setFeedbackData(data);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    }
  };

  useEffect(() => {
    getQuestions();
    getFeedbacks();
  }, []);

  // Dynamically update total counts
  const options = [
    {
      title: "Total Feedback",
      number: feedbackData.length.toString(),
      icon: FileText,
      color: "text-red-500",
      subtitle: "Feedback in System",
      background: "bg-red-50",
    },
    {
      title: "Total Questions",
      number: questionData.length.toString(),
      icon: BookOpen,
      color: "text-blue-500",
      subtitle: "Questions in System",
      background: "bg-blue-50",
    },
  ];

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
            onClick={() => setFormPop(true)}
            className="flex flex-row gap-2 text-white bg-red-600 p-2.5 rounded-xl text-sm font-semibold items-center shadow-lg hover:shadow-xl transition-all"
          >
            <CircleDot className="w-4 h-4" />
            <p>New Feedback</p>
          </button>
        </div>

        {/* Show total feedback and total questions */}
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

        <button
          onClick={() => setFormPop(true)}
          className="flex flex-row gap-2 text-white bg-red-600 p-2.5 rounded-xl text-sm font-semibold items-center shadow-lg hover:shadow-xl transition-all mt-9"
        >
          <PlusCircle className="w-5 h-5" />
          <p>Create Feedback Form</p>
        </button>
        <GetAllFeedbackByAPI />
      </div>

      {formPop && <FormPop setIsOpen={setFormPop} />}
    </div>
  );
};

export default FeedbackManagement;
