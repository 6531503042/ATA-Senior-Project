'use client';

import type { ProjectItem } from '@/types/dashboard';

import { Avatar, Progress, Chip, Skeleton } from '@heroui/react';

interface RecentProjectsProps {
  projects: ProjectItem[];
  loading?: boolean;
}

export function RecentProjects({
  projects,
  loading = false,
}: RecentProjectsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-2xl border border-default-200 bg-white shadow-lg hover:shadow-xl transition-all"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
              <Skeleton className="w-full h-2 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="w-16 h-6 rounded" />
              <Skeleton className="w-12 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-default-400 text-xl">📁</span>
        </div>
        <p className="text-default-500 text-sm">No recent projects</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.slice(0, 5).map((project, index) => (
        <div
          key={project.id || index}
          className="flex items-start gap-3 p-4 rounded-2xl border border-default-200 bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
        >
          <Avatar
            className="flex-shrink-0 bg-primary text-white shadow-md"
            name={project.title?.charAt(0) || 'P'}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-default-900 truncate">
                {project.title}
              </p>
              <Chip
                className="ml-2 shadow-sm"
                color="primary"
                size="sm"
                variant="flat"
              >
                {project.status}
              </Chip>
            </div>
            <p className="text-xs text-default-500 truncate mb-2">
              {project.description}
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-default-500">Progress</span>
                <span className="text-default-700 font-medium">
                  {project.progress}%
                </span>
              </div>
              <Progress
                aria-label="project progress"
                className="h-2"
                color="primary"
                size="sm"
                value={project.progress}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-default-500">
                {project.participants} participants
              </span>
              <span className="text-xs text-default-400">
                {project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString()
                  : 'No due date'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
