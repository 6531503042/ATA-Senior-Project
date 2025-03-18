'use client';

import React from 'react';
import { format } from 'date-fns';
import { Project } from '../models/types';
import Table from '@/components/ui/Table';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { FolderPlus } from 'lucide-react';
import { ProjectStatus } from '../models/types';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  actions?: (project: Project) => React.ReactNode;
}

const determineProjectStatus = (project: Project): string => {

  try {
    const currentDate = new Date();
    const startDate = new Date(project.projectStartDate);
    const endDate = project.projectEndDate ? new Date(project.projectEndDate) : null;

    // Debug logging
    console.log('Status Determination:', {
      projectName: project.name,
      currentDate: currentDate.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      isStartInFuture: startDate.getTime() > currentDate.getTime(),
      isEndInPast: endDate ? currentDate.getTime() > endDate.getTime() : false
    });

    // Compare timestamps instead of Date objects
    if (startDate.getTime() > currentDate.getTime()) {
      return ProjectStatus.ON_HOLD;
    }

    if (endDate && currentDate.getTime() > endDate.getTime()) {
      return ProjectStatus.COMPLETED;
    }

    return ProjectStatus.ACTIVE; // Default to active
  } catch (error) {
    console.error('Error determining project status:', error);
    return ProjectStatus.ACTIVE; // Default status on error
  }
};

const getStatusColor = (status: string = ProjectStatus.ACTIVE): string => {
  switch (status.toUpperCase()) {
    case ProjectStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case ProjectStatus.COMPLETED:
      return 'bg-blue-100 text-blue-800';
    case ProjectStatus.ON_HOLD:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status: string = ProjectStatus.ACTIVE): string => {
  return status
    .toUpperCase()
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export function ProjectList({ projects, isLoading, actions }: ProjectListProps) {
  const columns = [
    {
      key: 'name',
      header: 'Project',
      render: (project: Project) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <span className="text-violet-700 font-medium">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{project.name}</div>
            <div className="text-sm text-gray-500 truncate max-w-md">
              {project.description}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'dates',
      header: 'Timeline',
      render: (project: Project) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>Start: {format(new Date(project.projectStartDate), 'MMM d, yyyy')}</span>
          </div>
          {project.projectEndDate && (
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>End: {format(new Date(project.projectEndDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'team',
      header: 'Team',
      render: (project: Project) => (
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project.memberIds.slice(0, 3).map((memberId, index) => (
              <div
                key={memberId}
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                style={{ zIndex: 3 - index }}
              />
            ))}
          </div>
          {project.memberIds.length > 3 && (
            <span className="text-sm text-gray-500">
              +{project.memberIds.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project: Project) => {
        const currentStatus = determineProjectStatus(project);
        return (
          <Badge className={getStatusColor(currentStatus)}>
            {formatStatus(currentStatus)}
          </Badge>
        );
      },
      sortable: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="p-3 bg-violet-50 rounded-full">
            <FolderPlus className="h-8 w-8 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new project.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Table<Project>
      data={projects}
      columns={columns}
      isLoading={isLoading}
      actions={actions}
    />
  );
} 