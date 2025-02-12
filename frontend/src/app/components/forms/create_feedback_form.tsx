"use client";

import {
  X,
  FolderPlus,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Plus,
  Rocket,
  Trash2,
  CalendarIcon,
  CheckSquare,
  ListChecks,
  MessageSquare,
  Star,
  PlusCircle,
  Box,
  Wrench,
  SmilePlus,
  Headphones,
  BarChart,
  MoreHorizontal,
} from "lucide-react";
import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
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

  const [selectedType, setSelectedType] = useState("");

  const options = [
    { value: "Product", label: "Product", icon: Box },
    { value: "Service", label: "Service", icon: Wrench },
    { value: "User Experience", label: "User Experience", icon: SmilePlus },
    { value: "Customer Support", label: "Customer Support", icon: Headphones },
    { value: "Performance", label: "Performance", icon: BarChart },
    { value: "Other", label: "Other", icon: MoreHorizontal },
  ];

  const [FeedbackType, setFeedbackType] = useState<
    "satisfaction survey" | "feature feedback" | "general feedback" | null
  >(null);
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();

  const handleFeedbackType = (priority: "satisfaction survey" | "feature feedback" | "general feedback") => {
    setFeedbackType(priority);
  };

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
                "w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm text-left flex items-center",
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
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-[800px] max-h-full overflow-y-auto">
        {/* Close Button and Title*/}
        <div className="flex flex-row">
          <div className="w-full flex flex-col gap-1 mt-2">
            <div className="flex flex-row gap-2 items-center">
              <MessageSquare className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-semibold">Create Feedback Form</h1>
            </div>
            <p className="text-zinc-400 text-sm font-normal">
              Design a feedback form to gather valuable user insights
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
          {/* Choose Feedback Type */}
          <div className="flex w-full flex-col">
            <h3 className="text-lg font-semibold text-zinc-700">
              Choose Feedback Type
            </h3>
            <div className="grid grid-cols-3 w-full mt-3 gap-5">
              <div
                onClick={() => handleFeedbackType("satisfaction survey")}
                className={`flex-1 flex flex-col gap-1 p-4 bg-red-50 bg-opacity-50 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    FeedbackType === "satisfaction survey"
                      ? "ring-[1.5px] ring-red-400 shadow-lg shadow-red-100"
                      : "shadow-sm hover:shadow-lg hover:shadow-red-100"
                  }`}
              >
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-base font-medium mt-2">Satisfaction survey</p>
                <p className="text-sm font-light text-zinc-400 w-full">
                  Measure user satisfaction and happiness
                </p>
              </div>
              <div
                onClick={() => handleFeedbackType("feature feedback")}
                className={`flex-1 flex flex-col gap-1 p-4 bg-amber-50 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    FeedbackType === "feature feedback"
                      ? "ring-[1.5px] ring-amber-400 shadow-lg shadow-amber-100"
                      : "shadow-sm hover:shadow-lg hover:shadow-amber-100"
                  }`}
              >
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-base font-medium mt-2">Feature feedback</p>
                <p className="text-sm font-light text-zinc-400 w-full">
                  Gather feedback on specific features
                </p>
              </div>
              <div
                onClick={() => handleFeedbackType("general feedback")}
                className={`flex-1 flex flex-col gap-1 p-4 bg-green-50 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    FeedbackType === "general feedback"
                      ? "ring-[1.5px] ring-green-400 shadow-lg shadow-green-100"
                      : "shadow-sm hover:shadow-lg hover:shadow-green-100"
                  }`}
              >
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-base font-medium mt-2">General feedback</p>
                <p className="text-sm font-light text-zinc-400 w-full">
                  Collect open-ended user feedback
                </p>
              </div>
            </div>
          </div>
          {/* Rest of the Choose feedback type*/}
          <div className="w-full flex flex-row gap-5">
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-zinc-700">Form Title</h3>
              <input
                type="text"
                placeholder="e.g., Product Satisfaction Survey"
                className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm focus:shadow-sm"
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-medium mb-2 text-zinc-700">Select Category</h3>
            <div className="">
              <SelectWithIcon
                options={options}
                value={selectedType}
                onChange={setSelectedType}
                title="Select Category"
              />
            </div>
          </div>
          </div>
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium text-zinc-700">Description</h3>
            <textarea
              placeholder="Describe the project goals and objectives"
              className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
            />
          </div>
          <div className="w-full flex flex-row gap-5 text-zinc-700">
            <DatePickerWithPresets
              date={startDate}
              setDate={setStartDate}
              label="Start Date"
            />
            <DatePickerWithPresets
              date={dueDate}
              setDate={setDueDate}
              label="Due Date"
            />
          </div>
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
              className="border border-transparent bg-red-800 py-2 px-3 text-sm rounded-md flex flex-row items-center gap-2 text-white hover:shadow-lg hover:shadow-red-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <Rocket className="h-4 w-4" />
              <p>Create Form</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default form_project_manage;
