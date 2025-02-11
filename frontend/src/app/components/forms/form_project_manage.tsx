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

interface form_project_manage {
  setIsOpen: (isOpen: boolean) => void;
}

const form_project_manage: React.FC<form_project_manage> = ({ setIsOpen }) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([""]);
  const [selectedPriority, setSelectedPriority] = useState<
    "high" | "medium" | "low" | null
  >(null);
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, ""]);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handlePrioritySelect = (priority: "high" | "medium" | "low") => {
    setSelectedPriority(priority);
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
              <FolderPlus className="h-6 w-6 text-violet-500" />
              <h1 className="text-2xl font-semibold">Create New Project</h1>
            </div>
            <p className="text-zinc-400 text-sm font-normal">
              Launch a new project and set it up for success
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
            <h3 className="text-sm font-medium">Project Priority</h3>
            <div className="grid grid-cols-3 w-full mt-3 gap-5">
              <div
                onClick={() => handlePrioritySelect("high")}
                className={`flex-1 flex flex-col gap-1 p-4 bg-red-50 bg-opacity-50 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedPriority === "high"
                      ? "ring-[1.5px] ring-red-400 shadow-lg shadow-red-100"
                      : "shadow-sm hover:shadow-lg hover:shadow-red-100"
                  }`}
              >
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-base font-medium mt-2">High Priority</p>
                <p className="text-sm font-light text-zinc-400 w-3/4">
                  Urgent and important tasks
                </p>
              </div>
              <div
                onClick={() => handlePrioritySelect("medium")}
                className={`flex-1 flex flex-col gap-1 p-4 bg-amber-50 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedPriority === "medium"
                      ? "ring-[1.5px] ring-amber-400 shadow-lg shadow-amber-100"
                      : "shadow-sm hover:shadow-lg hover:shadow-amber-100"
                  }`}
              >
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-base font-medium mt-2">Medium Priority</p>
                <p className="text-sm font-light text-zinc-400 w-3/4">
                  Important but not urgent
                </p>
              </div>
              <div
                onClick={() => handlePrioritySelect("low")}
                className={`flex-1 flex flex-col gap-1 p-4 bg-green-50 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedPriority === "low"
                      ? "ring-[1.5px] ring-green-400 shadow-lg shadow-green-100"
                      : "shadow-sm hover:shadow-lg hover:shadow-green-100"
                  }`}
              >
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-base font-medium mt-2">Low Priority</p>
                <p className="text-sm font-light text-zinc-400 w-3/4">
                  Can be completed later
                </p>
              </div>
            </div>
          </div>
          {/* Rest of the form remains the same */}
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Project Name</h3>
            <input
              type="text"
              placeholder="e.g., Website Redesign"
              className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm focus:shadow-sm"
              required
            />
          </div>
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Description</h3>
            <textarea
              placeholder="Describe the project goals and objectives"
              className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm focus:shadow-sm"
            />
          </div>
          <div className="w-full flex flex-row gap-5">
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
          <div className="flex flex-col gap-3">
            <div className="w-full flex flex-row items-center">
              <h3 className="text-sm font-medium w-full">Team Members</h3>
              <button
                type="button"
                onClick={handleAddMember}
                className="w-max border border-zinc-200 py-2 px-3 rounded-md flex flex-row items-center gap-2 hover:bg-slate-50 transition-all duration-150 hover:shadow-sm"
              >
                <Plus className="h-4 w-4 text-slate-800" />
                <p className="text-nowrap text-slate-800 font-medium text-sm">
                  Add Member
                </p>
              </button>
            </div>
            {teamMembers.map((_, index) => (
              <div key={index} className="flex flex-row items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex text-center">
                  <GroupsIcon
                    style={{ fontSize: "1.1rem", color: "transparent" }}
                    className="stroke-blue-400 stroke-[1.5px]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Enter team member name"
                  className="w-full border border-zinc-200 outline-none py-2 px-3 rounded-md text-sm font-light focus:shadow-sm placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-md transition-all"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}
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
              className="border border-transparent bg-blue-800 py-2 px-3 text-sm rounded-md flex flex-row items-center gap-2 text-white hover:shadow-lg hover:shadow-blue-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <Rocket className="h-4 w-4" />
              <p>Launch Project</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default form_project_manage;
