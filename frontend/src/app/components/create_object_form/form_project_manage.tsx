"use client";

import {
  X,
  FolderPlus,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import React from "react";

interface form_project_manage {
  setIsOpen: (isOpen: boolean) => void;
}

const form_project_manage: React.FC<form_project_manage> = ({ setIsOpen }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-15 ">
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-max max-h-full overflow-y-auto">
        {/* Close Button and Title*/}
        <div className="flex flex-row">
          <div className="w-full flex flex-col gap-1 mt-2">
            <div className="flex flex-row gap-2 items-center">
              <FolderPlus className="h-6 w-6 text-violet-500" />
              <h1 className="text-2xl font-semibold">Create New Project</h1>
            </div>
            <p className="text-zinc-400 text-sm font-light">
              Launch a new project and set it up for success
            </p>
          </div>
          <button
            className="flex-1 flex justify-end"
            onClick={() => setIsOpen(false)}
          >
            <X className=" text-slate-600 h-4 w-4 hover:text-slate-900 " />
          </button>
        </div>
        {/* Form */}
        <form className="flex flex-col gap-6 mt-5">
          <div className="flex w-full flex-col">
            <h3 className="text-sm font-medium">Project Priority</h3>
            <div className="grid grid-cols-3 w-full mt-3 gap-5">
              <div className="flex-1 flex flex-col gap-1 p-4 bg-red-50 bg-opacity-50 shadow-red-100 hover:shadow-red-100 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-base font-medium mt-2">High Priority</p>
                <p className="text-sm font-light text-zinc-400 w-3/4">
                  Urgent and important tasks
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-1 p-4 bg-amber-50 shadow-amber-100 hover:shadow-amber-100 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="p-2 bg-white bg-opacity-60 w-max h-max rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-base font-medium mt-2">Medium Priority</p>
                <p className="text-sm font-light text-zinc-400 w-3/4">
                  Important but not urgent
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-1 p-4 bg-green-50 shadow-green-100 hover:shadow-green-100 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200">
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
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Project Name</h3>
            <input
              type="text"
              placeholder="e.g., Website Redesign"
              className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm  focus:shadow-sm"
            />
          </div>
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Description</h3>
            <input
              type="text"
              placeholder="Describe the project goals and objectives"
              className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm  focus:shadow-sm"
            />
          </div>
          <div className="w-full flex flex-row gap-5">
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-medium">Start Date</h3>
              <input
                type="text"
                placeholder="Pick a Date"
                className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm  focus:shadow-sm"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-medium">Due Date</h3>
              <input
                type="text"
                placeholder="Pick a Date"
                className="w-full border border-zinc-200 outline-none p-3 rounded-xl mt-2 text-sm  focus:shadow-sm"
              />
            </div>
          </div>
          <div className="w-full flex flex-row items-center">
            <h3 className="text-sm font-medium w-full">Team Members</h3>
            <button className="w-max border border-zinc-200 py-2 px-3 rounded-md flex flex-row items-center gap-2 hover:bg-slate-50 transition-all duration-150" >
              <Plus className="h-4 w-4 text-slate-800"/>
              <p className="text-nowrap text-slate-800 font-medium text-sm ">Add Member</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default form_project_manage;
