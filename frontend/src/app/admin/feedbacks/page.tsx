"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  ClipboardList,
  Filter,
  Search,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  PencilIcon,
  Eye,
  BarChart2,
  Plus,
  RotateCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAlertDialog } from "@/components/ui/alert-dialog";
import {
  getFeedbacks,
  deleteFeedback,
} from "@/lib/api/feedbacks";
import type { Feedback, FeedbackFilters } from "./models/types";
import { FeedbackFormModal } from "./components/FeedbackFormModal";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FeedbacksPage() {
  const { showAlert } = useAlertDialog();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: "",
    active: undefined,
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedFeedback, setSelectedFeedback] = useState<
    Feedback | undefined
  >(undefined);

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFeedbacks(filters);
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      showAlert({
        title: "Error",
        description: "Failed to fetch feedbacks. Please try again.",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, showAlert]);

  useEffect(() => {
    fetchFeedbacks();
  }, [filters, fetchFeedbacks]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await deleteFeedback(id);
      showAlert({
        title: "Success",
        description: "Feedback deleted successfully.",
        variant: "solid",
        color: "success",
      });
      fetchFeedbacks();
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      showAlert({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "solid",
        color: "danger",
      });
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleView = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(undefined);
    setModalMode("create");
  };

  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Feedbacks
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage and track all your feedback forms
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
                onClick={fetchFeedbacks}
                variant="outline"
                icon={<RotateCw className="w-4 h-4 group-hover:animate-spin" />}
                className="group border-black/50 text-black/80"
              >
                Refresh
              </Button>
              <Button
                onClick={() => {
                  setModalMode("create");
                  setIsModalOpen(true);
                }}
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Create Project
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Feedbacks
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feedbacks.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Feedbacks
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feedbacks.filter((f) => f.active).length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Participants
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feedbacks.reduce(
                        (acc, curr) => acc + curr.allowedUserIds.length,
                        0
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Projects
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {new Set(feedbacks.map((f) => f.project.id)).size}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    placeholder="Search feedbacks..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={
                    filters.active === undefined
                      ? "all"
                      : filters.active.toString()
                  }
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      active: value === "all" ? undefined : value === "true",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedbacks List */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                  <p className="text-sm text-gray-500">Loading feedbacks...</p>
                </div>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="p-3 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  No feedbacks found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new feedback form
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="p-6 hover:bg-gray-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        {/* Feedback Header */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-violet-100 rounded-lg">
                            <ClipboardList className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {feedback.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    feedback.active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {feedback.active ? "Active" : "Inactive"}
                                </Badge>
                                {feedback.allowAnonymous && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Anonymous
                                  </Badge>
                                )}
                                <Badge className="bg-purple-100 text-purple-800">
                                  {feedback.allowedUserIds.length} Participants
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {feedback.description}
                            </p>
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="pl-12">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">Project:</span>
                            <span>{feedback.project.name}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Start:{" "}
                                {format(
                                  new Date(feedback.startDate),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                End:{" "}
                                {format(
                                  new Date(feedback.endDate),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/feedbacks/${feedback.id}/satisfaction`
                            )
                          }
                          icon={<BarChart2 className="w-4 h-4" />}
                        >
                          Satisfaction
                        </Button>
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => handleView(feedback)}
                          icon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </Button>
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => handleEdit(feedback)}
                          icon={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="delete"
                          size="sm"
                          onClick={() => handleDelete(feedback.id)}
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

      {/* Create Feedback Form */}
      {isModalOpen && (
        <FeedbackFormModal
          feedback={selectedFeedback}
          mode={modalMode}
          onClose={handleCloseModal}
          onSuccess={() => {
            fetchFeedbacks();
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}
