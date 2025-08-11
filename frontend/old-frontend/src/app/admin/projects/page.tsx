"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectList } from "./components/ProjectList";
import { ProjectFilters } from "./components/ProjectFilters";
import { Project, ProjectStatus, ProjectStats } from "./models/types";
import {
  getProjects,
  deleteProject,
  getProjectMetrics,
} from "@/lib/api/projects";
import { useAlertDialog } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  Filter,
  RotateCw,
  Plus,
} from "lucide-react";
import { ProjectFormModal } from "./components/ProjectFormModal";

export default function ProjectsPage() {
  const router = useRouter();
  const { showAlert } = useAlertDialog();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
  const [selectedProject, setSelectedProject] = React.useState<
    Project | undefined
  >(undefined);
  const [showFilters, setShowFilters] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [projectMetrics, setProjectMetrics] = React.useState<ProjectStats>({
    active: 0,
    teamMembers: 0,
    upcoming: 0,
    completed: 0,
    totalMembers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageTeamSize: 0,
  });
  const [filters, setFilters] = React.useState({
    search: "",
    status: [] as ProjectStatus[],
    startDate: undefined,
    endDate: undefined,
    page: 1,
    limit: 10,
  });

  const fetchProjectMetrics = React.useCallback(async () => {
    try {
      const metrics = await getProjectMetrics();
      setProjectMetrics(metrics);
    } catch (error) {
      console.error("Failed to fetch project metrics:", error);
      showAlert({
        title: "Error",
        description: "Failed to fetch project metrics",
        variant: "solid",
        color: "danger",
      });
    }
  }, [showAlert]);

  const fetchProjects = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getProjects(filters);
      console.log("Projects response:", response);

      if (Array.isArray(response)) {
        setProjects(response);
        if (response.length === 0) {
          showAlert({
            title: "No Projects",
            description: "No projects found matching your criteria.",
            variant: "solid",
            color: "info",
          });
        }
      } else {
        setProjects([]);
        showAlert({
          title: "Warning",
          description: "Invalid response format. Please try again.",
          variant: "solid",
          color: "warning",
        });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);

      if (error instanceof Error) {
        if (
          error.message.includes("401") ||
          error.message.includes("unauthorized")
        ) {
          showAlert({
            title: "Authentication Error",
            description: "Please log in again to continue.",
            variant: "solid",
            color: "danger",
          });
          router.push("/auth/login");
          return;
        }
      }

      showAlert({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch projects. Please try again.",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, showAlert, router]);

  React.useEffect(() => {
    fetchProjects();
    fetchProjectMetrics();
  }, [fetchProjects, fetchProjectMetrics]);

  const handleFilterChange = (name: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (id: number) => {
    const projectToEdit = projects.find((p) => p.id === id);
    if (projectToEdit) {
      setSelectedProject(projectToEdit);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(undefined);
    setModalMode("create");
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    try {
      // First try to delete without cascade
      await deleteProject(id);
      showAlert({
        title: "Success",
        description: "Project deleted successfully.",
        variant: "solid",
        color: "success",
      });
      await fetchProjects();
    } catch (error: any) {
      console.error("Failed to delete project:", error);

      // Check if the error is related to foreign key constraints
      if (error.message && error.message.includes("associated feedbacks")) {
        // Ask for confirmation to delete with cascade
        if (
          confirm(
            "This project has associated feedbacks. Would you like to delete the project and all its feedbacks?",
          )
        ) {
          try {
            await deleteProject(id, true); // Call with cascade=true
            showAlert({
              title: "Success",
              description:
                "Project and all associated feedbacks deleted successfully.",
              variant: "solid",
              color: "success",
            });
            await fetchProjects();
          } catch (cascadeError: any) {
            console.error(
              "Failed to delete project with cascade:",
              cascadeError,
            );
            showAlert({
              title: "Error",
              description:
                cascadeError?.message ||
                "Failed to delete project and feedbacks. Please try again.",
              variant: "solid",
              color: "danger",
            });
          }
        }
      } else {
        // Show the original error
        showAlert({
          title: "Error",
          description:
            error?.message || "Failed to delete project. Please try again.",
          variant: "solid",
          color: "danger",
        });
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track all your projects in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>

              <Button
                onClick={() => {
                  fetchProjects();
                  fetchProjectMetrics();
                }}
                variant="outline"
                icon={<RotateCw className="w-4 h-4 group-hover:animate-spin" />}
                className="group"
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

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <PlusIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Projects
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {projectMetrics.totalProjects}
                    </dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-green-50 rounded-lg p-3">
                      <ChevronDownIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Active Projects
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {projectMetrics.activeProjects}
                    </dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <ChevronDownIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Completed Projects
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {projectMetrics.completedProjects}
                    </dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <ChevronDownIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Members
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      {projectMetrics.totalMembers}
                    </dd>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6 bg-white shadow-sm">
            <div className="p-4">
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </Card>
        )}

        {/* Project List */}
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <ProjectList
              projects={projects}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              actions={(project) => (
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="edit"
                    size="sm"
                    onClick={() => handleEdit(project.id)}
                    icon={<PencilIcon className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="delete"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    icon={<TrashIcon className="w-4 h-4" />}
                  >
                    Delete
                  </Button>
                </div>
              )}
            />
          </div>
        </Card>
      </div>

      {/* Project Form Modal */}
      {isModalOpen && (
        <ProjectFormModal
          project={selectedProject}
          mode={modalMode}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
