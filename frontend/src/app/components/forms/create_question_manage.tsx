"use client";

import {
  X,
  FolderPlus,
  Rocket,
  CalendarIcon,
  CheckSquare,
  ListChecks,
  MessageSquare,
  Star,
  MessageCircleQuestion,
} from "lucide-react";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import SelectWithIcon from "@/app/components/SelectWithIcon";

interface form_project_manage {
  setIsOpen: (isOpen: boolean) => void;
}

const form_project_manage: React.FC<form_project_manage> = ({ setIsOpen }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [selectedType, setSelectedType] = useState("");

  const options = [
    { value: "rating", label: "Rating", icon: Star },
    { value: "text", label: "Text", icon: MessageSquare },
    { value: "multichoice", label: "Multi Choice", icon: ListChecks },
    { value: "singlechoice", label: "Single Choice", icon: CheckSquare },
  ];

  const DatePickerWithPresets = ({
    date,
    setDate,
    label,
  }: {
    date?: Date;
    setDate: (date: Date | undefined) => void;
    label: string;
  }) => {
    return (
      <div className="flex flex-col w-1/2">
        <h3 className="text-sm font-medium">{label}</h3>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm focus:shadow-sm text-left flex items-center",
                !date && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                if (label === "Due Date" && startDate) {
                  return date < startDate;
                }
                return date < new Date();
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-[600px] max-h-full overflow-y-auto">
        {/* Close Button and Title*/}
        <div className="flex flex-row">
          <div className="w-full flex flex-col gap-1 mt-2">
            <div className="flex flex-row gap-2 items-center">
              <MessageCircleQuestion className="h-6 w-6 text-violet-500" />
              <h1 className="text-2xl font-semibold">Create New Question</h1>
            </div>
            <p className="text-zinc-400 text-sm font-normal">
              Add a new question for feedback collection
            </p>
          </div>
          <button
            className="flex-1 flex justify-end"
            onClick={() => setIsOpen(false)}
          >
            <X className="text-slate-600 h-4 w-4 hover:text-slate-900" />
          </button>
        </div>
        {/* Form */}
        <form className="flex flex-col gap-6 mt-5">
          <div className="flex w-full flex-col">
            <h3 className="text-sm font-medium mb-2">Question Type</h3>
            <div className="">
              <SelectWithIcon
                options={options}
                value={selectedType}
                onChange={setSelectedType}
              />
            </div>
          </div>
          {/* Rest of the form remains the same */}
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Question Text</h3>
            <input
              type="text"
              placeholder="Enter your question"
              className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
              required
            />
          </div>
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Description</h3>
            <textarea
              placeholder="Add additional context"
              className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
            />
          </div>
          <div className="w-full flex flex-row gap-5">
            Change Follow the selectItem
          </div>
          <div className="flex flex-col gap-3"></div>
          <div className="w-full flex flex-row justify-end gap-3">
            <button
              type="button"
              className="border border-zinc-300 py-2 px-3 text-sm rounded-md hover:shadow-lg hover:shadow-zinc-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="border border-transparent bg-violet-600 py-2 px-3 text-sm rounded-md flex flex-row items-center gap-2 text-white hover:shadow-lg hover:shadow-violet-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <Rocket className="h-4 w-4" />
              <p>Create Question</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default form_project_manage;
