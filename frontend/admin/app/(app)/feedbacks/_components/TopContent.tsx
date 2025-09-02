'use client';

import type { Project } from '@/types/project';
import type { Department } from '@/types/department';

import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Search, Filter, Plus, Building, Clock } from 'lucide-react';

interface TopContentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  projectFilter: string;
  onProjectFilterChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
  visibilityFilter: string;
  onVisibilityFilterChange: (value: string) => void;
  projects: Project[];
  departments: Department[];
  onCreateClick: () => void;
}

export default function TopContent({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  projectFilter,
  onProjectFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  visibilityFilter,
  onVisibilityFilterChange,
  projects,
  departments,
  onCreateClick,
}: TopContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          className="flex-1"
          placeholder="Search feedback surveys..."
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          value={searchTerm}
          onValueChange={onSearchChange}
          variant="bordered"
        />
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onCreateClick}
        >
          Create Survey
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          className="w-full"
          placeholder="Status"
          selectedKeys={[statusFilter]}
          startContent={<Filter className="w-4 h-4 text-gray-400" />}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onStatusFilterChange(selected);
          }}
          variant="bordered"
          aria-label="Filter by status"
        >
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem key="ACTIVE">Active</SelectItem>
          <SelectItem key="COMPLETED">Completed</SelectItem>
          <SelectItem key="PENDING">Pending</SelectItem>
          <SelectItem key="DRAFT">Draft</SelectItem>
        </Select>

        <Select
          className="w-full"
          placeholder="Project"
          selectedKeys={[projectFilter]}
          startContent={<Building className="w-4 h-4 text-gray-400" />}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onProjectFilterChange(selected);
          }}
          variant="bordered"
          aria-label="Filter by project"
        >
          <SelectItem key="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id.toString()}>
              {project.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          className="w-full"
          placeholder="Department"
          selectedKeys={[departmentFilter]}
          startContent={<Building className="w-4 h-4 text-gray-400" />}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onDepartmentFilterChange(selected);
          }}
          variant="bordered"
          aria-label="Filter by department"
        >
          <SelectItem key="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id.toString()}>
              {dept.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          className="w-full"
          placeholder="Visibility"
          selectedKeys={[visibilityFilter]}
          startContent={<Clock className="w-4 h-4 text-gray-400" />}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onVisibilityFilterChange(selected);
          }}
          variant="bordered"
          aria-label="Filter by visibility"
        >
          <SelectItem key="all">All Visibility</SelectItem>
          <SelectItem key="active">Currently Visible</SelectItem>
          <SelectItem key="pending">Not Visible Yet</SelectItem>
          <SelectItem key="expired">Expired</SelectItem>
        </Select>
      </div>
    </div>
  );
}
