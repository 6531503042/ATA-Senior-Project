"use client";

import React, { useEffect, useState } from "react";
import {
  QuestionType,
  QuestionCategory,
  CreateQuestionDto,
  Question,
} from "../models/types";
import {
  MessageCircleQuestion,
  Code,
  Users,
  ClipboardList,
  MessageSquare,
  CheckSquare,
  ListChecks,
  Star,
  Plus,
  Trash2,
  Rocket,
  X,
  Briefcase,
  Heart,
  ThumbsUp,
  Target,
  Lightbulb,
  GraduationCap,
  MessagesSquare,
  AlertCircle,
  Loader2,
  PlusCircle,
  Pencil,
  FileText,
  FolderKanban,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFormProps {
  onSubmit: (data: CreateQuestionDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Question;
  mode: "create" | "edit";
}

interface OptionItem {
  text: string;
}

const categoryOptions = [
  {
    value: QuestionCategory.GENERAL,
    label: "General",
    icon: MessageCircleQuestion,
    description: "General feedback and questions",
  },
  {
    value: QuestionCategory.WORK_ENVIRONMENT,
    label: "Work Environment",
    icon: Briefcase,
    description: "Workspace and office environment feedback",
  },
  {
    value: QuestionCategory.WORK_LIFE_BALANCE,
    label: "Work Life Balance",
    icon: Heart,
    description: "Balance between work and personal life",
  },
  {
    value: QuestionCategory.TEAM_COLLABORATION,
    label: "Team Collaboration",
    icon: Users,
    description: "Team dynamics and collaboration feedback",
  },
  {
    value: QuestionCategory.PROJECT_MANAGEMENT,
    label: "Project Management",
    icon: ClipboardList,
    description: "Project planning and execution feedback",
  },
  {
    value: QuestionCategory.PROJECT_SATISFACTION,
    label: "Project Satisfaction",
    icon: ThumbsUp,
    description: "Overall project satisfaction feedback",
  },
  {
    value: QuestionCategory.TECHNICAL_SKILLS,
    label: "Technical Skills",
    icon: Code,
    description: "Technical abilities and knowledge assessment",
  },
  {
    value: QuestionCategory.COMMUNICATION,
    label: "Communication",
    icon: MessagesSquare,
    description: "Communication effectiveness feedback",
  },
  {
    value: QuestionCategory.LEADERSHIP,
    label: "Leadership",
    icon: Target,
    description: "Leadership and guidance assessment",
  },
  {
    value: QuestionCategory.INNOVATION,
    label: "Innovation",
    icon: Lightbulb,
    description: "Innovation and creative thinking feedback",
  },
  {
    value: QuestionCategory.PERSONAL_GROWTH,
    label: "Personal Growth",
    icon: GraduationCap,
    description: "Personal development and growth assessment",
  },
];

const questionTypeOptions = [
  {
    value: QuestionType.SINGLE_CHOICE,
    label: "Single Choice",
    icon: CheckSquare,
  },
  {
    value: QuestionType.MULTIPLE_CHOICE,
    label: "Multiple Choice",
    icon: ListChecks,
  },
  { value: QuestionType.SENTIMENT, label: "Sentiment", icon: Star },
  { value: QuestionType.TEXT_BASED, label: "Text", icon: MessageSquare },
];

const sentimentEmojis = [
  {
    sentiment: "Negative",
    emoji: "😞",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    sentiment: "Neutral",
    emoji: "😐",
    color: "text-gray-500",
    bg: "bg-gray-50",
  },
  {
    sentiment: "Positive",
    emoji: "😊",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export function QuestionForm({
  onSubmit,
  onCancel,
  isLoading,
  initialData,
  mode,
}: QuestionFormProps) {
  const [formData, setFormData] = useState<CreateQuestionDto>(
    initialData
      ? {
          title: initialData.text || "",
          description: initialData.description || "",
          questionType: initialData.questionType || QuestionType.SINGLE_CHOICE,
          category: initialData.category || QuestionCategory.GENERAL,
          choices: initialData.choices || [],
          required: initialData.required ?? true,
          validationRules: initialData.validationRules || "",
        }
      : {
          title: "",
          description: "",
          questionType: QuestionType.SINGLE_CHOICE,
          category: QuestionCategory.GENERAL,
          choices: [],
          required: true,
          validationRules: "",
        }
  );

  useEffect(() => {
    // Disable scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, []);

  const [options, setOptions] = useState<OptionItem[]>(
    formData.choices?.map((choice) => ({ text: choice })) || [
      { text: "" },
      { text: "" },
    ]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Question title is required";
    }

    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (
      formData.questionType !== QuestionType.TEXT_BASED &&
      formData.questionType !== QuestionType.SENTIMENT &&
      (!options ||
        options.length < 2 ||
        options.some((opt) => !opt.text || opt.text.trim() === ""))
    ) {
      newErrors.options = "At least two non-empty options are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Ensure all required fields are properly set
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      questionType: formData.questionType,
      category: formData.category,
      choices:
        formData.questionType === QuestionType.TEXT_BASED
          ? []
          : formData.questionType === QuestionType.SENTIMENT
          ? ["NEGATIVE", "NEUTRAL", "POSITIVE"]
          : options.map((opt) => opt.text.trim()).filter((text) => text !== ""),
      required: formData.required ?? true,
      validationRules: formData.validationRules || "",
    };

    console.log("Submitting question data:", submitData);
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              {mode === "create" ? (
                <>
                  <PlusCircle className="h-6 w-6 text-violet-500" />
                  Create New Question
                </>
              ) : (
                <>
                  <Pencil className="h-6 w-6 text-violet-500" />
                  Edit Question
                </>
              )}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-violet-500" />
                    Question Title
                  </label>
                  {errors.title && (
                    <span className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) {
                      setErrors({ ...errors, title: "" });
                    }
                  }}
                  className={cn(
                    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors",
                    errors.title
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-violet-500"
                  )}
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Description
                  </label>
                  {errors.description && (
                    <span className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </span>
                  )}
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) {
                      setErrors({ ...errors, description: "" });
                    }
                  }}
                  className={cn(
                    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors",
                    errors.description
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-violet-500"
                  )}
                  rows={3}
                  placeholder="Add additional context or instructions"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <ListChecks className="h-4 w-4 text-violet-500" />
                    Question Type
                  </label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        questionType: value as QuestionType,
                      })
                    }
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors">
                      <SelectValue placeholder="Select a Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <FolderKanban className="h-4 w-4 text-violet-500" />
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value as QuestionCategory,
                      })
                    }
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.questionType !== QuestionType.TEXT_BASED &&
                formData.questionType !== QuestionType.SENTIMENT && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-violet-500" />
                        Answer Options
                      </label>
                      {errors.options && (
                        <span className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.options}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index].text = e.target.value;
                              setOptions(newOptions);
                              if (errors.options) {
                                setErrors({ ...errors, options: "" });
                              }
                            }}
                            className={cn(
                              "flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors",
                              errors.options
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-violet-500"
                            )}
                            placeholder={`Option ${index + 1}`}
                          />
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = options.filter(
                                  (_, i) => i !== index
                                );
                                setOptions(newOptions);
                              }}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setOptions([...options, { text: "" }])}
                        className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-violet-300 rounded-lg text-violet-600 hover:bg-violet-50 transition-all hover:border-violet-400"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm font-medium">Add Option</span>
                      </button>
                    </div>
                  </div>
                )}

              {formData.questionType === QuestionType.SENTIMENT && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-violet-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Sentiment Options
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {sentimentEmojis.map(({ sentiment, emoji, color, bg }) => (
                      <div
                        key={sentiment}
                        className={cn(
                          "p-3 rounded-lg flex items-center justify-center gap-2",
                          bg
                        )}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className={cn("text-sm font-medium", color)}>
                          {sentiment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) =>
                    setFormData({ ...formData, required: e.target.checked })
                  }
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <label
                  htmlFor="required"
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4 text-violet-500" />
                  Make this question required
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="edit" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    <span>
                      {mode === "edit" ? "Update Question" : "Create Question"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
