"use client";

import React, { useState, useEffect } from "react";
import { FolderPlus, X, Rocket, PencilIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Button from "@/components/ui/Button";
import { DatePicker } from "@/components/shared/date-picker";
import { TeamSelector } from "@/components/shared/team-selector";
import {
  createProject,
  updateProject,
  updateProjectMembers,
} from "@/lib/api/projects";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";
import type { User } from "@/types/auth";
import { Project, ProjectStatus } from "../models/types";

interface ProjectFormModalProps {
  project?: Project;
  onClose: () => void;
  mode: "create" | "edit";
}

interface TeamMember {
  id: string;
  userId: number;
}

export function ProjectFormModal({
  project,
  onClose,
  mode,
}: ProjectFormModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    projectStartDate: project?.projectStartDate || "",
    projectEndDate: project?.projectEndDate || "",
    status: project?.status || ProjectStatus.ACTIVE,
  });
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    project?.memberIds?.map((id) => ({ id: id.toString(), userId: id })) || []
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/manager/list");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to load team members. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      // Clear any previous errors
      setStartDateError("");

      // Check if end date needs to be cleared
      if (formData.projectEndDate) {
        const endDate = new Date(formData.projectEndDate);
        if (date > endDate) {
          setFormData((prev) => ({
            ...prev,
            projectStartDate: date.toISOString(),
            projectEndDate: "",
          }));
          setEndDateError("End date must be after start date");
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        projectStartDate: date.toISOString(),
      }));
    } else {
      // If date is cleared
      setFormData((prev) => ({ ...prev, projectStartDate: "" }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      // Clear any previous errors
      setEndDateError("");

      // Validate end date is after start date
      if (formData.projectStartDate) {
        const startDate = new Date(formData.projectStartDate);
        if (date < startDate) {
          setEndDateError("End date must be after start date");
          return;
        }
      }

      setFormData((prev) => ({ ...prev, projectEndDate: date.toISOString() }));
    } else {
      // If date is cleared
      setFormData((prev) => ({ ...prev, projectEndDate: "" }));
    }
  };

  const handleAddMember = () => {
    setTeamMembers((prev) => [...prev, { id: crypto.randomUUID(), userId: 0 }]);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleMemberSelect = (id: string, userId: number) => {
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, userId } : member))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates before submission
    if (formData.projectStartDate && formData.projectEndDate) {
      const startDate = new Date(formData.projectStartDate);
      const endDate = new Date(formData.projectEndDate);

      if (endDate < startDate) {
        setEndDateError("End date must be after start date");
        return;
      }
    }

    setIsLoading(true);

    try {
      let projectId: number;

      if (mode === "create") {
        const projectResponse = await createProject(formData);
        projectId = projectResponse.id;
      } else {
        await updateProject(project!.id, formData);
        projectId = project!.id;
      }

      // Handle team members
      if (teamMembers.length > 0) {
        const validMembers = teamMembers.filter(
          (member) => member.userId !== 0
        );
        if (validMembers.length > 0) {
          try {
            await updateProjectMembers(
              projectId,
              validMembers.map((member) => member.userId)
            );
          } catch (memberError) {
            console.error("Failed to update team members:", memberError);
            toast({
              title: "Warning",
              description: `Project ${
                mode === "create" ? "created" : "updated"
              } but failed to update team members.`,
              variant: "destructive",
            });
          }
        }
      }

      toast({
        title: "Success",
        description: `Project ${
          mode === "create" ? "created" : "updated"
        } successfully.`,
      });
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} project:`, error);
      toast({
        title: "Error",
        description: `Failed to ${mode} project. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in duration-200">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="space-y-1 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-violet-50 rounded-lg">
                    {mode === "create" ? (
                      <FolderPlus className="h-6 w-6 text-violet-600" />
                    ) : (
                      <PencilIcon className="h-6 w-6 text-violet-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {mode === "create"
                        ? "Create New Project"
                        : "Edit Project"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {mode === "create"
                        ? "Fill in the details to create a new project"
                        : "Update project details"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Enter project description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    >
                      {Object.values(ProjectStatus).map((status) => (
                        <option key={status} value={status}>
                          {status
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date"
                      date={
                        formData.projectStartDate
                          ? new Date(formData.projectStartDate)
                          : undefined
                      }
                      setDate={handleStartDateChange}
                      error={startDateError}
                      disabled={isLoading}
                    />

                    <DatePicker
                      label="End Date"
                      date={
                        formData.projectEndDate
                          ? new Date(formData.projectEndDate)
                          : undefined
                      }
                      setDate={handleEndDateChange}
                      minDate={
                        formData.projectStartDate
                          ? new Date(formData.projectStartDate)
                          : undefined
                      }
                      error={endDateError}
                      disabled={isLoading || !formData.projectStartDate}
                    />
                  </div>

                  <div>
                    <TeamSelector
                      users={users}
                      selectedMembers={teamMembers}
                      onAddMember={handleAddMember}
                      onRemoveMember={handleRemoveMember}
                      onMemberSelect={handleMemberSelect}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 p-6 pt-0">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                leftIcon={
                  mode === "create" ? (
                    <Rocket className="h-4 w-4" />
                  ) : (
                    <PencilIcon className="h-4 w-4" />
                  )
                }
              >
                {mode === "create" ? "Create Project" : "Update Project"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
