"use client";

import {
  X,
  Rocket,
  CheckSquare,
  ListChecks,
  MessageSquare,
  Star,
  MessageCircleQuestion,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import SelectWithIcon from "@/app/components/SelectWithIcon";

interface form_project_manage {
  setIsOpen: (isOpen: boolean) => void;
}

interface OptionItem {
  text: string;
}

const form_project_manage: React.FC<form_project_manage> = ({ setIsOpen }) => {
  const [selectedType, setSelectedType] = useState("");
  const [options, setOptions] = useState<OptionItem[]>([{ text: "" }]);
  const [ratingMax, setRatingMax] = useState(5);

  const questionTypeOptions = [
    { value: "rating", label: "Rating", icon: Star },
    { value: "text", label: "Text", icon: MessageSquare },
    { value: "multichoice", label: "Multi Choice", icon: ListChecks },
    { value: "singlechoice", label: "Single Choice", icon: CheckSquare },
  ];

  const handleAddOption = () => {
    setOptions([...options, { text: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  // Renders different form fields based on selected question type
  const renderDynamicFields = () => {
    switch (selectedType) {
      case "rating":
        return (
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium mb-2">Rating Scale</h3>
            <div className="flex flex-row items-center gap-3">
              <select
                value={ratingMax}
                onChange={(e) => setRatingMax(parseInt(e.target.value))}
                className="border border-zinc-200 outline-none p-3 rounded-md text-sm focus:shadow-sm"
              >
                <option value={3}>1-3</option>
                <option value={5}>1-5</option>
                <option value={10}>1-10</option>
              </select>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Max: {ratingMax}</span>
              </div>
            </div>
          </div>
        );

      case "singlechoice":
      case "multichoice":
        return (
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-sm font-medium mb-2">Answer Options</h3>
            <p className="text-sm text-zinc-500">
              Add possible answers for selection:
            </p>
            {options.map((option, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border border-zinc-200 outline-none p-3 rounded-md text-sm focus:shadow-sm"
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-2 text-violet-600 p-2 border border-dashed border-violet-300 rounded-md hover:bg-violet-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add Option</span>
            </button>
            {selectedType === "multichoice" && (
              <p className="text-sm text-zinc-500 italic mt-2">
                Users will be able to select multiple options from this list.
              </p>
            )}
            {selectedType === "singlechoice" && (
              <p className="text-sm text-zinc-500 italic mt-2">
                Users will select only one option from this list.
              </p>
            )}
          </div>
        );

      case "text":
        return (
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium mb-2">Text Response Settings</h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-zinc-500">
                Users will provide a text response to this question.
              </p>
              <div className="mt-2 border border-zinc-200 p-3 rounded-md bg-zinc-50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium">Response Format</span>
                  </div>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="textFormat"
                        defaultChecked
                        className="accent-violet-600"
                      />
                      <span>Single line</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="textFormat"
                        className="accent-violet-600"
                      />
                      <span>Multi-line</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
                options={questionTypeOptions}
                value={selectedType}
                onChange={(value) => {
                  setSelectedType(value);
                  // Reset form state when changing question type
                  if (value === "singlechoice" || value === "multichoice") {
                    setOptions([{ text: "" }]);
                  }
                }}
              />
            </div>
          </div>
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

          {/* Dynamic fields based on selected question type */}
          <div className="w-full">{renderDynamicFields()}</div>

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
