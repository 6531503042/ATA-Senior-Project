"use client";

import type { Project } from '@/types/project';
import type { Department } from '@/types/department';

import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Search as SearchIcon, Filter as FilterIcon, Plus as PlusIcon, Building as BuildingIcon, Clock as ClockIcon, ChevronDown as ChevronDownIcon, RefreshCw as RefreshCwIcon, X as XIcon, Layers as LayersIcon } from 'lucide-react';

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
  onCreateClick?: () => void;
  onRefresh?: () => void;
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
  onRefresh,
}: TopContentProps) {
  const hasActiveFilters =
    !!searchTerm ||
    statusFilter !== 'all' ||
    projectFilter !== 'all' ||
    departmentFilter !== 'all' ||
    visibilityFilter !== 'all';

  const clearAll = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onProjectFilterChange('all');
    onDepartmentFilterChange('all');
    onVisibilityFilterChange('all');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            isClearable
            className="w-full"
            placeholder="Search feedbacks by title or description..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            value={searchTerm}
            onClear={() => onSearchChange('')}
            onValueChange={onSearchChange}
            classNames={{
              input: 'text-sm',
              inputWrapper:
                'h-12 bg-white border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 transition-colors duration-200',
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<FilterIcon className="w-4 h-4" />}
                className={`min-w-[140px] ${
                  statusFilter !== 'all'
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Status
                {statusFilter !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">1</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Statuses"
              selectionMode="single"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => onStatusFilterChange(Array.from(keys)[0] as string)}
              className="w-56"
            >
              <DropdownItem key="all">All Status</DropdownItem>
              <DropdownItem key="ACTIVE">Active</DropdownItem>
              <DropdownItem key="COMPLETED">Completed</DropdownItem>
              <DropdownItem key="PENDING">Pending</DropdownItem>
              <DropdownItem key="DRAFT">Draft</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Project Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<BuildingIcon className="w-4 h-4" />}
                className={`min-w-[160px] ${
                  projectFilter !== 'all'
                    ? 'bg-secondary-100 text-secondary-700 border-secondary-300'
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Project
                {projectFilter !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-secondary-500 text-white text-xs rounded-full">1</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Projects"
              selectionMode="single"
              selectedKeys={[projectFilter]}
              onSelectionChange={(keys) => onProjectFilterChange(Array.from(keys)[0] as string)}
              className="w-64"
            >
              <DropdownItem key="all">All Projects</DropdownItem>
              {projects.map((project) => (
                <DropdownItem key={project.id.toString()}>{project.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Department Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<BuildingIcon className="w-4 h-4" />}
                className={`min-w-[160px] ${
                  departmentFilter !== 'all'
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Department
                {departmentFilter !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">1</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Departments"
              selectionMode="single"
              selectedKeys={[departmentFilter]}
              onSelectionChange={(keys) => onDepartmentFilterChange(Array.from(keys)[0] as string)}
              className="w-64"
            >
              <DropdownItem key="all">All Departments</DropdownItem>
              {departments.map((dept) => (
                <DropdownItem key={dept.id.toString()}>{dept.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Visibility Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                variant="flat"
                startContent={<ClockIcon className="w-4 h-4" />}
                className={`min-w-[160px] ${
                  visibilityFilter !== 'all'
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-default-100 text-default-700'
                }`}
              >
                Visibility
                {visibilityFilter !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">1</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Visibility options"
              selectionMode="single"
              selectedKeys={[visibilityFilter]}
              onSelectionChange={(keys) => onVisibilityFilterChange(Array.from(keys)[0] as string)}
              className="w-56"
            >
              <DropdownItem key="all">All Visibility</DropdownItem>
              <DropdownItem key="active">Currently Visible</DropdownItem>
              <DropdownItem key="pending">Not Visible Yet</DropdownItem>
              <DropdownItem key="expired">Expired</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Clear and Refresh */}
          {hasActiveFilters && (
            <Button
              variant="flat"
              color="default"
              startContent={<XIcon className="w-4 h-4" />}
              onPress={clearAll}
              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
            >
              Clear All
            </Button>
          )}

          <Button
            variant="flat"
            color="primary"
            startContent={<RefreshCwIcon className="w-4 h-4" />}
            onPress={onRefresh}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            Refresh
          </Button>

          {onCreateClick && (
            <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />} onPress={onCreateClick}>
              Create Survey
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-default-600">Active filters:</span>
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Search: "{searchTerm}"</span>
          )}
          {statusFilter !== 'all' && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">Status: {statusFilter}</span>
          )}
          {projectFilter !== 'all' && (
            <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full">Project: {projects.find(p => p.id.toString() === projectFilter)?.name || projectFilter}</span>
          )}
          {departmentFilter !== 'all' && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Department: {departments.find(d => d.id.toString() === departmentFilter)?.name || departmentFilter}</span>
          )}
          {visibilityFilter !== 'all' && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">Visibility: {visibilityFilter}</span>
          )}
        </div>
      )}
    </div>
  );
}
