"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { Project } from "@/app/admin/projects/models/types";

interface CustomProjectSelectProps {
  projects: Project[];
  selectedProjectId: number;
  onChange: (projectId: number) => void;
  isDisabled?: boolean;
  hasError?: boolean;
}

export function CustomProjectSelect({
  projects,
  selectedProjectId,
  onChange,
  isDisabled = false,
  hasError = false,
}: CustomProjectSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md",
          "border transition-all duration-200",
          isDisabled 
            ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
            : "bg-white hover:bg-gray-50 cursor-pointer",
          hasError 
            ? "border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500" 
            : "border-gray-300 focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
        )}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <div className="h-5 w-5 mr-2 flex items-center justify-center rounded bg-violet-100">
            <span className="text-xs font-medium text-violet-700">P</span>
          </div>
          <span className={!selectedProject ? "text-gray-500" : ""}>
            {selectedProject ? selectedProject.name : "Select a project"}
          </span>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
          role="listbox"
        >
          {projects.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">No projects available</div>
          ) : (
            <>
              <div className="px-3 py-2 text-gray-500 border-b border-b-black/30 text-xs uppercase font-normal">Select Project</div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    "px-3 py-2 flex items-center cursor-pointer",
                    project.id === selectedProjectId 
                      ? "bg-violet-50 text-violet-900" 
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => {
                    onChange(project.id);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={project.id === selectedProjectId}
                >
                  <div className="flex-grow flex items-center">
                    <div className="h-5 w-5 mr-2 flex items-center justify-center rounded bg-violet-100">
                      <span className="text-xs font-medium text-violet-700">P</span>
                    </div>
                    {project.name}
                  </div>
                  {project.id === selectedProjectId && (
                    <CheckIcon className="h-4 w-4 text-violet-600" />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}