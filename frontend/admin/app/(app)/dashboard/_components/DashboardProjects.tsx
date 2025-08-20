'use client';

import type { Project } from '@/types/dashboard';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Progress,
} from '@heroui/react';
import {
  EyeIcon,
  MoreVerticalIcon,
  FolderIcon,
  UsersIcon,
  CalendarIcon,
} from 'lucide-react';

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

  const getInitials = (title: string) => {
    const words = title.split(' ');

    if (words.length >= 2) {
      return words[0].charAt(0) + words[1].charAt(0);
    }

    return title.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full min-h-[500px]">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <FolderIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-default-900">
              Recent Projects
            </h3>
            <p className="text-sm text-default-500">
              Latest project activities and updates
            </p>
          </div>
        </div>
        <Button
          className="w-full sm:w-auto"
          color="primary"
          size="sm"
          startContent={<EyeIcon className="w-4 h-4" />}
          variant="bordered"
        >
          View All
        </Button>
      </CardHeader>
      <CardBody className="space-y-4 p-4">
        {projects.map(project => (
          <div
            key={project.id}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-default-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-pointer bg-white dark:bg-default-50"
          >
            <Avatar
              showFallback
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow-md"
              name={getInitials(project.title)}
            >
              {getInitials(project.title)}
            </Avatar>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="font-semibold text-default-900 truncate text-base">
                  {project.title}
                </h4>
                <div className="flex items-center gap-2">
                  <Chip
                    className="text-xs font-medium"
                    color={getStatusColor(project.status)}
                    size="sm"
                    variant="flat"
                  >
                    {project.status}
                  </Chip>
                  <div className="flex items-center gap-1 text-xs text-default-500">
                    <UsersIcon className="w-3 h-3" />
                    <span>{project.participants}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-default-600 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-4 text-xs text-default-500">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{project.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Progress: {project.progress}%</span>
                  </div>
                </div>

                <div className="w-full sm:w-32">
                  <Progress
                    className="h-2"
                    color={
                      project.progress >= 80
                        ? 'success'
                        : project.progress >= 60
                          ? 'warning'
                          : 'danger'
                    }
                    value={project.progress}
                  />
                </div>
              </div>
            </div>

            <Button
              isIconOnly
              className="text-default-400 hover:text-default-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              size="sm"
              variant="light"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
