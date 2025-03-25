"use client";

import React from "react";
import { DatePicker } from "@/components/shared/date-picker";
import { Project } from "../../projects/models/types";
import { Question } from "../../questions/models/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormBodyProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
  selectedProject: number;
  setSelectedProject: (id: number) => void;
  selectedQuestions: number[];
  setSelectedQuestions: (ids: number[]) => void;
  projects: Project[];
  questions: Question[];
  errors: Record<string, string>;
}

const FormBody: React.FC<FormBodyProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
  selectedProject,
  setSelectedProject,
  selectedQuestions,
  setSelectedQuestions,
  projects,
  questions,
  errors,
}) => {
  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestions(
      selectedQuestions.includes(questionId)
        ? selectedQuestions.filter((id) => id !== questionId)
        : [...selectedQuestions, questionId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Form Title
            </label>
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title}</span>
            )}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Product Satisfaction Survey"
            className={cn(
              "w-full mt-1 px-3 py-2 bg-white border rounded-md text-sm",
              "focus:outline-none focus:ring-2 focus:ring-violet-500",
              errors.title ? "border-red-500" : "border-gray-300"
            )}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description}</span>
            )}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the feedback form's purpose and goals"
            className={cn(
              "w-full mt-1 px-3 py-2 bg-white border rounded-md text-sm",
              "focus:outline-none focus:ring-2 focus:ring-violet-500",
              errors.description ? "border-red-500" : "border-gray-300"
            )}
            rows={4}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Project</label>
            {errors.project && (
              <span className="text-xs text-red-500">{errors.project}</span>
            )}
          </div>
          <Select
            value={selectedProject ? String(selectedProject) : ""}
            onValueChange={(value) => setSelectedProject(Number(value))}
          >
            <SelectTrigger
              className={cn(
                "w-full mt-1 px-3 py-2 bg-white border rounded-md text-sm",
                "focus:outline-none focus:ring-2 focus:ring-violet-500",
                errors.project ? "border-red-500" : "border-gray-300"
              )}
            >
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Select a project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={String(project.id)}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label="Start Date"
          error={startDate ? undefined : errors.startDate}
        />
        <DatePicker
          date={dueDate}
          setDate={setDueDate}
          label="Due Date"
          minDate={startDate}
          error={dueDate ? undefined : errors.dueDate}
        />
      </div>

      {/* Questions Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Questions</label>
          {errors.questions && (
            <span className="text-xs text-red-500">{errors.questions}</span>
          )}
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {questions.map((question) => (
            <div
              key={question.id}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border transition-colors cursor-pointer",
                selectedQuestions.includes(question.id)
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-200 hover:border-violet-200"
              )}
              onClick={() => handleQuestionToggle(question.id)}
            >
              <Checkbox
                checked={selectedQuestions.includes(question.id)}
                onCheckedChange={() => handleQuestionToggle(question.id)}
                className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {question.text}
                  </p>
                  <p className="text-xs text-gray-500">
                    {question.description}
                  </p>
                </div>

                {/* Answer Options */}
                {question.choices && question.choices.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-600">
                      Answer Options:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {question.choices.map((choice, index) => (
                        <div
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-50 rounded border border-gray-100 text-gray-600"
                        >
                          {choice}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {question.questionType === "SENTIMENT" && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-600">
                      Sentiment Options:
                    </p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">
                        Negative
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">
                        Neutral
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                        Positive
                      </span>
                    </div>
                  </div>
                )}

                {question.questionType === "TEXT_BASED" && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 italic">
                      Free text response
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {question.questionType.replace("_", " ")}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-600">
                  {question.category.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormBody;
