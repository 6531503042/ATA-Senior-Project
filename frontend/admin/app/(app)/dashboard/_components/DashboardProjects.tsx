"use client";

import { Card, CardBody, CardHeader, Button, Avatar, Chip } from "@heroui/react";
import { EyeIcon, MoreVerticalIcon } from "lucide-react";
import type { Project } from "@/types/dashboard";

interface DashboardProjectsProps {
  projects: Project[];
}

export function DashboardProjects({ projects }: DashboardProjectsProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex justify-between items-center pb-4">
        <div>
          <h3 className="text-xl font-bold text-default-900">
            Recently Projects
          </h3>
          <p className="text-sm text-default-500">
            latest feedback's projects
          </p>
        </div>
        <Button
          variant="light"
          color="primary"
          startContent={<EyeIcon className="w-4 h-4" />}
        >
          View All
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-default-200 hover:bg-default-50 transition-colors"
          >
            <Avatar
              src={project.avatar}
              className="w-12 h-12"
              showFallback
              name={project.title.charAt(0)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-default-900 truncate">
                  {project.title}
                </h4>
                <Chip
                  size="sm"
                  color={getStatusColor(project.status)}
                  variant="flat"
                >
                  {project.status}
                </Chip>
              </div>
              <p className="text-sm text-default-600 mb-2 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-500">
                  {project.participants} Participants
                </span>
                <span className="text-xs text-default-400">
                  {project.createdAt}
                </span>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
} 