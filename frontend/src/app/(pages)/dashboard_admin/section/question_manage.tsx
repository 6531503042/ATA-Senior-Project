"use client";

import {
  BookOpen,
  CircleDot,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormPop from "@/app/components/forms/create_question_manage";
import MenuOption from "@/app/components/MenuOption";

const question_manage = () => {
  const [formPop, SetFormPop] = useState(false);
  const options = [
    {
      title: "Total Questions",
      number: "0",
      icon: BookOpen,
      color: "text-violet-500",
      subtitle: "Questions in feedback",
      background: "bg-violet-50",
    },
  ];

  return (
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-row w-full h-auto items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-violet-600">
              Question Managemaent
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
        </div><div className="flex flex-row gap-5 items-center my-5">
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
      </div>
      
      {formPop && <FormPop setIsOpen={SetFormPop} />}
    </div>
  );
};

export default question_manage;
