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
import axios from "axios";

interface FormProjectManageProps {
  setIsOpen: (isOpen: boolean) => void;
}

interface OptionItem {
  text: string;
}

const FormProjectManage: React.FC<FormProjectManageProps> = ({ setIsOpen }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("GENERAL"); // Add this
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [text, setText] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [required, setRequired] = useState<boolean>(true);

  const questionTypeOptions = [
    { value: "SINGLE_CHOICE", label: "Single Choice", icon: CheckSquare },
    { value: "MULTI_CHOICE", label: "Multi Choice", icon: ListChecks },
    { value: "SENTIMENT", label: "Sentiment", icon: Star },
    { value: "TEXT", label: "Text", icon: MessageSquare },
  ];

  const categoryOptions = [
    { value: "GENERAL", label: "General", icon: MessageCircleQuestion },
    { value: "WORK_ENVIRONMENT", label: "Work Environment", icon: Rocket },
    { value: "SATISFACTION", label: "Satisfaction", icon: Star },
    { value: "COMMUNICATION", label: "Communication", icon: MessageSquare },
    { value: "PERFORMANCE", label: "Performance", icon: CheckSquare },
    { value: "PROJECT_MANAGEMENT", label: "Project Management", icon: Rocket },
  ];

  // Rest of the helper functions remain the same
  const handleAddOption = () => {
    if (options.length >= 1) {
      setOptions([...options, { text: "" }]);
    } else {
      setOptions([...options, { text: "" }, { text: "" }]);
    }
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

  const handleCreateQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("Access token not found");
        return;
      }
  
      // Prepare choices based on selected question type
      let formattedChoices: string[] | undefined = undefined;
  
      if (selectedType === "SENTIMENT") {
        formattedChoices = ["Positive", "Neutral", "Negative"];
      } else if (selectedType === "SINGLE_CHOICE" || selectedType === "MULTI_CHOICE") {
        // Ensure choices are not empty for MULTI_CHOICE and SINGLE_CHOICE
        formattedChoices = options
          .map((o) => o.text.trim())
          .filter((text) => text.length > 0);  // Filter out empty options
  
        if (formattedChoices.length < 2) {
          alert("Please add at least two valid option.");
          return;  // Prevent sending the request
        }
      }
  
      // Construct request data to exactly match the Postman format
      const requestData = {
        title: text.trim(),
        description: description.trim() || null,
        questionType: selectedType,
        category: selectedCategory,
        required: required,
        choices: formattedChoices, // Only set choices if there's a valid array
        validationRules: null,
      };
  
      // Log request data for debugging
      console.log("Sending request data:", JSON.stringify(requestData, null, 2));
  
      // Send POST request to create question
      const response = await axios.post(
        "http://localhost:8084/api/v1/admin/questions/create",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status < 500, // Handle 4xx errors
        }
      );
  
      // Handle successful response
      if (response.data) {
        console.log("Question created successfully:", response.data);
        setIsOpen(false); // Close the form
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;
        console.error("Full error response:", errorResponse);
  
        // More detailed error handling
        let errorMessage = "An error occurred while creating the question.";
        if (errorResponse?.message) {
          errorMessage = errorResponse.message;
        } else if (errorResponse?.error) {
          errorMessage = errorResponse.error;
        }
  
        alert(errorMessage); // Show error message to the user
      } else {
        console.error("General error:", error);
        alert("An unexpected error occurred");
      }
    }
  };
  

  // The renderDynamicFields function needs to be updated for the question types
  const renderDynamicFields = () => {
    switch (selectedType) {
      case "SENTIMENT":
        return (
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium mb-2">Sentiment Options</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-md">
                <div className="text-red-500">Negative</div>
              </div>
              <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-md">
                <div className="text-gray-500">Neutral</div>
              </div>
              <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-md">
                <div className="text-green-500">Positive</div>
              </div>
            </div>
          </div>
        );

      case "SINGLE_CHOICE":
      case "MULTI_CHOICE":
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
          </div>
        );

      case "TEXT":
        return (
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium mb-2">Text Response Settings</h3>
            <p className="text-sm text-zinc-500">
              Users will provide a text response to this question.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // Rest of the JSX remains the same
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-[600px] max-h-full overflow-y-auto">
        {/* Form header remains the same */}
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
          {/* Question Type */}
          <div className="flex w-full flex-col">
            <h3 className="text-sm font-medium mb-2">Question Type</h3>
            <div className="">
              <SelectWithIcon
                options={questionTypeOptions}
                value={selectedType}
                onChange={(value) => {
                  setSelectedType(value);
                  setText("");
                  setDescription("");
                  setOptions([]);
                }}
              />
            </div>
          </div>

          {/* Category Selection - New Addition */}
          <div className="flex w-full flex-col">
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <div className="">
              <SelectWithIcon
                options={categoryOptions}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Question Text</h3>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your question"
              className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="w-full flex flex-col">
            <h3 className="text-sm font-medium">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional context"
              className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
            />
          </div>

          {/* Dynamic fields */}
          <div className="w-full">{renderDynamicFields()}</div>

          {/* Required checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="accent-violet-600"
            />
            <label className="text-sm">Required question</label>
          </div>

          {/* Form actions */}
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
              onClick={handleCreateQuestion}
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

export default FormProjectManage;
