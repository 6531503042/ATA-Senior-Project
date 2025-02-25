"use client"

import React, { useState } from "react";
import axios from "axios";
import FormHeader from "@/app/modules/components/forms/QuestionComponent/FormHeader";
import QuestionTypeSelect from "@/app/modules/components/forms/QuestionComponent/QuestionTypeSelector";
import CategorySelect from "@/app/modules/components/forms/QuestionComponent/CategorySelect";
import QuestionFields from "@/app/modules/components/forms/QuestionComponent/QuestionField";
import AnswerOptions from "@/app/modules/components/forms/QuestionComponent/AnswerOptions";
import SentimentOptions from "@/app/modules/components/forms/QuestionComponent/SentimentOptions";
import FormActions from "@/app/modules/components/forms/QuestionComponent/FormActions";
import { X } from "lucide-react";

interface FormProjectManageProps {
  setIsOpen: (isOpen: boolean) => void;
}

interface OptionItem {
  text: string;
}

interface ValidationError {
  message: string;
  type: 'error' | 'warning';
}

const FormProjectManage: React.FC<FormProjectManageProps> = ({ setIsOpen }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("GENERAL");
  const [options, setOptions] = useState<OptionItem[]>([{ text: "" }]);
  const [text, setText] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [required, setRequired] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);

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

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setText("");
    setDescription("");
    setOptions([{ text: "" }]);
  };

  const validateForm = (): boolean => {
    // Check if question type is selected
    if (!selectedType) {
      setValidationError({
        message: "Please select a question type",
        type: 'error'
      });
      return false;
    }

    // Check if question text is filled
    if (!text.trim()) {
      setValidationError({
        message: "Please enter your question",
        type: 'error'
      });
      return false;
    }

    // Validate options for choice-based questions
    if (selectedType === "SINGLE_CHOICE" || selectedType === "MULTIPLE_CHOICE") {
      const validOptions = options.filter(opt => opt.text.trim().length > 0);
      
      if (validOptions.length < 2) {
        setValidationError({
          message: "Please add at least two valid options",
          type: 'error'
        });
        return false;
      }

      // Check if any option is empty
      if (options.some(opt => !opt.text.trim())) {
        setValidationError({
          message: "Please fill in all option fields or remove empty ones",
          type: 'warning'
        });
        return false;
      }
    }

    return true;
  };

  const handleCreateQuestion = async () => {
    // Clear any existing validation messages
    setValidationError(null);

    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("Access token not found");
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
        return;
      }

      let formattedChoices: string[] | undefined = undefined;

      if (selectedType === "SENTIMENT") {
        formattedChoices = ["Positive", "Neutral", "Negative"];
      } else if (
        selectedType === "SINGLE_CHOICE" ||
        selectedType === "MULTIPLE_CHOICE"
      ) {
        formattedChoices = options
          .map((o) => o.text.trim())
          .filter((text) => text.length > 0);
      }

      const requestData = {
        title: text.trim(),
        description: description.trim() || null,
        questionType: selectedType,
        category: selectedCategory,
        required: required,
        choices: formattedChoices,
        validationRules: null,
      };

      const response = await axios.post(
        "http://localhost:8084/api/v1/admin/questions/create",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 401) {
        console.warn("Unauthorized request. Redirecting to login...");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        alert("You do not have permission to perform this action.");
        return;
      }

      if (!response.data || response.status >= 400) {
        throw new Error(response.data?.message || "Failed to create question.");
      }

      console.log("Question created successfully:", response.data);
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;
        let errorMessage = "An error occurred while creating the question.";

        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("access_token");
          window.location.href = "/login";
          return;
        }

        if (errorResponse?.message) {
          errorMessage = errorResponse.message;
        } else if (errorResponse?.error) {
          errorMessage = errorResponse.error;
        }

        alert(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const renderDynamicFields = () => {
    switch (selectedType) {
      case "SENTIMENT":
        return <SentimentOptions />;

      case "SINGLE_CHOICE":
      case "MULTIPLE_CHOICE":
        return (
          <AnswerOptions
            options={options}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onOptionChange={handleOptionChange}
          />
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

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      {validationError && (
        <div className={`fixed top-5 z-50 right-5 ${
          validationError.type === 'error' ? 'bg-red-600' : 'bg-yellow-500'
        } text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-fade-in`}>
          <X className="w-5 h-5" />
          <p className="text-sm font-medium">
            {validationError.message}
          </p>
        </div>
      )}
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-[600px] max-h-full overflow-y-auto">
        <FormHeader setIsOpen={setIsOpen} />

        <form className="flex flex-col gap-6 mt-5">
          <QuestionTypeSelect
            selectedType={selectedType}
            onChange={handleTypeChange}
          />

          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />

          <QuestionFields
            text={text}
            description={description}
            onTextChange={setText}
            onDescriptionChange={setDescription}
          />

          <div className="w-full">{renderDynamicFields()}</div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="accent-violet-600"
            />
            <label className="text-sm">Required question</label>
          </div>

          <FormActions
            onCancel={() => setIsOpen(false)}
            onSubmit={handleCreateQuestion}
          />
        </form>
      </div>
    </div>
  );
};

export default FormProjectManage;