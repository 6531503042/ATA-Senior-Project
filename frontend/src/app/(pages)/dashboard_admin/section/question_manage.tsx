"use client";

import {
  BookOpen,
  Bot,
  CircleDot,
  Ellipsis,
  MessageCircle,
  Pencil,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FormPop from "@/app/components/forms/create_question_manage";
import MenuOption from "@/app/components/MenuOption";
import { button } from "@heroui/theme";

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

        {/* Search Bar */}
        <div className="flex flex-row gap-5 items-center my-5">
          <div className="relative w-[500px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-10 pr-5 text-sm py-2 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-[0.5px] focus:ring-zinc-200"
            />
          </div>
          <button className="hover:shadow-lg transition-all shadow-sm p-2 border border-black rounded-lg border-opacity-10">
            <SlidersHorizontal className="text-black text-opacity-80 w-4 h-4" />
          </button>
        </div>

        {/* Question List */}
        <div className="w-full h-auto">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
            {postData.length > 0 ? (
              postData.map((post) => (
                <label
                  key={post.id}
                  className="flex flex-row border border-slate-500 shadow-slate-100 hover:shadow-slate-100  border-opacity-5 rounded-md shadow-md hover:shadow-xl transition-all duration-200 px-10 py-7 bg-white"
                >
                  <div className="flex flex-col gap-3 flex-1">
                    <h1 className="text-3xl font-semibold text-zinc-700">
                      {post.text}
                    </h1>
                    <span className="flex flex-row gap-3 ms-2 items-center">
                      <p className="font-normal text-gray-500 text-sm flex flex-row items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-900" />
                        0 response
                      </p>
                    </span>
                    <div className="flex flex-row gap-3 items-center">
                      <p className="font-medium text-xs py-1 px-2 shadow-md shadow-slate-100 border border-slate-500 border-opacity-5 rounded-2xl text-zinc-500">
                        Answer Type : {post.questionType}
                      </p>
                      <p className="font-medium text-xs py-1 px-2 shadow-md shadow-slate-100  border border-slate-500 border-opacity-5 rounded-2xl text-stone-600">
                        {post.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 items-end justify-between">
                    <div className="">
                      <button className="p-2 rounded-full hover:text-zinc-500 text-transparent transition-all duration-200">
                        <Ellipsis className=" w-4 h-4" />
                      </button>
                    </div>
                    <div className="">
                      <p className="px-3 py-1 bg-green-100 text-green-600 rounded-2xl text-sm">
                        Active
                      </p>
                    </div>
                    <div className="text-transparent block"><Pencil/></div>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-gray-500">No questions found.</p>
            )}
          </div>
        </div>
      </div>

      {formPop && <FormPop setIsOpen={SetFormPop} />}
    </div>
  );
};

export default QuestionManage;
