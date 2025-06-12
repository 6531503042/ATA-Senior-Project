"use client";

import React, { useState, useEffect } from "react";
import { FolderPlus, X, PencilIcon, Rocket, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/shared/date-picker";
import { TeamSelector } from "../components/TeamSelector";
import {
  createProject,
  updateProject,
  updateProjectMembers,
} from "@/lib/api/projects";
import { useAlertDialog } from "@/components/ui/alert-dialog";
import api from "@/utils/api";
import { User, TeamMember } from "../models/types";
import { Project } from "../models/types";
import { motion } from "framer-motion";
import { FormField } from "@/components/ui/form-field";

interface ProjectFormModalProps {
  project?: Project;
  onClose: () => void;
  mode: "create" | "edit";
}

export function ProjectFormModal({
  project,
  onClose,
  mode,
}: ProjectFormModalProps) {
  const { showAlert } = useAlertDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    projectStartDate: project?.projectStartDate || "",
    projectEndDate: project?.projectEndDate || "",
  });
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    project?.memberIds?.map((id) => ({ id: id.toString(), userId: id })) || [],
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/manager/list");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        showAlert({
          title: "Error",
          description: "Failed to load team members. Please try again.",
          variant: "solid",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [showAlert]);

  useEffect(() => {
    // Disable scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
          showAlert({
            title: "Invalid Date",
            description: "End date must be after start date.",
            variant: "solid",
            color: "warning",
          });
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        projectStartDate: date.toISOString(),
      }));
    } else {
      setFormData((prev) => ({ ...prev, projectStartDate: "" }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDateError("");

      if (formData.projectStartDate) {
        const startDate = new Date(formData.projectStartDate);
        if (date < startDate) {
          showAlert({
            title: "Invalid Date",
            description: "End date must be after start date.",
            variant: "solid",
            color: "warning",
          });
          return;
        }
      }

      setFormData((prev) => ({ ...prev, projectEndDate: date.toISOString() }));
    } else {
      setFormData((prev) => ({ ...prev, projectEndDate: "" }));
    }
  };

  const handleAddMember = (e: React.MouseEvent) => {
    e.preventDefault(); // Explicitly prevent form submission
    setTeamMembers((prev) => [
      ...prev,
      { id: Date.now(), userId: 0 }, // Use a number as id (e.g., Date.now())
    ]);
  };

  const handleRemoveMember = (id: number) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleMemberSelect = (id: number, userId: number) => {
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, userId } : member)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          (member) => member.userId !== 0,
        );
        if (validMembers.length > 0) {
          try {
            await updateProjectMembers(
              projectId,
              validMembers.map((member) => member.userId),
            );
          } catch (memberError) {
            console.error("Failed to update team members:", memberError);
            showAlert({
              title: "Warning",
              description: `Project ${mode === "create" ? "created" : "updated"} but failed to update team members.`,
              variant: "solid",
              color: "warning",
            });
          } finally {
            setIsLoading(false);
          }
        }
      }

      showAlert({
        title: "Success",
        description: `Project ${mode === "create" ? "created" : "updated"} successfully.`,
        variant: "solid",
        color: "success",
      });
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} project:`, error);
      showAlert({
        title: "Error",
        description: `Failed to ${mode} project. Please try again.`,
        variant: "solid",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl mx-auto"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="p-6 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-2 bg-violet-100 rounded-xl"
                  >
                    {mode === "create" ? (
                      <FolderPlus className="h-6 w-6 text-violet-600" />
                    ) : (
                      <PencilIcon className="h-6 w-6 text-violet-600" />
                    )}
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-xl font-semibold text-gray-900"
                    >
                      {mode === "create"
                        ? "Create New Project"
                        : "Edit Project"}
                    </motion.h2>
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-sm text-gray-500"
                    >
                      {mode === "create"
                        ? "Fill in the details to create a new project"
                        : "Update project details"}
                    </motion.p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-violet-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <div className="max-h-[calc(90vh-16rem)] overflow-y-auto">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <FormField
                      label="Project Name"
                      required
                      helpText="Enter a unique project name"
                    >
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Enter project name"
                      />
                    </FormField>

                    <FormField
                      label="Description"
                      required
                      helpText="Provide a detailed project description"
                    >
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Enter project description"
                      />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Start Date" required>
                        <DatePicker
                          date={
                            formData.projectStartDate
                              ? new Date(formData.projectStartDate)
                              : undefined
                          }
                          setDate={handleStartDateChange}
                          error={startDateError}
                          disabled={isLoading}
                          placeholder="Select start date"
                        />
                      </FormField>

                      <FormField label="End Date" required>
                        <DatePicker
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
                          placeholder="Select end date"
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Team Members"
                      helpText={`${teamMembers.filter((m) => m.userId > 0).length} members selected`}
                    >
                      <div className="max-h-[240px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                        <TeamSelector
                          users={users}
                          selectedMembers={teamMembers}
                          onAddMember={handleAddMember}
                          onRemoveMember={handleRemoveMember}
                          onMemberSelect={handleMemberSelect}
                          disabled={isLoading}
                        />
                      </div>
                    </FormField>
                  </div>
                </form>
              </CardContent>
            </div>

            <CardFooter className="flex justify-end gap-3 p-6 bg-gradient-to-r from-gray-50 to-violet-50/50 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="hover:bg-violet-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
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
                      {mode === "create" ? "Create Project" : "Update Project"}
                    </span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
