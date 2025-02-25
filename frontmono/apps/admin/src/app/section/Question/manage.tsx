"use client";

import {
  BookOpen,
  CircleDot,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FormPop from "@/app/modules/components/forms/QuestionManagement";
import MenuOption from "@/app/modules/components/MenuOption";
import GetAllQuestionByAPI from '@/app/modules/components/api/ListAllQuestion'

interface Post {
  id: number;
  text: string;
  questionType: string;
  category: string;
}

const QuestionManage = () => {
  const [formPop, SetFormPop] = useState(false);
  const [postData, setPostData] = useState<Post[]>([]);

  const options = [
    {
      title: "Total Questions",
      number: postData.length.toString(),
      icon: BookOpen,
      color: "text-violet-500",
      subtitle: "Questions in feedback",
      background: "bg-violet-50",
    },
  ];

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
        {/* Header Section */}
        <div className="flex flex-row w-full h-auto items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-violet-600">
              Question Management
            </h1>
            <p className="text-base text-gray-500 font-normal">
              Create and manage questions for your feedback forms
            </p>
          </div>
          <button
            onClick={() => SetFormPop(true)}
            className="flex flex-row gap-2 text-white bg-violet-600 p-2.5 rounded-xl text-sm font-semibold items-center shadow-lg hover:shadow-xl transition-all"
          >
            <CircleDot className="w-4 h-4" />
            <p>New Question</p>
          </button>
        </div>

        {/* Stats Section */}
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
        {/* List All Question in DATABASE , Searching area*/}
        <GetAllQuestionByAPI/>
      </div>

      {formPop && <FormPop setIsOpen={SetFormPop} />}
    </div>
  );
};

export default QuestionManage;
