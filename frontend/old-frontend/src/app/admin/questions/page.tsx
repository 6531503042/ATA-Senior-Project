"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  SquareCheck,
  CircleSlash,
  FileText,
  Loader2,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlertDialog } from "@/components/ui/alert-dialog";

import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/lib/api/questions";
import { Question, QuestionType, CreateQuestionDto } from "./models/types";
import { QuestionForm } from "./components/QuestionForm";

export default function QuestionsPage() {
  const { showAlert } = useAlertDialog();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<QuestionType | "ALL">("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const questionsData = await getAllQuestions();
      setQuestions(questionsData);
    } catch (err) {
      const error = err as Error;
      showAlert({
        title: "Error",
        description:
          error.message || "Failed to fetch questions data. Please try again.",
        variant: "solid",
        color: "danger",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateQuestion = async (data: CreateQuestionDto) => {
    try {
      await createQuestion(data);
      showAlert({
        title: "Success",
        description: "Question created successfully.",
        variant: "solid",
        color: "success",
        duration: 5000,
      });
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      const error = err as Error;
      showAlert({
        title: "Error",
        description:
          error.message || "Failed to create question. Please try again.",
        variant: "solid",
        color: "danger",
        duration: 5000,
      });
    }
  };

  const handleUpdateQuestion = async (data: CreateQuestionDto) => {
    if (!editingQuestion) return;

    try {
      await updateQuestion(editingQuestion.id, data);
      showAlert({
        title: "Success",
        description: "Question updated successfully.",
        variant: "solid",
        color: "success",
        duration: 5000,
      });
      setEditingQuestion(null);
      fetchData();
    } catch (err) {
      const error = err as Error;
      showAlert({
        title: "Error",
        description:
          error.message || "Failed to update question. Please try again.",
        variant: "solid",
        color: "danger",
        duration: 5000,
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteQuestion(id);
      showAlert({
        title: "Success",
        description: "Question deleted successfully.",
        variant: "solid",
        color: "success",
        duration: 5000,
      });
      fetchData();
    } catch (err) {
      const error = err as Error;
      showAlert({
        title: "Error",
        description:
          error.message || "Failed to delete question. Please try again.",
        variant: "solid",
        color: "danger",
        duration: 5000,
      });
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = searchTerm
      ? question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesType =
      selectedType === "ALL" || question.questionType === selectedType;
    return matchesSearch && matchesType;
  });

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

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return <SquareCheck className="h-5 w-5 text-blue-600" />;
      case QuestionType.MULTIPLE_CHOICE:
        return <SquareCheck className="h-5 w-5 text-purple-600" />;
      case QuestionType.SENTIMENT:
        return <SquareCheck className="h-5 w-5 text-yellow-600" />;
      case QuestionType.TEXT_BASED:
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return {
          badge: "bg-blue-100 text-blue-800",
          bgLight: "bg-blue-50",
        };
      case QuestionType.MULTIPLE_CHOICE:
        return {
          badge: "bg-purple-100 text-purple-800",
          bgLight: "bg-purple-50",
        };
      case QuestionType.SENTIMENT:
        return {
          badge: "bg-yellow-100 text-yellow-800",
          bgLight: "bg-yellow-50",
        };
      case QuestionType.TEXT_BASED:
        return {
          badge: "bg-green-100 text-green-800",
          bgLight: "bg-green-50",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800",
          bgLight: "bg-gray-50",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "WORK_ENVIRONMENT":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "WORK_LIFE_BALANCE":
        return <FileText className="h-4 w-4 text-pink-600" />;
      case "TEAM_COLLABORATION":
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case "PROJECT_MANAGEMENT":
        return <FileText className="h-4 w-4 text-purple-600" />;
      case "PROJECT_SATISFACTION":
        return <FileText className="h-4 w-4 text-cyan-600" />;
      case "TECHNICAL_SKILLS":
        return <FileText className="h-4 w-4 text-emerald-600" />;
      case "COMMUNICATION":
        return <FileText className="h-4 w-4 text-orange-600" />;
      case "LEADERSHIP":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "INNOVATION":
        return <FileText className="h-4 w-4 text-yellow-600" />;
      case "PERSONAL_GROWTH":
        return <FileText className="h-4 w-4 text-teal-600" />;
      case "GENERAL":
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "WORK_ENVIRONMENT":
        return "bg-blue-100 text-blue-800";
      case "WORK_LIFE_BALANCE":
        return "bg-pink-100 text-pink-800";
      case "TEAM_COLLABORATION":
        return "bg-indigo-100 text-indigo-800";
      case "PROJECT_MANAGEMENT":
        return "bg-purple-100 text-purple-800";
      case "PROJECT_SATISFACTION":
        return "bg-cyan-100 text-cyan-800";
      case "TECHNICAL_SKILLS":
        return "bg-emerald-100 text-emerald-800";
      case "COMMUNICATION":
        return "bg-orange-100 text-orange-800";
      case "LEADERSHIP":
        return "bg-red-100 text-red-800";
      case "INNOVATION":
        return "bg-yellow-100 text-yellow-800";
      case "PERSONAL_GROWTH":
        return "bg-teal-100 text-teal-800";
      case "GENERAL":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <SquareCheck className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Questions
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage and customize your feedback questions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                icon={<Filter className="w-4 h-4" />}
                className="border-black/50 text-black/80"
              >
                Filters
              </Button>
              <Button
                onClick={() => {
                  fetchData();
                }}
                variant="outline"
                icon={<RotateCw className="w-4 h-4 group-hover:animate-spin" />}
                className="group border-black/50 text-black/80"
              >
                Refresh
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Create Project
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={selectedType}
                  onValueChange={(value) =>
                    setSelectedType(value as QuestionType | "ALL")
                  }
                >
                  <SelectTrigger className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {Object.values(QuestionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0) + word.slice(1).toLowerCase(),
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                  <p className="text-sm text-gray-500">Loading questions...</p>
                </div>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="p-3 bg-gray-100 rounded-full mb-4">
                  <CircleSlash className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  No questions found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="p-6 hover:bg-gray-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        {/* Question Header */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              getQuestionTypeColor(question.questionType)
                                .bgLight
                            }`}
                          >
                            {getQuestionTypeIcon(question.questionType)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {question.text}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    getQuestionTypeColor(question.questionType)
                                      .badge
                                  }
                                >
                                  {getQuestionTypeIcon(question.questionType)}
                                  <span className="ml-1">
                                    {question.questionType
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0) +
                                          word.slice(1).toLowerCase(),
                                      )
                                      .join(" ")}
                                  </span>
                                </Badge>
                                <Badge
                                  className={getCategoryColor(
                                    question.category,
                                  )}
                                >
                                  {getCategoryIcon(question.category)}
                                  <span className="ml-1">
                                    {question.category
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0) +
                                          word.slice(1).toLowerCase(),
                                      )
                                      .join(" ")}
                                  </span>
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {question.description}
                            </p>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="pl-12">
                          {question.choices && question.choices.length > 0 && (
                            <div className="space-y-2">
                              {question.questionType ===
                              QuestionType.SENTIMENT ? (
                                <div className="flex items-center gap-4">
                                  {sentimentEmojis.map(
                                    ({ sentiment, emoji, color, bg }) => (
                                      <div
                                        key={sentiment}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bg}`}
                                      >
                                        <span className="text-2xl">
                                          {emoji}
                                        </span>
                                        <span
                                          className={`text-sm font-medium ${color}`}
                                        >
                                          {sentiment}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : question.questionType ===
                                QuestionType.TEXT_BASED ? (
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <MessageSquare className="h-5 w-5 text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-500">
                                    Text response field
                                  </p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {question.choices.map((choice, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                      {question.questionType ===
                                      QuestionType.SINGLE_CHOICE ? (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                      ) : (
                                        <div className="w-4 h-4 rounded border-2 border-gray-300" />
                                      )}
                                      <span className="text-sm text-gray-700">
                                        {choice}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => setEditingQuestion(question)}
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="delete"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Question Modal */}
      {(isCreateModalOpen || editingQuestion) && (
        <QuestionForm
          mode={editingQuestion ? "edit" : "create"}
          onSubmit={
            editingQuestion ? handleUpdateQuestion : handleCreateQuestion
          }
          onCancel={() => {
            setIsCreateModalOpen(false);
            setEditingQuestion(null);
          }}
          isLoading={isLoading}
          initialData={editingQuestion || undefined}
        />
      )}
    </div>
  );
}
